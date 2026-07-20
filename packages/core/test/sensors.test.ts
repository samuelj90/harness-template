import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PARSERS } from "../src/sensors/parsers.js";
import { runStage } from "../src/sensors/index.js";
import { formatForAgent } from "../src/report.js";
import type { HarnessConfig } from "../src/types.js";

test("tsc parser extracts file, line, severity", () => {
  const out = "src/a.ts(12,5): error TS2322: Type 'string' is not assignable.\nsrc/b.ts(3,1): warning TS6133: unused.";
  const signals = PARSERS.tsc("types", out, "", 2);
  assert.equal(signals.length, 2);
  assert.deepEqual(
    { file: signals[0].file, line: signals[0].line, severity: signals[0].severity },
    { file: "src/a.ts", line: 12, severity: "error" },
  );
});

test("eslint parser reads json format", () => {
  const out = JSON.stringify([
    { filePath: "/x/a.ts", messages: [{ line: 4, severity: 2, message: "no-unused-vars", ruleId: "no-unused-vars" }] },
  ]);
  const signals = PARSERS.eslint("lint", out, "", 1);
  assert.equal(signals[0].severity, "error");
  assert.equal(signals[0].line, 4);
});

test("mypy parser skips notes", () => {
  const out = "src/a.py:9: error: Incompatible return value\nsrc/a.py:9: note: See docs";
  const signals = PARSERS.mypy("types", out, "", 1);
  assert.equal(signals.length, 1);
});

function baseConfig(sensors: HarnessConfig["sensors"]): HarnessConfig {
  return {
    sensors,
    review: { command: "true", argsTemplate: [] },
    guides: { canonical: "AGENTS.md", skillsDir: "skills" },
    report: { maxChars: 6000 },
  };
}

test("stage runner: filters by stage, optional sensors never fail the stage", async () => {
  const cwd = mkdtempSync(join(tmpdir(), "harness-"));
  const config = baseConfig([
    { name: "pass", kind: "command", command: "true", stages: ["pre-commit"] },
    { name: "fail-optional", kind: "command", command: "false", stages: ["pre-commit"], optional: true },
    { name: "not-this-stage", kind: "command", command: "false", stages: ["ci"] },
  ]);
  const run = await runStage(config, "pre-commit", cwd);
  assert.equal(run.ok, true);
  assert.deepEqual(run.results.map((r) => r.sensor), ["pass", "fail-optional"]);
});

test("schema sensor emits pointer-precise signals with fix instructions", async () => {
  const cwd = mkdtempSync(join(tmpdir(), "harness-"));
  mkdirSync(join(cwd, "artifacts"));
  writeFileSync(
    join(cwd, "schema.json"),
    JSON.stringify({ type: "object", required: ["kind"], properties: { kind: { enum: ["demo"] } } }),
  );
  writeFileSync(join(cwd, "artifacts/bad.json"), JSON.stringify({ kind: "nope" }));
  const config = baseConfig([
    { name: "schema", kind: "schema", dir: "artifacts", schema: "schema.json", stages: ["post-edit"] },
  ]);
  const run = await runStage(config, "post-edit", cwd);
  assert.equal(run.ok, false);
  assert.match(run.results[0].signals[0].message, /\/kind/);
  assert.match(run.results[0].signals[0].fix ?? "", /artifacts\/bad.json/);
  const report = formatForAgent(run, 6000);
  assert.match(report, /Fix ONLY/);
  assert.match(report, /fix: Edit artifacts\/bad.json/);
});

test("command sensor with structured parser falls back to generic on unparsed failure", async () => {
  const cwd = mkdtempSync(join(tmpdir(), "harness-"));
  const config = baseConfig([
    { name: "types", kind: "command", command: "echo boom && exit 3", parser: "tsc", stages: ["ci"] },
  ]);
  const run = await runStage(config, "ci", cwd);
  assert.equal(run.ok, false);
  assert.match(run.results[0].signals[0].message, /exit 3/);
});
