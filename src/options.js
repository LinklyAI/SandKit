// Shared by the renderer, editor, config validation and documentation.
const field = (group, label, value, min, max, step, help, rebuild = false) => ({ group, label, value, min, max, step, help, rebuild });
export const PARAMETERS = {
    count: field('Grains', 'Particle count', 40000, 1000, 100000, 1000, 'Target budget; lower on limited hardware.', true),
    pointSize: field('Grains', 'Point size', 1.35, 0.3, 4, 0.05, 'Diameter in CSS pixels.'),
    sizeVariation: field('Grains', 'Size variation', 2, 0, 2, 0.05, 'Difference between individual grains.'),
    shadeVariation: field('Grains', 'Shade variation', 0.1, 0, 3, 0.05, 'Random fading of grains.', true),
    opacity: field('Grains', 'Opacity', 1, 0, 1, 0.01, 'Overall transparency.'),
    introMs: field('Timing', 'Entrance', 2600, 100, 10000, 100, 'Entrance duration in milliseconds.'),
    moveMs: field('Timing', 'Transition', 3400, 100, 10000, 100, 'Duration of the next transition.'),
    holdMs: field('Timing', 'Hold', 3000, 100, 15000, 100, 'Time to rest before changing shape.'),
    stagger: field('Motion', 'Stagger', 0.7, 0, 0.95, 0.01, 'Delay each grain independently.'),
    scatterPhase: field('Motion', 'Scatter phase', 0.2, 0.05, 0.95, 0.01, 'Fraction of a transition spent scattering.'),
    scatterReach: field('Motion', 'Scatter reach', 0.1, 0, 2, 0.02, 'Distance beyond the target outline.'),
    scatterDepth: field('Motion', 'Scatter depth', 2, 0, 4, 0.05, 'How far grains retreat in flight.'),
    flightFade: field('Motion', 'Flight fade', 0.2, 0, 1, 0.01, 'Fade grains while in motion.'),
    jitter: field('Motion', 'Jitter', 0.007, 0, 0.04, 0.001, 'Small movements after settling.'),
    depthRange: field('Depth', 'Depth range', 0.7, 0, 1.5, 0.05, 'Depth span from the map.', true),
    depthContrast: field('Depth', 'Depth contrast', 1, 0, 1, 0.01, 'Near grains become larger and denser.'),
    dustShare: field('Depth', 'Floating dust', 0.04, 0, 0.2, 0.005, 'Share of grains away from the surface.', true),
    tilt: field('Interaction', 'Pointer tilt', 0.52, 0, 0.8, 0.01, 'Maximum horizontal rotation in radians.'),
    tiltEase: field('Interaction', 'Follow speed', 0.3, 0.01, 1, 0.01, 'How quickly rotation follows the pointer.'),
    sway: field('Interaction', 'Idle sway', 0.03, 0, 0.2, 0.005, 'Slow automatic rotation.'),
    pictureScale: field('Composition', 'Picture scale', 0.85, 0.2, 2, 0.01, 'Size relative to the shorter canvas edge.'),
    offsetX: field('Composition', 'Horizontal offset', 0, -0.5, 0.5, 0.01, 'Center offset as a fraction of width.'),
    offsetY: field('Composition', 'Vertical offset', 0, -0.5, 0.5, 0.01, 'Positive values move upward.'),
    layoutMs: field('Composition', 'Layout flight', 1500, 100, 5000, 100, 'Flight time when the center changes.'),
    layoutPuff: field('Composition', 'Layout spread', 0.12, 0, 0.5, 0.01, 'Outward movement during layout changes.'),
    cloudRadius: field('Entrance', 'Cloud radius', 1.7, 1, 4, 0.05, 'Starting ring around the picture.', true),
    cloudFar: field('Entrance', 'Cloud distance', -2.2, -4, -0.1, 0.1, 'Starting depth, behind the picture.', true),
    blurRadius: field('Ink', 'Ink spread', 2, 0, 6, 1, 'Outward ink spread in source pixels.', true),
    fillDensity: field('Ink', 'Solid fill', 0.2, 0, 1, 0.01, 'Density inside solid black areas.', true),
    interiorTone: field('Ink', 'Interior tone', 0.08, 0, 0.4, 0.01, 'Faint grains inside closed outlines.', true),
};
export const DEFAULTS = Object.freeze({
    ...Object.fromEntries(Object.entries(PARAMETERS).map(([k, v]) => [k, v.value])),
    color: '#4a71ee', colorDark: '#b6c4ff',
});
export function normalizeOptions(input = {}, base = DEFAULTS) {
    const out = { ...base };
    for (const [key, spec] of Object.entries(PARAMETERS)) {
        if (typeof input[key] !== 'number' || !Number.isFinite(input[key]))
            continue;
        const v = Math.max(spec.min, Math.min(spec.max, input[key]));
        out[key] = key === 'count' || key === 'blurRadius' ? Math.round(v) : v;
    }
    for (const key of ['color', 'colorDark']) {
        if (typeof input[key] === 'string' && input[key].length < 200)
            out[key] = input[key];
    }
    return out;
}
