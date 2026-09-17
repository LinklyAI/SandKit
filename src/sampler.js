// Weighted ink sampling and approximate relief, adapted from Linkly AI.
export const SAND_STRIDE = 4;
const INK_FLOOR = 0.1;
const HATCH_PERIOD = 6;
const HATCH_VALLEY = 0.4;
const EDGE_GRADIENT = 0.3;
const SHADE_BASE = 0.3;
const DEPTH_FLOOR = 0.03;
const DEPTH_BLUR = 2;
const RELIEF_RADIUS = 14;
const SHADOW_DENT = 0.12;
const DOME = 0.08;
const BASE_OFFSET = -0.2;
const DUST_RANGE = 0.9;
const DEPTH_NOISE = 0.1;
const INFLATE = 0.55;
const CLOUD_RADIUS_SPREAD = 1.1;
const CLOUD_FAR_SPREAD = 1.0;
const CLOUD_SHADE = 0.5;
export function sampleInk(pixels, width, height, count, rand, depthPixels, o) {
    const n = width * height;
    const ink = inkMap(pixels, n);
    const depth = depthPixels ? depthMap(depthPixels, width, height, DEPTH_BLUR) : null;
    const soft = boxBlur(ink, width, height, o.blurRadius);
    for (let i = 0; i < n; i++)
        if (ink[i] > soft[i])
            soft[i] = ink[i];
    const outside = exterior(soft, width, height);
    const weight = engrave(soft, outside, width, height, o);
    const inflate = normalized(distanceToOutside(outside, width, height));
    const shadow = normalized(boxBlur(ink, width, height, RELIEF_RADIUS));
    const cdf = new Float64Array(n);
    let acc = 0;
    for (let i = 0; i < n; i++) {
        acc += weight[i];
        cdf[i] = acc;
    }
    const data = new Float32Array(count * SAND_STRIDE);
    if (acc <= 0)
        return { data, count: 0 };
    const aspect = width / height;
    const sx = aspect >= 1 ? 1 : aspect;
    const sy = aspect >= 1 ? 1 / aspect : 1;
    for (let p = 0; p < count; p++) {
        const u = Math.max(rand(), 1e-12) * acc;
        let lo = 0;
        let hi = n - 1;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (cdf[mid] < u)
                lo = mid + 1;
            else
                hi = mid;
        }
        const px = lo % width;
        const py = (lo - px) / width;
        const x = (((px + rand()) / width) * 2 - 1) * sx;
        const y = (1 - ((py + rand()) / height) * 2) * sy;
        const r2 = x * x + y * y;
        const dome = DOME * Math.sqrt(Math.max(0, 1 - r2));
        const body = INFLATE * Math.sqrt(inflate[lo]);
        const dust = rand() < o.dustShare ? (rand() - 0.5) * DUST_RANGE : 0;
        const guessed = dome + body - SHADOW_DENT * shadow[lo] + BASE_OFFSET;
        const d = depth ? depth[lo] : 0;
        const base = depth && d > DEPTH_FLOOR ? o.depthRange * (d - 0.5) : guessed;
        const z = base + (rand() - 0.5) * DEPTH_NOISE + dust;
        const i = p * SAND_STRIDE;
        data[i] = x;
        data[i + 1] = y;
        data[i + 2] = z;
        data[i + 3] =
            (SHADE_BASE + (1 - SHADE_BASE) * soft[lo]) * Math.pow(rand(), o.shadeVariation);
    }
    return { data, count };
}
function inkMap(pixels, n) {
    const ink = new Float32Array(n);
    for (let i = 0; i < n; i++) {
        const o = i * 4;
        const a = pixels[o + 3] / 255;
        const lum = (0.299 * pixels[o] + 0.587 * pixels[o + 1] + 0.114 * pixels[o + 2]) / 255;
        ink[i] = 1 - (lum * a + (1 - a));
    }
    return ink;
}
function depthMap(pixels, w, h, blur) {
    const n = w * h;
    const d = new Float32Array(n);
    for (let i = 0; i < n; i++)
        d[i] = pixels[i * 4] / 255;
    return boxBlur(d, w, h, blur);
}
function boxBlur(src, w, h, r) {
    const n = src.length;
    let from = new Float32Array(src);
    let to = new Float32Array(n);
    const norm = 1 / (2 * r + 1);
    for (let pass = 0; pass < 2; pass++) {
        for (let y = 0; y < h; y++) {
            const row = y * w;
            let sum = 0;
            for (let x = -r; x <= r; x++)
                sum += from[row + clampIdx(x, w)];
            for (let x = 0; x < w; x++) {
                to[row + x] = sum * norm;
                sum += from[row + clampIdx(x + r + 1, w)] - from[row + clampIdx(x - r, w)];
            }
        }
        [from, to] = [to, from];
        for (let x = 0; x < w; x++) {
            let sum = 0;
            for (let y = -r; y <= r; y++)
                sum += from[clampIdx(y, h) * w + x];
            for (let y = 0; y < h; y++) {
                to[y * w + x] = sum * norm;
                sum += from[clampIdx(y + r + 1, h) * w + x] - from[clampIdx(y - r, h) * w + x];
            }
        }
        [from, to] = [to, from];
    }
    return from;
}
function distanceToOutside(outside, w, h) {
    const n = w * h;
    const BIG = 1e9;
    const d = new Float32Array(n);
    for (let i = 0; i < n; i++)
        d[i] = outside[i] ? 0 : BIG;
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = y * w + x;
            let v = d[i];
            if (x > 0)
                v = Math.min(v, d[i - 1] + 3);
            if (y > 0) {
                v = Math.min(v, d[i - w] + 3);
                if (x > 0)
                    v = Math.min(v, d[i - w - 1] + 4);
                if (x < w - 1)
                    v = Math.min(v, d[i - w + 1] + 4);
            }
            d[i] = v;
        }
    }
    for (let y = h - 1; y >= 0; y--) {
        for (let x = w - 1; x >= 0; x--) {
            const i = y * w + x;
            let v = d[i];
            if (x < w - 1)
                v = Math.min(v, d[i + 1] + 3);
            if (y < h - 1) {
                v = Math.min(v, d[i + w] + 3);
                if (x < w - 1)
                    v = Math.min(v, d[i + w + 1] + 4);
                if (x > 0)
                    v = Math.min(v, d[i + w - 1] + 4);
            }
            d[i] = v;
        }
    }
    for (let i = 0; i < n; i++)
        if (d[i] >= BIG)
            d[i] = 0;
    return d;
}
function normalized(v) {
    let max = 0;
    for (let i = 0; i < v.length; i++)
        if (v[i] > max)
            max = v[i];
    if (max > 0)
        for (let i = 0; i < v.length; i++)
            v[i] /= max;
    return v;
}
function clampIdx(i, n) {
    return i < 0 ? 0 : i >= n ? n - 1 : i;
}
function exterior(soft, w, h) {
    const n = w * h;
    const out = new Uint8Array(n);
    const stack = new Int32Array(n);
    let top = 0;
    const seed = (i) => {
        if (soft[i] < INK_FLOOR && !out[i]) {
            out[i] = 1;
            stack[top++] = i;
        }
    };
    for (let x = 0; x < w; x++) {
        seed(x);
        seed((h - 1) * w + x);
    }
    for (let y = 0; y < h; y++) {
        seed(y * w);
        seed(y * w + w - 1);
    }
    while (top > 0) {
        const i = stack[--top];
        const x = i % w;
        if (x > 0)
            seed(i - 1);
        if (x < w - 1)
            seed(i + 1);
        if (i >= w)
            seed(i - w);
        if (i + w < n)
            seed(i + w);
    }
    return out;
}
function engrave(soft, outside, w, h, o) {
    const out = new Float32Array(soft.length);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = y * w + x;
            const v = soft[i];
            const wave = 0.5 + 0.5 * Math.cos(((x + y) * 2 * Math.PI) / HATCH_PERIOD);
            const hatch = HATCH_VALLEY + (1 - HATCH_VALLEY) * wave;
            if (v < INK_FLOOR) {
                if (!outside[i])
                    out[i] = o.interiorTone * hatch;
                continue;
            }
            const gx = soft[y * w + clampIdx(x + 1, w)] - soft[y * w + clampIdx(x - 1, w)];
            const gy = soft[clampIdx(y + 1, h) * w + x] - soft[clampIdx(y - 1, h) * w + x];
            const edge = Math.min(1, Math.hypot(gx, gy) / EDGE_GRADIENT);
            out[i] = v * v * (o.fillDensity * hatch + (1 - o.fillDensity) * edge);
        }
    }
    return out;
}
export function cloudShape(count, rand, o) {
    const data = new Float32Array(count * SAND_STRIDE);
    for (let p = 0; p < count; p++) {
        const ang = rand() * Math.PI * 2;
        const r = o.cloudRadius + rand() * CLOUD_RADIUS_SPREAD;
        const i = p * SAND_STRIDE;
        data[i] = Math.cos(ang) * r;
        data[i + 1] = Math.sin(ang) * r;
        data[i + 2] = o.cloudFar + rand() * CLOUD_FAR_SPREAD;
        data[i + 3] = CLOUD_SHADE;
    }
    return { data, count };
}
export function seededRand(seed) {
    let s = seed >>> 0;
    return () => {
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
