import { sampleInk, seededRand } from './sampler.js';
export function createSampler(options, { worker = true } = {}) {
    let backend, disposed = false, id = 0;
    const pending = new Map();
    const drop = error => {
        backend?.terminate();
        backend = null;
        for (const p of pending.values()) {
            clearTimeout(p.timer);
            p.reject(error);
        }
        pending.clear();
    };
    if (worker && typeof Worker !== 'undefined') {
        try {
            backend = new Worker(new URL('./sampler.worker.js', import.meta.url), { type: 'module' });
            backend.onmessage = ({ data }) => {
                const p = pending.get(data.id);
                if (!p)
                    return;
                clearTimeout(p.timer);
                pending.delete(data.id);
                if (data.error)
                    p.reject(new Error(data.error));
                else
                    p.resolve(data.shape);
            };
            backend.onerror = () => drop(new Error('Sampler worker failed.'));
        }
        catch {
            backend = null;
        }
    }
    return {
        async sample(pixels, width, height, count, seed, depth) {
            if (disposed)
                throw new Error('Sampler disposed.');
            if (backend) {
                try {
                    return await new Promise((resolve, reject) => {
                        const request = ++id;
                        const timer = setTimeout(() => drop(new Error('Sampler timed out.')), 15000);
                        pending.set(request, { resolve, reject, timer });
                        try {
                            backend.postMessage({ id: request, pixels, width, height, count, seed, depth, options });
                        }
                        catch (error) {
                            drop(error);
                        }
                    });
                }
                catch (error) {
                    if (disposed)
                        throw error;
                }
            }
            // Preserve the pixel buffers so a failed worker can fall back here.
            return sampleInk(pixels, width, height, count, seededRand(seed), depth, options);
        },
        dispose() { disposed = true; drop(new Error('Sampler disposed.')); },
    };
}
export function validatePair(line, depth) {
    if (!line || line.w < 1 || line.h < 1 || line.data.length !== line.w * line.h * 4)
        throw new Error('Invalid line raster.');
    if (depth && (depth.w !== line.w || depth.h !== line.h || depth.data.length !== line.data.length))
        throw new Error('Line and depth images must have exactly the same dimensions.');
}
export async function readPixels(url) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    await img.decode();
    const w = img.naturalWidth, h = img.naturalHeight;
    if (w * h > 16777216)
        throw new Error('Image too large. Resize to around 800px before loading.');
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx)
        throw new Error('Canvas 2D is unavailable.');
    ctx.drawImage(img, 0, 0);
    return { w, h, data: ctx.getImageData(0, 0, w, h).data };
}
export async function loadShape(source, count, sampler, onWarning = () => { }) {
    let line, depth = null;
    if (source.raster)
        ({ line, depth = null } = await source.raster());
    else {
        line = await readPixels(source.url);
        if (source.depthUrl) {
            try {
                depth = await readPixels(source.depthUrl);
                validatePair(line, depth);
            }
            catch (error) {
                onWarning(error);
                depth = null;
            }
        }
    }
    validatePair(line, depth);
    let seed = 2166136261;
    for (const char of source.name)
        seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
    const shape = await sampler.sample(line.data, line.w, line.h, count, seed >>> 0, depth?.data ?? null);
    const scale = Number.isFinite(source.scale) ? Math.max(0.1, Math.min(3, source.scale)) : 1;
    for (let i = 0; i < shape.count; i++) {
        shape.data[i * 4] *= scale;
        shape.data[i * 4 + 1] *= scale;
    }
    return shape;
}
