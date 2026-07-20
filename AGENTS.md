# Engineering Baseline — Agent Entry Point

You are working in a repository governed by an AI Engineering Baseline. Everything you need is in the repo; do not ask for context that a file below already provides.

## Navigation (read on demand, not all at once)
- What we build & how it's organized → `architecture/architecture.md`
- What's allowed / forbidden → `architecture/dependency-rules.md`, `standards/`
- Why decisions were made → `architecture/adr/`
- Domain knowledge for the area you're touching → `context/<domain>.md`
- The process for your kind of task → `skills/<task>.md` (feature, bugfix, refactor, tests, review, docs)
- What "done" means → the matching file in `checklists/` and `verification/`
- Patterns to imitate / avoid → `examples/good/`, `examples/bad/`

## Core rules (always apply)
1. Follow the matching skill in `skills/` for your task type; its checklist defines done.
2. Never violate `architecture/dependency-rules.md`. If a rule blocks you, stop and say so — do not work around it.
3. Verification over generation: after any change, execute the relevant `verification/` checklist against your own work before declaring completion.
4. Prefer editing over adding; prefer deleting over both. New dependencies need one-sentence justification.
5. When information is missing, mark assumptions explicitly with `ASSUMPTION:` and continue; never silently guess domain facts.
6. If you repeat a mistake the baseline should have prevented, propose the baseline change (rule / skill / example / checklist) as part of your output — see `docs/continuous-improvement.md`.

## Workflow for every task
intake → pick skill → read linked context → plan briefly → implement in small steps → run verification checklist → self-evaluate (`verification/self-evaluation.md`) → summarize with scorecard.
