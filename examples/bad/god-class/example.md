# Bad: God class

```ts
class OrderManager {
  createOrder(...) {}        // domain logic
  validateCard(...) {}       // payment concern
  sendConfirmation(...) {}   // notification concern
  exportToCsv(...) {}        // reporting concern
  retryFailedWebhooks(...) {}// infrastructure concern
  // 1400 more lines…
}
```

**The smell:** one class accumulates every concern that touches "order"; every feature edits this file, every test drags all its dependencies, merge conflicts are constant.

**Recognition cues for agents:** class name ending in Manager/Helper/Util with unrelated verbs; constructor taking 6+ collaborators; file > 300 lines.

**Instead:** one use case per file in `application/`, cross-cutting concerns behind ports. Violates: `standards/coding-standards.md` (small units), `architecture/layering.md`.
