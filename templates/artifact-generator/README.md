# Harness template: artifact generator

For repos whose deliverable is a structured artifact (integration manifests, configs, IaC) rather than code. This is a **behaviour harness** in the narrow, tractable case where behaviour is fully specifiable as a JSON Schema.

- **Guide (feedforward):** the schema is the vocabulary — enums over free strings (Ashby: variety reduction).
- **Sensor (feedback):** ajv over `artifacts/`, pointer-precise, with fix instructions per violation.
- **Loop:** with `harness install`, Claude Code's Stop hook blocks completion until the schema sensor passes — the agent's own loop is the repair loop. No custom orchestrator needed.

## Adopt
```bash
cp -r templates/artifact-generator/{harness.config.json,AGENTS.md,schemas} <your-repo>/
cd <your-repo> && npm i -D @harness/core && npx harness install
```
Replace the demo schema with your artifact contract; add command sensors (spectral, gitleaks, contract tests) as your gates grow.
