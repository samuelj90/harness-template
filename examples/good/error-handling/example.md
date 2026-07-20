# Good: error handling at the right layer

```ts
// application/cancel-order.ts — use case: decides, doesn't format
export async function cancelOrder(orders: OrderRepo, id: OrderId): Promise<void> {
  const order = await orders.get(id);            // repo throws NotFoundError
  order.cancel();                                 // domain enforces invariants, throws AlreadyShippedError
  await orders.save(order);
}

// entrypoints/http/orders.ts — edge: translates, exactly once
router.post("/orders/:id/cancel", async (req, res) => {
  try {
    await cancelOrder(repo, OrderId.parse(req.params.id));
    res.status(204).end();
  } catch (e) {
    if (e instanceof AlreadyShippedError)
      return problem(res, 409, "Order already shipped", req.traceId);
    if (e instanceof NotFoundError)
      return problem(res, 404, "Order not found", req.traceId);
    log.error({ traceId: req.traceId, err: e }, "cancel-order failed");
    return problem(res, 500, "Internal error", req.traceId);
  }
});
```

**Why it's good:** domain owns the invariant, use case stays format-free, the edge translates each failure once, unknown errors are logged once with cause + traceId and never leak internals. Rules: `architecture/error-handling.md`, `architecture/api-patterns.md`.
