import { spawn } from "node:child_process";
import type { CommandSensorConfig, SensorResult } from "../types.js";
import { PARSERS } from "./parsers.js";

/** Computational sensor: run a deterministic tool, parse its output into signals. */
export function runCommandSensor(cfg: CommandSensorConfig, cwd: string): Promise<SensorResult> {
  const start = Date.now();
  return new Promise((res) => {
    const child = spawn(cfg.command, { cwd, shell: true });
    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => child.kill("SIGTERM"), cfg.timeoutMs ?? 120_000);
    child.stdout.on("data", (d: Buffer) => (stdout += d.toString()));
    child.stderr.on("data", (d: Buffer) => (stderr += d.toString()));
    child.on("close", (code) => {
      clearTimeout(timeout);
      const parser = PARSERS[cfg.parser ?? "generic"];
      let signals = parser(cfg.name, stdout, stderr, code ?? 1);
      // A structured parser that found nothing on a failing run still needs a signal.
      if ((code ?? 1) !== 0 && signals.length === 0) {
        signals = PARSERS.generic(cfg.name, stdout, stderr, code ?? 1);
      }
      if (cfg.fixHint) {
        signals = signals.map((s) => (s.severity === "error" ? { ...s, fix: s.fix ?? cfg.fixHint } : s));
      }
      res({
        sensor: cfg.name,
        kind: "command",
        ok: !signals.some((s) => s.severity === "error"),
        signals,
        durationMs: Date.now() - start,
      });
    });
  });
}
