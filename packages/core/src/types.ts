/**
 * Harness model (after Böckeler / VS Code "coding harness"):
 * - GUIDES feed forward: AGENTS.md, skills — they steer the agent before it acts.
 * - SENSORS feed back: they observe after the agent acts and produce signals
 *   the agent (or a human) uses to self-correct.
 * - STAGES place each sensor in the change lifecycle: keep quality left.
 */

/** Where in the lifecycle a sensor runs. Earlier = cheaper to fix. */
export type Stage = "post-edit" | "pre-commit" | "ci" | "continuous";

export type Severity = "error" | "warn" | "info";

/** One observation from a sensor, optimized for LLM self-correction. */
export interface Signal {
  sensor: string;
  severity: Severity;
  file?: string;
  line?: number;
  message: string;
  /** Direct instruction for the agent — "positive prompt injection". */
  fix?: string;
}

export interface SensorResult {
  sensor: string;
  kind: SensorKind;
  ok: boolean;
  signals: Signal[];
  durationMs: number;
  skipped?: string;
}

export type SensorKind = "command" | "schema" | "review";

/** Built-in output parsers for command sensors. */
export type ParserName = "generic" | "tsc" | "eslint" | "ruff" | "mypy";

export interface CommandSensorConfig {
  name: string;
  kind: "command";
  /** Computational: deterministic tool run by the CPU (lint, types, tests…). */
  command: string;
  parser?: ParserName;
  stages: Stage[];
  /** Optional sensors report but never fail a stage. */
  optional?: boolean;
  /** Appended to every error signal from this sensor. */
  fixHint?: string;
  timeoutMs?: number;
}

export interface SchemaSensorConfig {
  name: string;
  kind: "schema";
  /** Computational: ajv-validate every *.json in dir against the schema. */
  dir: string;
  schema: string;
  stages: Stage[];
  optional?: boolean;
}

export interface ReviewSensorConfig {
  name: string;
  kind: "review";
  /** Inferential: LLM-as-judge over the current diff, guided by a skill file. */
  skill: string;
  /** Diff base for review context. Default "HEAD". */
  diffBase?: string;
  stages: Stage[];
  optional?: boolean;
  timeoutMs?: number;
}

export type SensorConfig = CommandSensorConfig | SchemaSensorConfig | ReviewSensorConfig;

export interface HarnessConfig {
  sensors: SensorConfig[];
  /** CLI used by inferential sensors. {prompt} is substituted. */
  review: { command: string; argsTemplate: string[] };
  guides: { canonical: string; skillsDir: string };
  report: { maxChars: number };
}

export interface StageRun {
  stage: Stage;
  ok: boolean;
  results: SensorResult[];
}
