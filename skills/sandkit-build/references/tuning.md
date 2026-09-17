# Tuning decisions

The source of truth is `src/options.js` in a SandKit checkout. It exports `DEFAULTS`, `PARAMETERS` and `normalizeOptions`. Each numeric parameter has limits, step, description and a `rebuild` flag.

- Too dense: reduce `fillDensity`, `interiorTone`, `pointSize` or count. Avoid blurring fine texture more and more.
- Flat: supply a registered depth map, increase `depthRange` modestly, then `tilt` and `depthContrast`.
- Distorted at rest: keep orthographic projection; depth should alter position through rotation, not perspective scaling.
- Motion looks like a rigid panel: increase `stagger`, keep radial scattering, and inspect `scatterPhase`.
- Too restless: reduce `jitter`, `sway`, `dustShare`, increase `holdMs`.
- Slow loading: reduce source resolution to about 800px and sample in Worker. Do not transfer away the sole source buffers needed for fallback.
- GPU cost: reduce count and point size. DPR is capped at 2; hardware budgets may reduce the requested count.
- Changing position: `offsetX/offsetY` trigger per-grain flights; `layoutMs/layoutPuff` control them.

Sampling controls: `count`, `shadeVariation`, `depthRange`, `dustShare`, `blurRadius`, `fillDensity`, `interiorTone`, plus entrance cloud geometry. Other exposed controls update without rebuilding the renderer. Entrance duration affects replay; transition duration affects the next transition.

Editor JSON is an envelope with `version`, `source`, `text`, `typography`, `options`, `dark`. Pass only `config.options` to `setOptions`; build shape sources separately. Shared URLs encode settings and built-in sample names, not local files.
