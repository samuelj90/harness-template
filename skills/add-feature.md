# Skill: add-feature

**Goal** — Implement a new capability without degrading the architecture.
**Inputs** — A task description; the `context/` doc(s) for affected domains.
**Outputs** — Code + tests + updated context doc if domain knowledge changed; ADR if an architectural choice was made.

## Constraints
- Respect `architecture/dependency-rules.md`; new code lands per `architecture/layering.md` placement test.
- No new dependency without one-sentence justification.

## Process
1. Read the relevant `context/` docs; list `ASSUMPTION:`s for anything missing.
2. Write a 3–5 line plan: which layers change, which don't.
3. Implement smallest vertical slice first (entrypoint → use case → domain), tests alongside.
4. Extend, keeping each commit green.
5. Run `checklists/feature.md`, then `verification/` files for architecture and testing.
6. Self-evaluate per `verification/self-evaluation.md`.

## Checklist (defines done)
- [ ] Feature checklist passed
- [ ] Tests cover the new behavior incl. one failure path
- [ ] Context doc updated if the domain changed
- [ ] No dependency-rule violations

## Anti-patterns
- Starting in adapters/controllers and letting business logic settle there.
- "Flexible" abstractions for callers that don't exist yet.
