# Authentication (example context doc — replace with yours)

## Purpose
Verifies caller identity and issues session context. NOT responsible for authorization decisions — those live in each domain's policy layer.

## Key concepts
- **Principal** — authenticated identity; immutable once issued.
- **Token** — short-lived JWT; refresh handled only at the edge, never inside services.

## Interactions
- Depends on: identity provider (via `adapters/idp`), clock.
- Consumed by: every entrypoint via middleware; nothing below entrypoints reads raw tokens.

## Invariants & traps
- Tokens are validated at the edge exactly once; inner layers trust the Principal object, never re-parse JWTs.
- Trap: adding roles to the token payload — roles change faster than token TTL; resolve them per request instead.

## Where things live
- Code: `src/adapters/auth/` · Middleware: `src/entrypoints/http/middleware/`
