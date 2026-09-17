---
name: sandkit-art
description: Create and prepare black-and-white artwork and paired estimated depth maps for SandKit particle animations in Codex. Use for generating subjects, processing supplied images, checking alignment, and preparing demo assets.
---

# SandKit artwork

Deliver a line image, optional estimated depth image, and a working particle preview. Preserve the user's subject, aspect ratio and approved composition.

## Find the tools and examples

- Use the available image-generation tool for new art and visual edits. Follow its image-reference and inspection requirements. Do not assume an API key or a particular provider exists.
- Read [prompt recipes](references/prompts.md) for generation and revisions.
- This skill includes four portable pairs in `assets/`: `brain`, `computer`, `books`, `typewriter`, each with a matching `-depth.webp`. Their provenance is in `assets/PROVENANCE.md`.
- Use a SandKit checkout for actual particle preview. If needed, obtain `https://github.com/LinklyAI/SandKit` in an approved location; read its `GETTING_STARTED.md` and `docs/API.md`. Do not assume another skill is installed.

## Workflow

1. Determine the subject and intended placement from the request. Default to square, white background, black ink and small margins. Use expressive hand-drawn outlines, selective hatching and readable masses; dense tiny detail tends to become visual noise in particles.
2. Generate or inspect the line image first. Keep the whole silhouette inside the frame. Avoid cast shadows, backgrounds, labels and large unbroken black fills unless requested.
3. Use the approved line image as the depth reference. Ask for near-white/far-dark geometry on pure black, smooth surface ramps, no lighting, texture or ink. This is estimated depth for parallax, not a physically exact Z pass. Never promise pixel alignment from generation alone.
4. Measure actual image dimensions. Normalize a pair using the SAME canvas transform; never independently crop the line and depth. Aim for a longest edge around 800px for interactive sampling. Use deterministic image processing when authorized by the user/tool rules; otherwise identify any remaining mismatch explicitly.
5. Inspect a red line-over-depth overlay in the editor or an image tool. Check outer contours, holes and front/back occlusion. Same dimensions do not prove registration. Do not average away a shifted silhouette.
6. Preview with modest `depthRange` and pointer tilt. Check for spikes, warped edges, floating background and unreadable fine textures. If depth remains unsuitable, deliver line-only relief as a labeled fallback, not as a validated pair.
7. Save source originals separately from prepared assets. Provide the actual paths, dimensions, source entry and validation limitations. Use `sandkit-build` if available when the task includes code integration.

Do not redistribute user-provided third-party art unless its license permits it. Keep generated examples distinct from exact reproductions of reference material.
