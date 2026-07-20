# Skill: fix-bug

**Goal** — Remove a defect and the class of defect where cheap.
**Inputs** — Reproduction or failing report; affected `context/` doc.
**Outputs** — Failing test that reproduces → fix → green; baseline improvement if the bug reveals a knowledge gap.

## Constraints
- No fix without a test that failed before the fix.
- Diagnose before editing: state the cause in one sentence first. If you cannot, you are not ready to edit.

## Process
1. Reproduce with a test at the lowest layer that exhibits the bug.
2. State root cause (one sentence). Distinguish cause from symptom.
3. Fix at the cause layer; do not patch call sites around it.
4. Sweep for the same pattern elsewhere; fix or file.
5. Run `checklists/bugfix.md`; propose baseline change if the bug was preventable (see `docs/continuous-improvement.md`).

## Checklist (defines done)
- [ ] Reproducing test existed and failed first
- [ ] Root cause stated in the PR description
- [ ] Same-pattern sweep done

## Anti-patterns
- Symptom-patching (null-check at the crash site instead of fixing the producer).
- Fix bundled with drive-by refactors — separate PRs.
