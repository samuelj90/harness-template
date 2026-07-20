# Artifact generator

Agents in this repo generate declarative JSON artifacts; a runtime elsewhere executes them. Agents never execute anything here.

## Contract
- Write artifacts only into `artifacts/`, conforming exactly to `schemas/artifact.schema.json`.
- Machine files are pure JSON: enums only, no invented values, no prose.
- If required information is missing, use the literal string "GAP" and stop; do not guess.
- Schema sensors run after every edit and gate completion. When they report violations, fix ONLY the listed pointers.

## Why this works
Behaviour is regulated by variety reduction: the schema (enums over strings) is the vocabulary you may use, and the Stop hook keeps you working until sensors pass — your own loop is the repair loop.
