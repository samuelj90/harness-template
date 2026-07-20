# Harness template: Python service

Ruff + mypy + pytest + import-linter sensors staged left-to-right, inferential review in CI, seed AGENTS.md for a hexagonal Python service.

## Adopt
```bash
cp -r templates/python-service/{harness.config.json,AGENTS.md,skills,.importlinter} <your-service>/
cd <your-service>
pip install ruff mypy pytest import-linter
npm i -D @harness/core          # the harness CLI is Node-based; sensors are your Python tools
npx harness install && npx harness sync
npx harness sense --stage pre-commit
```
