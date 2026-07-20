# <Service Name>

<!-- Seed guide for a TypeScript service. Replace the placeholders; keep it short and imperative. -->

## What this service is
One paragraph: purpose, consumers, the one invariant that must never break.

## Commands
- `npm test` — unit tests (Vitest/node:test)
- `npm run build` — tsc build
- `npx harness sense --stage pre-commit` — run all fast sensors; MUST pass before you consider any task done

## Conventions
- TypeScript strict; no `any`, no `@ts-ignore` without a linked issue
- Functions over classes unless state demands otherwise
- New dependencies require one-sentence justification in the PR description; default answer is no
- Module boundaries are enforced by dependency-cruiser — if a sensor blocks an import, move the code, don't loosen the rule

## How to work here
- After every file edit, sensors run automatically (post-edit stage). Fix what they report before moving on.
- You cannot finish while pre-commit sensors fail; their output tells you exactly what to fix.
- Skills in `skills/` describe how to review and how to test; read them when the task touches those activities.
