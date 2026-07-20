# Skill: write-docs

**Goal** — Documentation that an agent or newcomer can act on without asking questions.
**Inputs** — The change or domain to document.
**Outputs** — Updated `context/` doc (≤150 lines), ADR if a decision was made, README deltas.

## Process
1. Decide the layer: decision → ADR; domain knowledge → context/; process → skills/; done-criteria → checklists/.
2. Write for the reader mid-task: imperative, concrete paths, no history lessons.
3. Delete superseded text — stale docs mislead agents worse than no docs.

## Checklist (defines done)
- [ ] Right layer chosen; no duplication across layers
- [ ] Under length budget; links instead of repetition
- [ ] A newcomer could act on it without follow-up questions

## Anti-patterns
- Narrating code line-by-line; "documentation PRs" that only add, never prune.
