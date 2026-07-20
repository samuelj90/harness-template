import type { ParserName, Severity, Signal } from "../types.js";

type Parser = (sensor: string, stdout: string, stderr: string, exitCode: number) => Signal[];

/** tsc: `src/a.ts(12,5): error TS2322: ...` */
const tsc: Parser = (sensor, stdout) =>
  [...stdout.matchAll(/^(.+?)\((\d+),\d+\): (error|warning) (TS\d+: .+)$/gm)].map((m) => ({
    sensor,
    severity: m[3] === "error" ? "error" : ("warn" as Severity),
    file: m[1],
    line: Number(m[2]),
    message: m[4],
  }));

/** eslint --format json */
const eslint: Parser = (sensor, stdout) => {
  try {
    const files = JSON.parse(stdout) as {
      filePath: string;
      messages: { line?: number; severity: number; message: string; ruleId?: string }[];
    }[];
    return files.flatMap((f) =>
      f.messages.map((m) => ({
        sensor,
        severity: m.severity === 2 ? "error" : ("warn" as Severity),
        file: f.filePath,
        line: m.line,
        message: m.ruleId ? `${m.message} (${m.ruleId})` : m.message,
      })),
    );
  } catch {
    return [];
  }
};

/** ruff --output-format json */
const ruff: Parser = (sensor, stdout) => {
  try {
    const items = JSON.parse(stdout) as {
      filename: string;
      location?: { row?: number };
      code?: string;
      message: string;
    }[];
    return items.map((i) => ({
      sensor,
      severity: "error" as Severity,
      file: i.filename,
      line: i.location?.row,
      message: i.code ? `${i.message} (${i.code})` : i.message,
    }));
  } catch {
    return [];
  }
};

/** mypy: `src/a.py:12: error: ...` */
const mypy: Parser = (sensor, stdout) =>
  [...stdout.matchAll(/^(.+?):(\d+): (error|warning|note): (.+)$/gm)]
    .filter((m) => m[3] !== "note")
    .map((m) => ({
      sensor,
      severity: m[3] === "error" ? "error" : ("warn" as Severity),
      file: m[1],
      line: Number(m[2]),
      message: m[4],
    }));

/** generic: non-zero exit -> one error with the output tail */
const generic: Parser = (sensor, stdout, stderr, exitCode) => {
  if (exitCode === 0) return [];
  const tail = `${stdout}\n${stderr}`.trim().split("\n").slice(-15).join("\n");
  return [{ sensor, severity: "error", message: `exit ${exitCode}:\n${tail}` }];
};

export const PARSERS: Record<ParserName, Parser> = { generic, tsc, eslint, ruff, mypy };
