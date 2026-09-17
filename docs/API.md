# API

## `new SandKit(canvas, settings)`

Browser-only; call after mounting a canvas with nonzero CSS dimensions. Imports are safe outside the browser; construction is not. `settings` accepts:

| Field | Meaning |
| --- | --- |
| `shapes` | Non-empty array of uniquely named sources |
| `options` | Partial numeric/color settings from `DEFAULTS` |
| `worker` | Defaults to true; false forces main-thread sampling |
| `onStatus` | Receives loading, ready (count/names) or error status |
| `onError` | Receives nonfatal depth/renderer warnings |

Catch construction errors (including unavailable WebGL2) and `await instance.ready`. A source is `{ name, url, depthUrl?, scale?, pinOnly? }`, or `{ name, raster: async () => ({line, depth}), ... }`. A raster is `{w,h,data:Uint8ClampedArray}` with RGBA data. Missing depth uses inferred relief. A source-provided mismatched raster pair rejects loading; a missing/mismatched URL depth warns and falls back.

## Lifecycle

- `await setShapes(sources)`: sample and replace the sequence. Latest request wins. Existing animation stays while sampling; failure leaves it intact. An all-white image has no shape.
- `await setOptions(patch)`: normalize values, update live uniforms or resample when required. New sampling replays the entrance. Debounce repeated sampling edits.
- `pin(name)`: once the current transition finishes, move to that named shape and hold. Unknown names select the first shape. `pin(null)` returns to the eligible carousel.
- `replay()`: replay entrance to the selected/first shape.
- `pause()` / `resume()`: freeze/unfreeze animation time. Hidden pages also pause time.
- `dispose()`: cancel sampling and frames, remove listeners and release GL objects. Safe to call twice.

`pinOnly` excludes a source from automatic cycling, but it can be selected explicitly. A single shape rests after entrance. Reduced-motion mode displays the selected shape without continuous frames or pointer tilt.

## Parameters

Import `PARAMETERS` to discover all numeric settings, labels, bounds, steps, group and `rebuild` flags. `normalizeOptions(patch, base)` clamps known finite values and ignores unknown values. `color` and `colorDark` accept CSS colors. Dark mode uses the root `dark` class or `data-theme="dark"`.

Projection stays orthographic. `depthRange` influences depth coordinates; rotation then creates parallax. `depthContrast` changes grain size/opacity by depth. A depth map is artistic relief, not geometry suitable for reconstruction.

`count` is a requested budget; low-core devices use 60%, DPR ≥2 uses another 90%. DPR itself is capped at 2.

## Text

`textShape(text, {name, scale, fontFamily, fontWeight, letterSpacing, extrude})` returns a source. `letterSpacing` is em; extrusion is pixels at the working text resolution. Fonts must already be available through CSS or the system. Rasterization waits for the requested font. Text is capped at 100 characters and the raster at 1600×800. Empty text rejects.

## Distribution

ES modules, no mandatory dependencies. Keep the worker adjacent to its imports. The optional React adapter resolves `react` from the host app (18+). Use a stable shapes array, catch `onError`, and provide external accessible text. The canvas is decorative.

The package manifest prepares an export surface; registry publication is not assumed. Until a release is published, use a checkout or vendor the modules with the MIT notice.
