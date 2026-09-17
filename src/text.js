export async function rasterizeText(text, settings = {}) {
    const { fontFamily = 'system-ui', fontWeight = 800, letterSpacing = 0.02, extrude = 24 } = settings;
    const content = String(text).trim().slice(0, 100);
    if (!content)
        throw new Error('Enter at least one visible character.');
    const font = `${fontWeight} 200px ${fontFamily}`;
    await document.fonts.load(font, content);
    const probe = document.createElement('canvas').getContext('2d');
    probe.font = font;
    probe.letterSpacing = `${letterSpacing}em`;
    const m = probe.measureText(content);
    const extent = Math.max(0, Math.min(60, Number(extrude) || 0));
    const ascent = Math.max(1, m.actualBoundingBoxAscent), descent = Math.max(0, m.actualBoundingBoxDescent);
    const rawW = Math.ceil(m.width + 80 + extent), rawH = Math.ceil(ascent + descent + 80 + extent);
    const factor = Math.min(1, 1600 / rawW, 800 / rawH);
    const w = Math.max(1, Math.ceil(rawW * factor)), h = Math.max(1, Math.ceil(rawH * factor));
    const paint = isDepth => {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.fillStyle = isDepth ? '#000' : '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.scale(factor, factor);
        ctx.font = font;
        ctx.letterSpacing = `${letterSpacing}em`;
        for (let step = 12; step >= 1; step--) {
            const k = step / 12;
            const v = Math.round(255 * (isDepth ? 0.8 - 0.55 * k : 0.65 - 0.2 * k));
            ctx.fillStyle = `rgb(${v} ${v} ${v})`;
            ctx.fillText(content, 40 + extent * k, 40 + ascent + extent * k);
        }
        ctx.fillStyle = isDepth ? '#fff' : '#000';
        ctx.fillText(content, 40, 40 + ascent);
        return { w, h, data: ctx.getImageData(0, 0, w, h).data };
    };
    return { line: paint(false), depth: paint(true) };
}
export const textShape = (text, settings = {}) => ({
    name: settings.name ?? 'text', scale: settings.scale ?? 1,
    raster: () => rasterizeText(text, settings),
});
