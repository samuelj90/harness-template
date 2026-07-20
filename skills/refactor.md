# Skill: refactor

**Goal** — Improve structure with provably unchanged behavior.
**Inputs** — Target smell/goal; existing test coverage of the area.
**Outputs** — Restructured code, identical behavior, tests still meaningful.

## Constraints
- Behavior changes are forbidden in a refactor PR. If you find a bug, note it; separate PR.
- If coverage is too thin to prove safety, first PR adds characterization tests only.

## Process
1. Verify safety net; add characterization tests if needed.
2. Small mechanical steps (rename → extract → move), each leaving green.
3. Delete what the refactor obsoleted — the point is less code, not moved code.
4. Run `verification/architecture.md` — refactors must reduce, never add, rule violations.

## Checklist (defines done)
- [ ] Zero behavior change (tests unmodified except relocations)
- [ ] Net complexity down (fewer lines/deps/branches — say which)

## Anti-patterns
- "Refactor" PRs that quietly change behavior.
- Introducing an abstraction layer as the refactor's product.
