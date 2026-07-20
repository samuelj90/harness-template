import type { HarnessConfig } from "./types.js";

/** Implemented in the guides-sync slice. */
export function sync(_config: HarnessConfig, _cwd: string): string[] {
  throw new Error("sync: not implemented yet");
}
