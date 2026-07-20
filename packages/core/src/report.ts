import type { StageRun } from "./types.js";

/**
 * Feedback optimized for LLM consumption: grouped, pointer-precise, with fix
 * instructions inline — the "positive prompt injection" a sensor should emit.
 */
export function formatForAgent(run: StageRun, maxChars: number): string {
  if (run.ok) return "";
  const lines: string[] = [
    `Harness sensors failed at stage '${run.stage}'. Fix ONLY the issues below, then re-check.`,
  ];
  for (const result of run.results.filter((r) => !r.ok)) {
    lines.push(`\n[${result.sensor}]`);
    for (const s of result.signals.filter((x) => x.severity !== "info").slice(0, 50)) {
      const loc = s.file ? `${s.file}${s.line ? `:${s.line}` : ""} — ` : "";
      lines.push(`- ${loc}${s.message}${s.fix ? `\n  fix: ${s.fix}` : ""}`);
    }
  }
  const text = lines.join("\n");
  return text.length > maxChars ? `${text.slice(0, maxChars)}\n… (truncated)` : text;
}

export function formatForHuman(run: StageRun): string {
  const lines = run.results.map((r) => {
    const state = r.skipped ? `skip (${r.skipped})` : r.ok ? "ok" : `FAIL (${r.signals.length})`;
    return `${r.ok && !r.skipped ? "✓" : r.skipped ? "-" : "✗"} ${r.sensor} [${r.kind}] ${state} ${r.durationMs}ms`;
  });
  lines.push(run.ok ? `stage '${run.stage}': PASS` : `stage '${run.stage}': FAIL`);
  return lines.join("\n");
}
