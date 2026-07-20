import { execFileSync, execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { HarnessConfig, ReviewSensorConfig, SensorResult, Signal } from "../types.js";

/**
 * Inferential sensor: LLM-as-judge over the current diff, guided by a skill.
 * Expects the judge to answer with `VERDICT: approve|revise` plus findings,
 * one per line, as `- [file[:line]] message`.
 */
export function runReviewSensor(
  cfg: ReviewSensorConfig,
  harness: HarnessConfig,
  cwd: string,
): SensorResult {
  const start = Date.now();
  let diff = "";
  try {
    diff = execSync(`git diff ${cfg.diffBase ?? "HEAD"} --unified=3`, { cwd }).toString();
  } catch {
    /* not a git repo or no base — review whatever we can */
  }
  if (!diff.trim()) {
    return { sensor: cfg.name, kind: "review", ok: true, signals: [], durationMs: 0, skipped: "no diff" };
  }
  const skill = readFileSync(resolve(cwd, cfg.skill), "utf8");
  const prompt = [
    skill,
    "\nReview the following diff strictly against the instructions above.",
    "Answer with a line `VERDICT: approve` or `VERDICT: revise`,",
    "then findings, one per line: `- [<file>:<line>] <problem> -> <fix instruction>`.",
    "\n```diff",
    diff.slice(0, 60_000),
    "```",
  ].join("\n");

  let output = "";
  try {
    const args = harness.review.argsTemplate.map((a) => a.replaceAll("{prompt}", prompt));
    output = execFileSync(harness.review.command, args, {
      cwd,
      timeout: cfg.timeoutMs ?? 300_000,
      maxBuffer: 10 * 1024 * 1024,
    }).toString();
  } catch (e) {
    return {
      sensor: cfg.name,
      kind: "review",
      ok: true,
      signals: [{ sensor: cfg.name, severity: "info", message: `review unavailable: ${(e as Error).message.slice(0, 200)}` }],
      durationMs: Date.now() - start,
      skipped: "judge failed",
    };
  }

  const revise = /VERDICT:\s*revise/i.test(output);
  const signals: Signal[] = [...output.matchAll(/^- \[([^\]\n]*)\] (.+)$/gm)].map((m) => {
    const [file, line] = m[1].split(":");
    const [message, fix] = m[2].split("->").map((s) => s.trim());
    return {
      sensor: cfg.name,
      severity: revise ? "error" : ("warn" as const),
      file: file || undefined,
      line: line ? Number(line) : undefined,
      message,
      fix,
    };
  });
  if (revise && signals.length === 0) {
    signals.push({ sensor: cfg.name, severity: "error", message: output.trim().slice(0, 500) });
  }
  return { sensor: cfg.name, kind: "review", ok: !revise, signals, durationMs: Date.now() - start };
}
