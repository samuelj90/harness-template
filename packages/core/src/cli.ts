#!/usr/bin/env node
import { loadConfig } from "./config.js";
import { runStage } from "./sensors/index.js";
import { formatForAgent, formatForHuman } from "./report.js";
import type { Stage } from "./types.js";

const [, , cmd, ...rest] = process.argv;
const cwd = process.cwd();

function flag(name: string): string | undefined {
  const i = rest.indexOf(`--${name}`);
  return i !== -1 ? rest[i + 1] : undefined;
}

async function main(): Promise<number> {
  if (cmd === "sense") {
    const config = loadConfig(cwd);
    const stage = (flag("stage") ?? "pre-commit") as Stage;
    const format = flag("format") ?? "human";
    const run = await runStage(config, stage, cwd);
    if (format === "json") console.log(JSON.stringify(run, null, 2));
    else if (format === "agent") console.log(formatForAgent(run, config.report.maxChars) || "all sensors passed");
    else console.log(formatForHuman(run));
    return run.ok ? 0 : 1;
  }
  if (cmd === "sync") {
    const { sync } = await import("./sync.js");
    for (const p of sync(loadConfig(cwd), cwd)) console.log(`wrote ${p}`);
    return 0;
  }
  if (cmd === "install") {
    const { install } = await import("./hooks/install.js");
    install(cwd);
    return 0;
  }
  if (cmd === "hook" && rest[0] === "claude") {
    const { claudeHook } = await import("./hooks/claude.js");
    return claudeHook(cwd);
  }
  console.error("usage: harness <sense|sync|install|hook claude> [--stage s] [--format human|agent|json]");
  return 2;
}

main().then((code) => process.exit(code));
