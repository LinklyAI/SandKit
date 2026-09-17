<div align="center">

<img src="site/mark.svg" width="64" alt="SandKit">

# SandKit

**Images and words, brought to life as interactive sand art.**

[![Checks](https://github.com/LinklyAI/SandKit/actions/workflows/check.yml/badge.svg)](https://github.com/LinklyAI/SandKit/actions/workflows/check.yml)
[![MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![WebGL2](https://img.shields.io/badge/WebGL2-zero_runtime_dependencies-4a71ee)](docs/API.md)
[![Stars](https://img.shields.io/github/stars/LinklyAI/SandKit?color=4a71ee)](https://github.com/LinklyAI/SandKit)
[![X](https://img.shields.io/badge/X-%40linkly_ai-000000?logo=x&logoColor=white)](https://x.com/linkly_ai)

[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](docs/README.ja.md) | [한국어](docs/README.ko.md) | [Español](docs/README.es.md) | [Deutsch](docs/README.de.md) | [Русский](docs/README.ru.md)

[Explore the demo](https://linkly.ai/sandkit) · [Try it in Codex](GETTING_STARTED.md) · [Linkly AI](https://linkly.ai/)

⭐ Star SandKit to follow new examples and skills.

</div>

<!-- DEMO:START -->
https://github.com/user-attachments/assets/45e6853f-a03a-4eb9-80b3-390d7aa9b94a

<p align="center"><a href="https://linkly.ai/sandkit">Explore the demo →</a></p>
<!-- DEMO:END -->



## Why SandKit

Create the artwork and the animation in one Codex workflow. SandKit pairs two agent skills with a WebGL2 renderer, a visual editor, and ready-to-use samples. Built for the onboarding experience in [Linkly AI](https://linkly.ai/).

- **[sandkit-art](skills/sandkit-art/SKILL.md)** — create line art and matching estimated depth maps.
- **[sandkit-build](skills/sandkit-build/SKILL.md)** — build, integrate, and optimize the animation.
- **Preview in the browser** — explore examples and try text; make custom images in Codex.

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

Official demo: [linkly.ai/sandkit](https://linkly.ai/sandkit) (available after the website release). Package publication is separate.

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

The showcase and editor ship with English and Chinese pages, crawlable static HTML, localized metadata, language links, and a sitemap. The visual style follows Linkly AI’s warm-white background and SandKit’s blue accents.

## Built with Linkly AI

[Linkly AI](https://linkly.ai/) is the knowledge brain for AI agents. Let your agent search and read your notes, documents, audio and videos.

[Get Linkly AI](https://linkly.ai/#get-started) · [X @linkly_ai](https://x.com/linkly_ai)
