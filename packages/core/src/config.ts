import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { HarnessConfig } from "./types.js";

const DEFAULTS = {
  review: { command: "claude", argsTemplate: ["-p", "{prompt}"] },
  guides: { canonical: "AGENTS.md", skillsDir: "skills" },
  report: { maxChars: 6000 },
};

export function loadConfig(cwd: string = process.cwd()): HarnessConfig {
  const raw = JSON.parse(
    readFileSync(resolve(cwd, "harness.config.json"), "utf8"),
  ) as Partial<HarnessConfig>;
  if (!raw.sensors?.length) throw new Error("harness.config.json: at least one sensor is required");
  return {
    sensors: raw.sensors,
    review: { ...DEFAULTS.review, ...raw.review },
    guides: { ...DEFAULTS.guides, ...raw.guides },
    report: { ...DEFAULTS.report, ...raw.report },
  };
}
