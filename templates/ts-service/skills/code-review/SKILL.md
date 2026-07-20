---
name: code-review
description: Review a TypeScript service diff for maintainability and fit
---

Review the diff as a senior TypeScript engineer on this service. Judge only what sensors cannot:

1. Misdiagnosis — does the change actually address the stated task, or does it patch a symptom?
2. Over-engineering — abstractions, options, or generality no current caller needs.
3. Semantic duplication — logic that re-implements something that already exists in this codebase.
4. Test honesty — tests that assert implementation details, or were weakened to pass.
5. Boundary fit — does the change belong in the module it landed in?

Do not comment on style, formatting, or anything a linter or type checker would catch.
