# ADR-001: Adopt an AI Engineering Baseline

- **Status**: accepted
- **Date**: 2026-07-18

## Context
Multiple coding agents (Copilot, Claude Code, Duo, Cursor…) work in our repositories. Each has its own loop and conventions; prompting knowledge ad hoc per session produces inconsistent results and loses lessons.

## Decision
The repository itself carries the harness: architecture contract, context docs, skills, checklists, verification, examples, and ADRs — with per-agent shim files generated from one canonical `AGENTS.md`. No custom orchestration framework, no model SDKs.

## Consequences
Easier: consistent output across agents; onboarding (human and AI) from the repo alone; knowledge compounds via the continuous-improvement loop. Harder: docs are now load-bearing and must be maintained; stale knowledge misleads agents, so the improvement loop is mandatory, not optional.

## Alternatives considered
- Custom orchestration framework — rejected: maintenance without benefit when agents already own their loops.
- Per-tool instruction files maintained by hand — rejected: drift; generation from canonical source instead.
