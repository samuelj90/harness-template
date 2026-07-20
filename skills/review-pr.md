# Skill: review-pr

**Goal** — Judge what mechanical checks cannot; keep feedback actionable.
**Inputs** — The diff, PR description, linked task, relevant `context/` docs.
**Outputs** — Verdict (approve / request changes) + findings, each with a concrete fix.

## Process
1. Read the task first; then judge the diff against the *task*, not just the code: does it solve the right problem? (misdiagnosis is the #1 agent failure)
2. Check: over-engineering, semantic duplication with existing code, boundary fit per `architecture/`, test honesty per `standards/testing-standards.md`.
3. Skip anything a linter/type-checker/CI already enforces — never bikeshed style.
4. Format findings: `- [file:line] problem → fix instruction`.

## Checklist (defines done)
- [ ] Verdict stated with the one deciding reason
- [ ] Every finding has a fix instruction
- [ ] Zero style comments

## Anti-patterns
- Approving because tests are green (tests may be weak); demanding rewrites without pointing at the rule violated.
