import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSampler, validatePair } from '../src/loader.js';
import { DEFAULTS, normalizeOptions } from '../src/options.js';
test('mismatched depth is rejected before indexing pixels', () => {
    const line = { w: 2, h: 2, data: new Uint8ClampedArray(16) };
    assert.throws(() => validatePair(line, { w: 4, h: 1, data: new Uint8ClampedArray(16) }), /same dimensions/);
    assert.doesNotThrow(() => validatePair(line, null));
});
test('unsafe slider and shared config values cannot create singular shader math', () => {
    const o = normalizeOptions({ stagger: 1, scatterPhase: 0, count: Infinity, blurRadius: 2.5, opacity: NaN, pictureScale: -10, bogus: 4 });
    assert.equal(o.stagger, 0.95);
    assert.equal(o.scatterPhase, 0.05);
    assert.equal(o.count, DEFAULTS.count);
    assert.equal(o.opacity, 1);
    assert.equal(o.blurRadius, 3);
    assert.equal(o.pictureScale, 0.2);
    assert.equal(o.bogus, undefined);
});
test('sampler falls back without Worker and rejects after disposal', async () => {
    const s = createSampler(DEFAULTS, { worker: false });
    const px = new Uint8ClampedArray(4 * 4 * 4).fill(255);
    px[20] = px[21] = px[22] = 0;
    const shape = await s.sample(px, 4, 4, 100, 1, null);
    assert.equal(shape.count, 100);
    assert.ok(shape.data.every(Number.isFinite));
    s.dispose();
    await assert.rejects(s.sample(px, 4, 4, 100, 1, null), /disposed/);
});
test('worker errors recover with the original pixel buffers', async () => {
    const original = globalThis.Worker;
    globalThis.Worker = class {
        postMessage() { queueMicrotask(() => this.onerror()); }
        terminate() { }
    };
    try {
        const s = createSampler(DEFAULTS);
        const px = new Uint8ClampedArray(64).fill(255);
        px[20] = px[21] = px[22] = 0;
        const shape = await s.sample(px, 4, 4, 100, 1, null);
        assert.equal(shape.count, 100);
        s.dispose();
    }
    finally {
        globalThis.Worker = original;
    }
});
