# <Service Name>

<!-- Seed guide for a Python service. Replace placeholders; keep it short and imperative. -->

## What this service is
One paragraph: purpose, consumers, the one invariant that must never break.

## Commands
- `pytest -q` — tests
- `ruff check . && mypy src` — lint + types
- `npx harness sense --stage pre-commit` — all fast sensors; MUST pass before any task is done

## Conventions
- Python 3.12+, full type hints; mypy clean, no `type: ignore` without a linked issue
- Hexagonal layout: `src/domain` is pure — no imports from adapters/entrypoints (enforced by import-linter)
- Plain functions and dataclasses over class hierarchies
- New dependencies need one-sentence justification; default answer is no

## How to work here
- Sensors run after every edit (post-edit stage). Fix what they report before continuing.
- You cannot finish while pre-commit sensors fail; the report tells you exactly what to fix.
