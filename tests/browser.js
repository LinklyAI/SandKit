import { SandKit, textShape, readPixels, validatePair } from '../src/index.js';
import { samples } from '../site/samples.js';
let failures = 0;
const results = document.querySelector('#results');
async function test(name, fn) {
    const row = document.createElement('li');
    results.append(row);
    try {
        await fn();
        row.textContent = 'PASS — ' + name;
    }
    catch (e) {
        failures++;
        row.textContent = 'FAIL — ' + name + ': ' + e.message;
    }
}
const assert = (condition, message) => { if (!condition)
    throw new Error(message); };
await test('All distributed sample pairs decode at matching 800 × 800', async () => {
    for (const s of samples) {
        const [line, depth] = await Promise.all([readPixels(s.url), readPixels(s.depthUrl)]);
        validatePair(line, depth);
        assert(line.w === 800 && line.h === 800, s.name);
    }
});
let kit;
await test('WebGL2 compiles, worker samples, and text renders', async () => {
    kit = new SandKit(document.querySelector('#canvas'), { shapes: [textShape('TEST')], options: { count: 2000, introMs: 100 } });
    await kit.ready;
    assert(kit.count > 0, 'No particles');
    assert(kit.gl.getError() === kit.gl.NO_ERROR, 'WebGL error');
});
await test('Live options preserve buffers; sampling edits rebuild them', async () => {
    const before = kit.items[0].buffer;
    await kit.setOptions({ pointSize: 2 });
    assert(kit.items[0].buffer === before, 'Live edit rebuilt buffers');
    await kit.setOptions({ count: 3000 });
    assert(kit.items[0].buffer !== before, 'Sampling edit did not rebuild');
});
await test('Latest source request wins without leaking stale output', async () => {
    const a = kit.setShapes([textShape('OLD', { name: 'old' })]);
    const b = kit.setShapes([textShape('NEW', { name: 'new' })]);
    await Promise.all([a, b]);
    assert(kit.items[0].name === 'new', 'Stale shape won');
});
await test('Empty input rejects and retains the previous shape', async () => {
    let rejected = false;
    try {
        await kit.setShapes([textShape(' ')]);
    }
    catch {
        rejected = true;
    }
    assert(rejected && kit.items[0].name === 'new', 'Failed request replaced output');
});
await test('Pause stops frames; dispose is idempotent', async () => {
    kit.pause();
    assert(!kit.raf, 'Paused frame scheduled');
    kit.resume();
    kit.dispose();
    kit.dispose();
    assert(!kit.raf && kit.disposed, 'Not disposed');
});
await test('Main-thread fallback renders without a worker', async () => {
    const main = new SandKit(document.querySelector('#canvas'), { shapes: [textShape('MAIN')], worker: false, options: { count: 1000 } });
    await main.ready;
    assert(main.items.length === 1, 'No fallback shape');
    main.dispose();
});
document.querySelector('#status').textContent = failures ? `${failures} checks failed` : 'All 7 browser checks passed';
