import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sync } from "../src/sync.js";
import type { HarnessConfig } from "../src/types.js";

const config: HarnessConfig = {
  sensors: [{ name: "x", kind: "command", command: "true", stages: ["ci"] }],
  review: { command: "true", argsTemplate: [] },
  guides: { canonical: "AGENTS.md", skillsDir: "skills" },
  report: { maxChars: 6000 },
};

test("sync copies skills to both tool locations and writes the Copilot pointer", () => {
  const cwd = mkdtempSync(join(tmpdir(), "harness-"));
  writeFileSync(join(cwd, "AGENTS.md"), "# guide");
  mkdirSync(join(cwd, "skills/code-review"), { recursive: true });
  writeFileSync(join(cwd, "skills/code-review/SKILL.md"), "---\nname: code-review\n---\nreview well");
  const written = sync(config, cwd);
  assert.ok(existsSync(join(cwd, ".claude/skills/code-review/SKILL.md")));
  assert.ok(existsSync(join(cwd, ".github/skills/code-review/SKILL.md")));
  assert.match(readFileSync(join(cwd, ".github/copilot-instructions.md"), "utf8"), /AGENTS.md/);
  assert.equal(written.length, 3);
});

test("sync fails loudly when the canonical guide is missing", () => {
  const cwd = mkdtempSync(join(tmpdir(), "harness-"));
  assert.throws(() => sync(config, cwd), /AGENTS.md not found/);
});
