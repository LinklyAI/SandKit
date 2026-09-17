# Contributing

Thanks for helping make SandKit more expressive and easier to use.

## Run and check

Use Node.js 22+; no installation is required. Start with `node scripts/serve.mjs`.

Before opening a pull request:

```sh
node scripts/check.mjs
node --test tests/*.test.js
node scripts/build.mjs
```

For rendering or editor changes, also open the showcase and editor in a browser. Check a settled image, a transition, text, light/dark mode and a narrow viewport. For sampling changes, test visible behavior and deterministic invariants rather than snapshots of implementation text.

## Scope

- Keep the core framework-independent and avoid runtime dependencies unless justified.
- Update `src/options.js` when changing a public numeric parameter; the editor consumes this schema.
- Keep image and depth transforms synchronized; never hide alignment problems by independent resizing.
- Include only artwork you can redistribute, with provenance.
- Preserve source buffers for Worker fallback and dispose every listener/buffer you create.
- Keep UI strings, comments and errors in English. Design notes may be in Chinese.
- Use pnpm for any Node dependency changes. The existing scripts also run directly with Node.

Use Conventional Commit titles. Explain the user-visible problem, the change, and validation. Small focused pull requests are easier to review. Do not include generated build output.

Contributions are accepted under the repository's MIT license. Trademark rights are separate.
