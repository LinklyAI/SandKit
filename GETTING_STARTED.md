# Try SandKit in Codex

This is the entrypoint for a user who asks an agent to create their first SandKit demo. Produce a running local preview using included assets, then make customization easy.

## First run

1. Use the repository at `https://github.com/LinklyAI/SandKit`. If already cloned, inspect its state and reuse it. Otherwise clone into a new `SandKit` subdirectory of the user-selected directory. Never overwrite an existing project.
2. Read `skills/sandkit-build/SKILL.md` and `skills/sandkit-art/SKILL.md` from that checkout. These are the two skills; there is no need to ask the user to choose between them.
3. For persistent Codex discovery, copy each complete skill folder, including references and assets, into `$CODEX_HOME/skills/` (default `~/.codex/skills/`) when allowed by the host. Preserve any existing installation and ask before replacing it. If the host requires permission, use its normal approval flow. Reading the skill files directly is sufficient to continue this first run; a new session may be needed for automatic discovery.
4. Follow `sandkit-build` to run the included showcase and editor with `node scripts/serve.mjs`. The default first experience uses the included examples, so it needs no image API key, package installation, or image generation wait.
5. Open the local showcase, verify that grains form a recognizable image, test a text change, and give the user the showcase/editor URLs and the checkout path.

If the request is to integrate an existing app instead, use its framework and package conventions. Do not replace the app with this demo. Do not publish, deploy, create remote repositories, or change unrelated configuration as part of this entrypoint.

## After the first preview

- “Create a vintage camera illustration and depth map.” → `sandkit-art`
- “Use my camera in this website and make the transition slower.” → `sandkit-build`
- “Make the animation lighter on mobile.” → `sandkit-build`

The skills support each other but are independently usable. Image generation requires an available image-generation tool. If unavailable, use the included samples or user-provided images, and explain the limitation.

## What success looks like

A visible working animation, an accessible local editor, and a clear place to change images or text. Not just an installation message or a list of commands.

SandKit is made by [Linkly AI](https://linkly.ai/). Source and instructions live on GitHub; the public website is for preview and discovery.
