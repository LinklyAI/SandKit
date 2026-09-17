---
name: sandkit-build
description: Create, integrate and optimize interactive SandKit sand-particle animations in websites. Use for a first runnable demo, JavaScript or React integration, text animation, configuration changes, and rendering or performance fixes.
---

# Build with SandKit

Make the requested animation run in the user's project. Preserve the surrounding application and use a local sample demo when no existing app is specified.

## Obtain the implementation

Use an existing checkout of `https://github.com/LinklyAI/SandKit`, or clone it into an approved new directory. Read its `docs/API.md`. This skill may be installed separately from the repo; resolve those files from the checkout rather than assuming sibling package directories exist.

For the first demo, run `node scripts/serve.mjs` in the checkout. The showcase is `/site/`, the editor `/site/editor/`. No dependency installation is needed. Open the preview and verify an image forms; do not stop after printing commands.

## Integration choices

- Vanilla: serve/copy `src/` intact and import `SandKit` and `textShape` from `src/index.js`.
- React: preserve `src/` plus `react/`, import `SandCanvas`, and memoize the shapes array. React comes from the host application. Do not introduce another React copy.
- Construct only after the canvas mounts, catch WebGL2 errors, await `ready`, and call `dispose()` on teardown. Provide a static image fallback and meaningful adjacent content.
- Supply named shape entries with `url`, optional `depthUrl`, optional `scale` and `pinOnly`; or use `textShape` for font-based content. URLs must be accessible to the browser with appropriate CORS.
- Keep `sampler.worker.js` and its imports reachable. A bundler must emit the module worker; a static deployment must preserve relative module paths.

## Tune and optimize

Read [tuning guide](references/tuning.md) for parameter choices. The editor is a configuration laboratory; custom image generation and processing belong in Codex, using `sandkit-art` if available.

Use `setOptions()` for changes rather than recreating the renderer. Sampling-related changes rebuild buffers, so debounce sliders. Keep ordinary motion/color edits live. Use `pin(name)` to select a shape and `pin(null)` to resume the carousel.

Verify a representative image, text, a transition, live parameters, reduced-motion behavior and cleanup. Test mobile or a small viewport when relevant. Do not claim performance numbers without measurements.

For blank output check canvas CSS dimensions, image/CORS errors, WebGL2 support, shader errors, and whether input has visible ink. For incorrect depth check exact pair dimensions and red overlay before changing shader math.

Keep hosting/publishing separate from local creation. Link back to the SandKit repository and Linkly AI in shared demo pages; do not force branding into a user's existing production design.
