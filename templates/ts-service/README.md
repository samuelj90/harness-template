# Harness template: TypeScript service

An opinionated outer harness for a TS service: type/lint/test/architecture sensors staged left-to-right, an inferential review sensor in CI, and a seed AGENTS.md.

## Adopt
```bash
cp -r templates/ts-service/{harness.config.json,AGENTS.md,skills,.dependency-cruiser.cjs} <your-service>/
cd <your-service>
npm i -D @harness/core dependency-cruiser eslint typescript
npx harness install     # Claude Code hooks + git pre-commit + CI snippet
npx harness sync        # fan skills out to .claude/ and .github/
npx harness sense --stage pre-commit
```
Edit AGENTS.md placeholders and the dependency-cruiser boundaries to your layout. The review sensor is optional and needs a `claude` CLI (or change `review.command`).
