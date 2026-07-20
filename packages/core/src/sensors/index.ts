import type { HarnessConfig, SensorResult, Stage, StageRun } from "../types.js";
import { runCommandSensor } from "./command.js";
import { runSchemaSensor } from "./schema.js";
import { runReviewSensor } from "./review.js";

/** Run every sensor registered for a stage. Optional sensors never fail the stage. */
export async function runStage(config: HarnessConfig, stage: Stage, cwd: string): Promise<StageRun> {
  const results: SensorResult[] = [];
  for (const sensor of config.sensors.filter((s) => s.stages.includes(stage))) {
    const result =
      sensor.kind === "command"
        ? await runCommandSensor(sensor, cwd)
        : sensor.kind === "schema"
          ? runSchemaSensor(sensor, cwd)
          : runReviewSensor(sensor, config, cwd);
    results.push(sensor.optional && !result.ok ? { ...result, ok: true } : result);
  }
  return { stage, ok: results.every((r) => r.ok), results };
}
