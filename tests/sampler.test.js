import { describe, expect, it } from "./assertions.js";
import { SAND_STRIDE, cloudShape, sampleInk, seededRand } from "../src/sampler.js";
import { DEFAULTS as O } from "../src/options.js";
function paper(w, h, dark) {
    const px = new Uint8ClampedArray(w * h * 4).fill(255);
    for (const d of dark) {
        const o = (d.y * w + d.x) * 4;
        const v = d.v ?? 0;
        px[o] = px[o + 1] = px[o + 2] = v;
        px[o + 3] = d.a ?? 255;
    }
    return px;
}
function rect(x0, y0, x1, y1, v = 0) {
    const out = [];
    for (let y = y0; y <= y1; y++)
        for (let x = x0; x <= x1; x++)
            out.push({ x, y, v });
    return out;
}
function toPixel(shape, size) {
    const pts = [];
    for (let i = 0; i < shape.count; i++) {
        const o = i * SAND_STRIDE;
        pts.push([
            ((shape.data[o] + 1) / 2) * size,
            ((1 - shape.data[o + 1]) / 2) * size,
        ]);
    }
    return pts;
}
describe("sampleInk", () => {
    it("keeps every grain within the blur radius of the only inked pixel", () => {
        const shape = sampleInk(paper(16, 16, [{ x: 5, y: 9 }]), 16, 16, 200, seededRand(1), null, O);
        expect(shape.count).toBe(200);
        for (const [x, y] of toPixel(shape, 16)) {
            expect(Math.hypot(x - 5.5, y - 9.5)).toBeLessThan(5.5);
        }
    });
    it("gives dark ink far more grains than a faint line and none to near-white", () => {
        const px = paper(48, 8, [
            { x: 6, y: 4, v: 0 },
            { x: 22, y: 4, v: 150 },
            { x: 40, y: 4, v: 240 },
        ]);
        const shape = sampleInk(px, 48, 8, 3000, seededRand(2), null, O);
        const hits = [0, 0, 0];
        for (let i = 0; i < shape.count; i++) {
            const x = ((shape.data[i * SAND_STRIDE] + 1) / 2) * 48;
            hits[x < 14 ? 0 : x < 31 ? 1 : 2]++;
        }
        expect(hits[2]).toBe(0);
        expect(hits[0]).toBeGreaterThan(hits[1] * 3);
    });
    it("treats transparent pixels as blank paper and a blank page as no shape", () => {
        const transparentBlack = paper(8, 8, [{ x: 3, y: 3, v: 0, a: 0 }]);
        expect(sampleInk(transparentBlack, 8, 8, 10, seededRand(3), null, O).count).toBe(0);
        expect(sampleInk(paper(8, 8, []), 8, 8, 10, seededRand(3), null, O).count).toBe(0);
    });
    it("thins a solid fill and keeps its edges dense, like an engraving", () => {
        const size = 40;
        const shape = sampleInk(paper(size, size, rect(10, 10, 29, 29)), size, size, 20000, seededRand(4), null, O);
        let edge = 0;
        let inner = 0;
        for (const [x, y] of toPixel(shape, size)) {
            const d = Math.min(x - 10, 30 - x, y - 10, 30 - y);
            if (d >= -1 && d < 2)
                edge++;
            else if (d >= 5)
                inner++;
        }
        expect(inner / 100).toBeLessThan((edge / 240) * 0.6);
        expect(inner).toBeGreaterThan(0);
    });
    it("lays a faint tone inside an enclosed outline and nothing outside it", () => {
        const size = 40;
        const ring = [
            ...rect(8, 8, 31, 8),
            ...rect(8, 31, 31, 31),
            ...rect(8, 8, 8, 31),
            ...rect(31, 8, 31, 31),
        ];
        const shape = sampleInk(paper(size, size, ring), size, size, 20000, seededRand(5), null, O);
        let inside = 0;
        let outside = 0;
        let onRing = 0;
        for (const [x, y] of toPixel(shape, size)) {
            const d = Math.min(x - 8, 32 - x, y - 8, 32 - y);
            if (d >= 5)
                inside++;
            else if (d < -4)
                outside++;
            else
                onRing++;
        }
        expect(outside).toBe(0);
        expect(inside).toBeGreaterThan(0);
        expect(inside).toBeLessThan(onRing);
    });
    it("inflates a solid shape: grains near its middle sit in front of grains at its rim", () => {
        const size = 60;
        const shape = sampleInk(paper(size, size, rect(10, 10, 49, 49)), size, size, 30000, seededRand(7), null, O);
        let mid = 0;
        let midN = 0;
        let rim = 0;
        let rimN = 0;
        for (let i = 0; i < shape.count; i++) {
            const o = i * SAND_STRIDE;
            const x = ((shape.data[o] + 1) / 2) * size;
            const y = ((1 - shape.data[o + 1]) / 2) * size;
            const d = Math.min(x - 10, 50 - x, y - 10, 50 - y);
            if (d >= 14) {
                mid += shape.data[o + 2];
                midN++;
            }
            else if (d >= 0 && d < 2) {
                rim += shape.data[o + 2];
                rimN++;
            }
        }
        expect(midN).toBeGreaterThan(0);
        expect(mid / midN).toBeGreaterThan(rim / rimN + 0.15);
    });
    it("takes depth from a matching depth map when one is given: white is near, gray is far", () => {
        const size = 40;
        const line = paper(size, size, rect(4, 4, 35, 35));
        const depth = new Uint8ClampedArray(size * size * 4);
        for (let y = 4; y <= 35; y++) {
            for (let x = 4; x <= 35; x++) {
                const o = (y * size + x) * 4;
                const v = x < 20 ? 255 : 80;
                depth[o] = depth[o + 1] = depth[o + 2] = v;
                depth[o + 3] = 255;
            }
        }
        const shape = sampleInk(line, size, size, 20000, seededRand(8), depth, O);
        let left = 0;
        let leftN = 0;
        let right = 0;
        let rightN = 0;
        for (let i = 0; i < shape.count; i++) {
            const o = i * SAND_STRIDE;
            const x = ((shape.data[o] + 1) / 2) * size;
            if (x > 6 && x < 17) {
                left += shape.data[o + 2];
                leftN++;
            }
            else if (x > 23 && x < 34) {
                right += shape.data[o + 2];
                rightN++;
            }
        }
        expect(left / leftN).toBeGreaterThan(right / rightN + 0.3);
    });
    it("fits a wide image to the x axis and shrinks y by the aspect ratio", () => {
        const shape = sampleInk(paper(16, 8, rect(0, 0, 15, 7)), 16, 8, 400, seededRand(6), null, O);
        let maxY = 0;
        for (let i = 0; i < shape.count; i++) {
            maxY = Math.max(maxY, Math.abs(shape.data[i * SAND_STRIDE + 1]));
        }
        expect(maxY).toBeLessThanOrEqual(0.5);
    });
    it("is deterministic for the same seed", () => {
        const px = paper(12, 12, [{ x: 4, y: 4 }, { x: 9, y: 2 }]);
        const a = sampleInk(px, 12, 12, 20, seededRand(9), null, O);
        const b = sampleInk(px, 12, 12, 20, seededRand(9), null, O);
        expect(Array.from(a.data)).toEqual(Array.from(b.data));
    });
});
describe("cloudShape", () => {
    it("rings the frame from outside, in the distance", () => {
        const cloud = cloudShape(100, seededRand(5), O);
        expect(cloud.count).toBe(100);
        for (let i = 0; i < 100; i++) {
            const o = i * SAND_STRIDE;
            expect(Math.hypot(cloud.data[o], cloud.data[o + 1])).toBeGreaterThan(1.6);
            expect(cloud.data[o + 2]).toBeLessThan(-1);
        }
    });
});
