# Verification

The biggest lesson from studying production coding harnesses: **generation isn't the important part — verification is.** Agents generate plausibly; these files make "done" checkable.

Each file is an executable-by-reading checklist: an agent (or reviewer) walks it against the actual diff and answers each line honestly, quoting evidence (file:line) for any ✓ that isn't obvious. A ✗ means the task is not done — fix or explicitly escalate.

Run the files matching your task, then finish with `self-evaluation.md`. Mechanical versions of these checks belong in CI (see `docs/loop-engineering.md`); these documents are the source of truth the mechanical checks implement.
