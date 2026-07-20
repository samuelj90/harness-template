# Coding standards (language-agnostic)

- Small units: functions do one thing; files under ~300 lines; no God classes (see `examples/bad/god-class/`).
- Names say what, comments say why; no comment restates code.
- Immutability by default; mutation is a documented exception.
- No dead code, no commented-out code — git remembers.
- Errors per `architecture/error-handling.md`; logs per `architecture/logging.md`.
- Per-language specifics live beside the code they govern (e.g. lint configs); this file states intent, tools enforce it.
