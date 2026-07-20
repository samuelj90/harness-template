import { existsSync, mkdirSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
import { join } from "node:path";

const HOOK_CMD = "npx --no-install harness hook claude";

const CLAUDE_HOOKS = {
  PostToolUse: [
    { matcher: "Edit|Write|MultiEdit|NotebookEdit", hooks: [{ type: "command", command: HOOK_CMD }] },
  ],
  Stop: [{ hooks: [{ type: "command", command: HOOK_CMD }] }],
};

/**
 * Wire the harness into the change lifecycle, left to right:
 *   .claude/settings.json  -> post-edit + stop sensing inside the agent loop
 *   .git/hooks/pre-commit  -> pre-commit stage for humans and agents alike
 *   stdout                 -> CI snippet for the 'ci' stage
 * Copilot and Duo have no user-facing hook API today; for them the pre-commit
 * hook, the CI stage, and AGENTS.md instructions are the integration surface.
 */
export function install(cwd: string): void {
  // 1. Claude Code hooks (merge-preserving)
  const claudeDir = join(cwd, ".claude");
  mkdirSync(claudeDir, { recursive: true });
  const settingsPath = join(claudeDir, "settings.json");
  const settings = existsSync(settingsPath)
    ? (JSON.parse(readFileSync(settingsPath, "utf8")) as Record<string, unknown>)
    : {};
  settings.hooks = { ...(settings.hooks as object | undefined), ...CLAUDE_HOOKS };
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  console.log(`wrote ${settingsPath} (PostToolUse + Stop hooks)`);

  // 2. git pre-commit
  const gitHooks = join(cwd, ".git", "hooks");
  if (existsSync(gitHooks)) {
    const pre = join(gitHooks, "pre-commit");
    writeFileSync(pre, "#!/bin/sh\nexec npx --no-install harness sense --stage pre-commit\n");
    chmodSync(pre, 0o755);
    console.log(`wrote ${pre}`);
  } else {
    console.log("skip git pre-commit hook (.git/hooks not found)");
  }

  // 3. CI snippet
  console.log(`
Add to CI (GitHub Actions / GitLab CI):
  - run: npx --no-install harness sense --stage ci --format human
GitLab example job:
  harness:
    script: [npm ci, npx harness sense --stage ci]`);
}
