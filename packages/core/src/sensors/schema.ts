import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { Ajv2020 } from "ajv/dist/2020.js";
import type { SchemaSensorConfig, SensorResult, Signal } from "../types.js";

const ajv = new Ajv2020({ allErrors: true, strict: false });

/** Computational sensor: validate every *.json in dir against a JSON Schema. */
export function runSchemaSensor(cfg: SchemaSensorConfig, cwd: string): SensorResult {
  const start = Date.now();
  const signals: Signal[] = [];
  const dir = resolve(cwd, cfg.dir);
  if (!existsSync(dir)) {
    return { sensor: cfg.name, kind: "schema", ok: true, signals, durationMs: 0, skipped: `${cfg.dir} absent` };
  }
  const schema = JSON.parse(readFileSync(resolve(cwd, cfg.schema), "utf8"));
  const validate = ajv.compile(schema);
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    let data: unknown;
    try {
      data = JSON.parse(readFileSync(join(dir, file), "utf8"));
    } catch (e) {
      signals.push({ sensor: cfg.name, severity: "error", file: join(cfg.dir, file), message: `invalid JSON: ${(e as Error).message}` });
      continue;
    }
    if (!validate(data)) {
      for (const err of validate.errors ?? []) {
        signals.push({
          sensor: cfg.name,
          severity: "error",
          file: join(cfg.dir, file),
          message: `${err.instancePath || "/"}: ${err.message}${err.params ? ` ${JSON.stringify(err.params)}` : ""}`,
          fix: `Edit ${join(cfg.dir, file)} so ${err.instancePath || "the document"} satisfies the schema at ${cfg.schema}. Change nothing else.`,
        });
      }
    }
  }
  return {
    sensor: cfg.name,
    kind: "schema",
    ok: signals.length === 0,
    signals,
    durationMs: Date.now() - start,
  };
}
