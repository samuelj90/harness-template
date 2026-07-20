/** Architecture-fitness rules (edit to your module layout). */
module.exports = {
  forbidden: [
    { name: "no-circular", severity: "error", from: {}, to: { circular: true } },
    {
      name: "domain-stays-pure",
      comment: "domain/ must not import adapters/ or entrypoints/",
      severity: "error",
      from: { path: "^src/domain" },
      to: { path: "^src/(adapters|entrypoints)" },
    },
  ],
  options: { doNotFollow: { path: "node_modules" } },
};
