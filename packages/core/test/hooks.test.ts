import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { claudeHook } from "../src/hooks/claude.js";
import { install } from "../src/hooks/install.js";

function project(sensorCommand: string): string {
  const cwd = mkdtempSync(join(tmpdir(), "harness-"));
  writeFileSync(
    join(cwd, "harness.config.json"),
    JSON.stringify({
      sensors: [
        { name: "check", kind: "command", command: sensorCommand, stages: ["post-edit", "pre-commit"] },
      ],
    }),
  );
  return cwd;
}

function capture(stream: "log" | "error", fn: () => Promise<number>): Promise<{ code: number; out: string }> {
  const original = console[stream];
  let out = "";
  console[stream] = (msg: unknown) => (out += String(msg));
  return fn().then((code) => {
    console[stream] = original;
    return { code, out };
  });
}

test("PostToolUse on an edit tool: failing sensor exits 2 with agent report on stderr", async () => {
  const cwd = project("echo nope && exit 1");
  const { code, out } = await capture("error", () =>
    claudeHook(cwd, JSON.stringify({ hook_event_name: "PostToolUse", tool_name: "Edit" })),
  );
  assert.equal(code, 2);
  assert.match(out, /Fix ONLY/);
});

test("PostToolUse on a non-edit tool is a no-op", async () => {
  const cwd = project("exit 1");
  const code = await claudeHook(cwd, JSON.stringify({ hook_event_name: "PostToolUse", tool_name: "Bash" }));
  assert.equal(code, 0);
});

test("Stop with failing pre-commit stage blocks via JSON decision", async () => {
  const cwd = project("exit 1");
  const { code, out } = await capture("log", () =>
    claudeHook(cwd, JSON.stringify({ hook_event_name: "Stop", stop_hook_active: false })),
  );
  assert.equal(code, 0);
  const decision = JSON.parse(out);
  assert.equal(decision.decision, "block");
  assert.match(decision.reason, /stage 'pre-commit'/);
});

test("Stop respects stop_hook_active to avoid infinite blocking", async () => {
  const cwd = project("exit 1");
  const { code, out } = await capture("log", () =>
    claudeHook(cwd, JSON.stringify({ hook_event_name: "Stop", stop_hook_active: true })),
  );
  assert.equal(code, 0);
  assert.equal(out, "");
});

test("install writes merged Claude settings and preserves existing keys", () => {
  const cwd = mkdtempSync(join(tmpdir(), "harness-"));
  mkdirSync(join(cwd, ".claude"));
  writeFileSync(join(cwd, ".claude/settings.json"), JSON.stringify({ model: "opus" }));
  const orig = console.log;
  console.log = () => {};
  install(cwd);
  console.log = orig;
  const settings = JSON.parse(readFileSync(join(cwd, ".claude/settings.json"), "utf8"));
  assert.equal(settings.model, "opus");
  assert.ok(settings.hooks.PostToolUse);
  assert.ok(settings.hooks.Stop);
});
