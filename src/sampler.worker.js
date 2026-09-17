import { sampleInk, seededRand } from './sampler.js';
self.onmessage = ({ data: r }) => {
    try {
        const shape = sampleInk(r.pixels, r.width, r.height, r.count, seededRand(r.seed), r.depth, r.options);
        self.postMessage({ id: r.id, shape }, [shape.data.buffer]);
    }
    catch (error) {
        self.postMessage({ id: r.id, error: String(error) });
    }
};
