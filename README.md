[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](docs/README.ja.md) | [한국어](docs/README.ko.md) | [Español](docs/README.es.md) | [Deutsch](docs/README.de.md) | [Русский](docs/README.ru.md)

<p align="center"><img src="site/mark.svg" width="64" alt="SandKit"></p>

<h1 align="center">SandKit</h1>
<p align="center">Images and words, brought to life as interactive sand art.</p>
<p align="center"><a href="LICENSE">MIT</a> · WebGL2 · Zero runtime dependencies · Two agent skills</p>
<p align="center"><a href="https://github.com/LinklyAI/SandKit/actions/workflows/check.yml"><img src="https://github.com/LinklyAI/SandKit/actions/workflows/check.yml/badge.svg" alt="Checks"></a> <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"></a></p>
<p align="center"><a href="GETTING_STARTED.md">Try it in Codex</a> · <a href="#run-locally">Run the editor</a> · <a href="https://linkly.ai/">Made by Linkly AI ↗</a> · <a href="README.zh-CN.md">简体中文</a></p>

![Example artwork](skills/sandkit-art/assets/typewriter.webp)

An ink drawing becomes a cloud of grains. A depth map gives it parallax. The grains scatter, travel, and gather into the next image or word. Move your pointer to see the surface turn.

SandKit grew out of the onboarding experience in **[Linkly AI](https://linkly.ai/)**. It includes a framework-independent renderer, a React adapter, a showcase, a full parameter editor, and skills that help Codex create both the artwork and the code.

## One prompt in Codex

Copy this into Codex in the directory where you want to create your demo:

> Read https://github.com/LinklyAI/SandKit/blob/main/GETTING_STARTED.md and follow it to set up the two SandKit skills, then create and run an interactive sand-art demo using the included samples in this directory.

The first run uses included samples. Afterward, ask for your own subject: “Create a vintage camera illustration and depth map, then use them in my sand animation.” Image generation requires an image-capable Codex session; the included assets work without it. Normal host permission prompts may still apply.

## Run locally

Requires Node.js 22 or newer. No dependency installation is needed for the core, showcase, editor, build, or tests.

```sh
git clone https://github.com/LinklyAI/SandKit.git
cd SandKit
node scripts/serve.mjs
```

- Showcase: `http://127.0.0.1:4173/site/`
- Editor: `http://127.0.0.1:4173/site/editor/`

With a working pnpm installation, `pnpm dev`, `pnpm test`, `pnpm check`, and `pnpm build` are equivalent script entrypoints. Do not open HTML using `file://`; workers and image loading need HTTP.

The public showcase is intended for the Linkly AI website. This repository does not claim that a production demo or registry package has already been published.

## What is included

- **Renderer:** one WebGL2 point draw per frame, orthographic depth parallax, staggered scattering and gathering, per-grain layout flights, pinning, idle sway and jitter.
- **Performance:** worker sampling with main-thread fallback, adaptive grain budget, DPR capped at 2, hidden-page pause, and reduced-motion still frames.
- **Text:** runtime rasterization with font, weight, spacing and extrusion controls.
- **Editor:** 30 numeric controls, light/dark ink palettes, presets, group resets, playback, aspect ratios, line/depth/overlay inspection, versioned JSON import/export and share links.
- **Skills:** `sandkit-art` for artwork and estimated depth; `sandkit-build` for code creation, integration and optimization.
- **Samples:** brain, Macintosh, stacked books and typewriter with paired 800px maps.

The website previews examples and lets visitors try text. Create and process custom images in Codex using the skills. No image upload service, account or cloud storage is required.

## Use in a website

Serve the `src/` directory unchanged, including `sampler.worker.js`:

```html
<canvas id="sand" style="width:100%;height:500px" aria-hidden="true"></canvas>
<script type="module">
  import { SandKit, textShape } from './src/index.js';
  const sand = new SandKit(document.querySelector('#sand'), {
    shapes: [textShape('LINKLY AI')],
    options: { color: '#4a71ee', count: 40000 },
  });
  await sand.ready;
  // await sand.setOptions({ pointSize: 1.6 });
  // sand.pause(); sand.resume(); sand.dispose();
</script>
```

For images, use `{ name: 'camera', url: './camera.png', depthUrl: './camera-depth.png' }`. Depth is optional. Images must be same-origin or served with CORS headers. Mismatched depth dimensions produce a warning and use inferred relief instead; they are never silently stretched.

### React

The optional adapter imports React from your existing app; the core does not need React. Copy `src/` and `react/` together, preserving their relative paths. React 18+ is the intended target.

```jsx
import { useMemo } from 'react';
import { SandCanvas } from './sandkit/react/index.js';
import { textShape } from './sandkit/src/index.js';

export function Hero() {
  const shapes = useMemo(() => [textShape('LINKLY AI')], []);
  return <div style={{ height: 500 }}><SandCanvas shapes={shapes} /></div>;
}
```

Provide meaningful text outside the decorative canvas. Catch renderer errors and show a static image if WebGL2 is unavailable. A lost WebGL context reports an error; recreate the renderer after recovery. See [API](docs/API.md) for lifecycle and configuration details.

## Development

```sh
node scripts/check.mjs
node --test tests/*.test.js
node scripts/build.mjs
```

The static build creates a self-contained `dist/sandkit/` directory for mounting under `/sandkit/`. See [website integration](docs/WEBSITE.md) for hosting under the official domain. Deployment and package publication are separate maintainer actions.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Bug reports should include browser, device, source dimensions and a minimal config. See [SECURITY.md](SECURITY.md) for security reporting.

## License and artwork

[MIT](LICENSE). Included generated sample assets are offered under the same terms to the extent rights are held. See [asset provenance](skills/sandkit-art/assets/PROVENANCE.md). Apple/Macintosh and Linkly AI marks remain their owners’ marks; MIT does not grant trademark rights or endorsement.

Built by **[Linkly AI](https://linkly.ai/)**. Explore the product behind the experiment.

The showcase and editor ship with English and Chinese pages, crawlable static HTML, localized metadata, language links, and a sitemap. The visual style follows Linkly AI’s warm-white background and SandKit’s blue accents.

## Built with Linkly AI

[Linkly AI](https://linkly.ai/) is the knowledge brain for AI agents. Let your agent search and read your notes, documents, audio and videos.

[Get Linkly AI](https://linkly.ai/#get-started) · [X @linkly_ai](https://x.com/linkly_ai)
