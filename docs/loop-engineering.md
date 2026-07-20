# Loop engineering

Every modern coding agent already runs a loop: **think → act → observe → think again** (a *turn* of many *rounds*, in VS Code's terms). We never rebuild that loop. Loop engineering is placing controls around it:

- **Guides (feedforward)** steer the agent *before* it acts — everything in this baseline: AGENTS.md, architecture contract, context, skills, examples.
- **Sensors (feedback)** observe *after* it acts so it self-corrects — checklists, verification files, linters, type checkers, tests, CI, review.

Two execution types: **computational** (deterministic, fast — linters, type checks, tests, dependency rules) and **inferential** (LLM judgment — the review-pr skill, self-evaluation). Computational sensors run on every change; inferential ones where judgment is worth the cost.

## Keep quality left
Place each sensor at the earliest stage it's cheap enough to run:

| Stage | Sensors | Wire-up |
|---|---|---|
| In-loop (as the agent edits) | lint, type check, fast tests | agent hook surface where available (below); otherwise the skill's process step "run X after each change" |
| Pre-commit | full lint+types, unit tests, dependency rules, secret scan | git pre-commit hook |
| CI | everything above + integration tests, coverage, `verification/` checklists as review comment, inferential review | pipeline |
| Continuous | dead-code, dependency vulnerabilities, drift vs `architecture/` | scheduled jobs |

The best sensor output is **feedback optimized for the agent**: pointer-precise (`file:line`), with a fix instruction — a positive prompt injection. Configure linters/custom rules to say *what to do*, not just what's wrong.

## Wiring per tool (no framework needed)
- **Claude Code** — hooks in `.claude/settings.json`: a `PostToolUse` hook running your fast checks (non-zero exit + stderr goes straight back to the model mid-turn), a `Stop` hook running pre-commit checks to block "done" until green.
- **Copilot / Cursor / Windsurf / Cline** — no user hook API today: encode the same discipline as instructions ("after every edit run `<fast check>`; you are not done until `<pre-commit check>` passes") — they follow it — plus git pre-commit and CI as the hard backstop.
- **GitLab Duo** — reads AGENTS.md natively; CI *is* its sensor stage (flows run pipelines).
- **Codex / Gemini CLI** — AGENTS.md/GEMINI.md instructions + the same git/CI backstops.

## The workflow (task lifecycle through the loop)
```
intake ──▶ pick skill (skills/) ──▶ read context (context/, architecture/)
   ──▶ plan briefly ──▶ generate in small steps
        ◀──── in-loop sensors (lint/types/fast tests) ────┐
   ──▶ run checklists (checklists/<task>.md)              │ self-correct
   ──▶ run verification (verification/*.md)  ─────────────┘
   ──▶ self-evaluate (verification/self-evaluation.md)
   ──▶ PR ──▶ CI sensors + inferential review ──▶ merge
   └──▶ lessons → continuous improvement (docs/continuous-improvement.md)
```

## The steering loop (the human's loop around everything)
When an agent repeats a mistake, the fix is rarely a better prompt — it's a better harness: add the rule, the example, the checklist line, or the sensor that would have caught it. Guides prevent; sensors catch; you steer.
