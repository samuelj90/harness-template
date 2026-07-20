import { loadConfig } from "../config.js";
import { runStage } from "../sensors/index.js";
import { formatForAgent } from "../report.js";

interface ClaudeHookInput {
  hook_event_name?: string;
  tool_name?: string;
  stop_hook_active?: boolean;
}

/**
 * Claude Code hook adapter. Wire via .claude/settings.json (see install.ts).
 * Reads the hook event JSON from stdin and runs the matching sensor stage:
 *
 * - PostToolUse (Edit|Write|MultiEdit|NotebookEdit): runs the fast
 *   'post-edit' stage. On failure exits 2 with the agent-formatted report on
 *   stderr — Claude Code feeds that back to the model in the SAME turn, so
 *   the agent self-corrects immediately instead of after review.
 * - Stop: runs the 'pre-commit' stage. On failure emits
 *   {"decision":"block","reason":...} so the agent keeps working until
 *   sensors pass — the agent's own loop becomes the repair loop.
 *   stop_hook_active guards against infinite blocking.
 */
export async function claudeHook(cwd: string, stdin?: string): Promise<number> {
  const raw = stdin ?? (await readStdin());
  let input: ClaudeHookInput = {};
  try {
    input = JSON.parse(raw) as ClaudeHookInput;
  } catch {
    /* tolerate empty/bad stdin: treat as manual invocation of post-edit */
  }
  const config = loadConfig(cwd);

  if (input.hook_event_name === "Stop") {
    if (input.stop_hook_active) return 0; // already looping on our block once; let it stop
    const run = await runStage(config, "pre-commit", cwd);
    if (!run.ok) {
      console.log(
        JSON.stringify({
          decision: "block",
          reason: formatForAgent(run, config.report.maxChars),
        }),
      );
    }
    return 0;
  }

  // PostToolUse (default path)
  const editTools = /^(Edit|Write|MultiEdit|NotebookEdit)$/;
  if (input.tool_name && !editTools.test(input.tool_name)) return 0;
  const run = await runStage(config, "post-edit", cwd);
  if (!run.ok) {
    console.error(formatForAgent(run, config.report.maxChars));
    return 2; // exit 2 = blocking feedback shown to the model
  }
  return 0;
}

function readStdin(): Promise<string> {
  return new Promise((res) => {
    let data = "";
    process.stdin.on("data", (d) => (data += d.toString()));
    process.stdin.on("end", () => res(data));
    if (process.stdin.isTTY) res("");
  });
}
