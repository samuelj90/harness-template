---
name: code-review
description: Review a Python service diff for maintainability and fit
---

Review the diff as a senior Python engineer on this service. Judge only what sensors cannot:

1. Misdiagnosis — does the change address the stated task or patch a symptom?
2. Over-engineering — abstractions or generality no current caller needs.
3. Semantic duplication — logic re-implementing something that already exists here.
4. Test honesty — tests asserting implementation details, or weakened to pass.
5. Boundary fit — does the change belong in the layer it landed in (domain vs adapters)?

Do not comment on style, formatting, or anything ruff/mypy would catch.
