# Prompt recipes

Adapt the subject and framing; do not add unwanted objects.

## Line art

“A [subject], [viewpoint], fully visible. Black pen on pure white. Expressive slightly irregular contours, selective directional hatching and modest crosshatching in recesses, broad clean white areas. Traditional hand-drawn line engraving. Clear silhouette and moderate detail; no gray wash, background scene, cast shadow, caption or watermark. [Aspect ratio], only small comfortable margins.”

When revisions become too intricate, reduce tiny fasteners, repeated texture and dense hatching. Keep a small number of meaningful mechanical or anatomical shapes.

## Estimated depth

“Convert this exact approved line image into a smooth estimated Z-depth map. Keep its framing, pose, silhouette and dimensions. Pure black background. Closest visible surfaces white, farther surfaces dark gray. Smooth continuous gradients encode camera distance only. Correct overlap: [subject-specific near/far relationship]. Remove all ink, hatching, texture and material colors. No illumination, shadows, highlights or reflections. Do not interpret black paint as distance. Output only the grayscale depth map.”

## Acceptance

- Measure actual dimensions, not requested dimensions.
- Red-line overlay: outlines should register, especially at holes and narrow extensions.
- Compare near/far ordering across recognizable parts.
- View at zero tilt and moderate tilt in SandKit.
- Avoid JPEG for depth; prefer lossless PNG/WebP where available.
- Explain remaining misregistration. A visually acceptable map may still be an estimate.
