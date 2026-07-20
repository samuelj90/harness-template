# Skill: add-tests

**Goal** — Raise real confidence in an under-tested area.
**Inputs** — Target area; its `context/` doc invariants.
**Outputs** — Behavior-focused tests; a note on what remains untested and why.

## Process
1. List the behaviors and invariants (from context doc), not the functions.
2. Test each through the public interface: happy path, one failure path, boundary.
3. Prefer table/parameterized cases over near-duplicate tests.
4. Run mutation-style sanity check: would each test fail if the behavior broke? Delete any that couldn't.

## Checklist (defines done)
- [ ] Each test maps to a stated behavior/invariant
- [ ] No test asserts private internals
- [ ] Remaining gaps listed explicitly

## Anti-patterns
- Coverage-driven assert-free tests; snapshot tests as a substitute for thought.
