# harness-template

A generic **outer harness** for coding agents, in the sense of [harness engineering (Böckeler/Fowler)](https://martinfowler.com/articles/harness-engineering.html) and the [VS Code coding harness](https://code.visualstudio.com/blogs/2026/05/15/agent-harnesses-github-copilot-vscode): the agent owns the think→act→observe loop; this harness supplies the **guides** that steer it before it acts and the **sensors** that feed back after, placed as far left in the lifecycle as they can run.

```
guides (feedforward)          agent loop            sensors (feedback)
AGENTS.md, skills      →   think→act→observe   ←   post-edit: types, lint, schema
                                  ↑                 pre-commit: tests, architecture
                                  └─ self-correct ─ ci: review agent, expensive checks
```

## Concepts (packages/core)
- **Sensors** — *computational* (command sensors with tsc/eslint/ruff/mypy parsers; ajv schema sensor) and *inferential* (LLM-as-judge review sensor guided by a skill). Every error signal can carry a `fix` instruction: feedback optimized for LLM consumption.
- **Stages** — `post-edit` → `pre-commit` → `ci` → `continuous`. Fast sensors run earliest; a sensor registers for the stages it's cheap enough to run in.
- **Guides** — one canonical `AGENTS.md` (read natively by Claude Code, Copilot, GitLab Duo) plus `skills/`; `harness sync` fans skills out per tool.
- **Hooks** — `harness install` wires the loop: Claude Code `PostToolUse` re-checks after every edit *inside the agent's turn*; the `Stop` hook blocks completion until pre-commit sensors pass, making the agent's own loop the repair loop. Plus git pre-commit and a CI snippet.

## Agent/tool support
| Tool | Guides | In-loop sensing | Out-of-loop sensing |
|---|---|---|---|
| Claude Code | AGENTS.md + `.claude/skills/` | ✅ PostToolUse + Stop hooks | pre-commit, CI |
| GitHub Copilot | AGENTS.md + `.github/skills/` + instructions pointer | ⚠️ no user hook API today — AGENTS.md instructs running `harness sense` | pre-commit, CI |
| GitLab Duo | AGENTS.md (native) | ⚠️ same | pre-commit, CI (Duo flows run CI) |
| Any model/CLI | AGENTS.md | via its own hook surface, if any | pre-commit, CI |

## Harness templates (templates/)
Pre-canned guide+sensor bundles per topology — pick one, copy, adapt:
- **ts-service** — tsc, eslint, tests, dependency-cruiser architecture fitness, review skill
- **python-service** — ruff, mypy, pytest, import-linter domain purity, review skill
- **artifact-generator** — schema-as-vocabulary behaviour harness; Stop hook as repair loop

## Quick start
```bash
npm install && npm test
cp -r templates/ts-service/* your-project/   # or python-service / artifact-generator
cd your-project && npx harness install && npx harness sync
npx harness sense --stage pre-commit
```

## CLI
`harness sense --stage <post-edit|pre-commit|ci> [--format human|agent|json]` · `harness install` · `harness sync` · `harness hook claude` (used by hooks, reads stdin)

## The steering loop (your job)
When the agent repeats a mistake, don't re-prompt — improve the harness: tighten a rule in AGENTS.md, add a sensor, or add a `fixHint`. Guides prevent; sensors catch; you steer.

Dependencies: `ajv`. Node 22.
