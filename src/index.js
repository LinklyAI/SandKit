import { DEFAULTS, PARAMETERS, normalizeOptions } from './options.js';
import { cloudShape, seededRand } from './sampler.js';
import { createSampler, loadShape } from './loader.js';
import { vertexShader, fragmentShader } from './shaders.js';
export { DEFAULTS, PARAMETERS, normalizeOptions } from './options.js';
export { textShape, rasterizeText } from './text.js';
export { readPixels, validatePair } from './loader.js';
const LIVE = { STAGGER: 'stagger', SCATTER_PHASE: 'scatterPhase', REACH: 'scatterReach',
    SCATTER_DEPTH: 'scatterDepth', PICTURE_SCALE: 'pictureScale', DEPTH_CONTRAST: 'depthContrast', FLIGHT_FADE: 'flightFade' };
const ease = x => x * x * (3 - 2 * x);
function programFor(gl) {
    const shaders = [];
    let program;
    try {
        for (const [type, code] of [[gl.VERTEX_SHADER, vertexShader()], [gl.FRAGMENT_SHADER, fragmentShader()]]) {
            const shader = gl.createShader(type);
            shaders.push(shader);
            gl.shaderSource(shader, code);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
                throw new Error(gl.getShaderInfoLog(shader));
        }
        program = gl.createProgram();
        for (const shader of shaders)
            gl.attachShader(program, shader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
            throw new Error(gl.getProgramInfoLog(program));
        return program;
    }
    catch (error) {
        if (program)
            gl.deleteProgram(program);
        throw error;
    }
    finally {
        for (const shader of shaders)
            gl.deleteShader(shader);
    }
}
/** Browser-only renderer. Construct after the canvas mounts; dispose on unmount. */
export class SandKit {
    constructor(canvas, { shapes = [], options = {}, onStatus = () => { }, onError = console.warn, worker = true } = {}) {
        this.canvas = canvas;
        this.options = normalizeOptions(options);
        this.sources = shapes;
        this.onStatus = onStatus;
        this.onError = onError;
        this.worker = worker;
        this.gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
        if (!this.gl)
            throw new Error('WebGL2 is unavailable. Use a static image fallback.');
        const gl = this.gl;
        this.program = programFor(gl);
        this.vao = gl.createVertexArray();
        this.uniforms = {};
        for (const name of ['uRot', 'uT', 'uSpread', 'uTime', 'uJitter', 'uScale', 'uOffsetFrom', 'uOffsetTo', 'uOffsetT', 'uPuff', 'uPointSize', 'uColor', ...Object.keys(LIVE), 'GRAIN_MIN', 'GRAIN_SPREAD'])
            this.uniforms[name] = gl.getUniformLocation(this.program, name);
        this.buffers = [];
        this.items = [];
        this.generation = 0;
        this.time = 0;
        this.last = null;
        this.to = 0;
        this.phase = 'hold';
        this.phaseStart = 0;
        this.duration = 1;
        this.pointer = [0, 0];
        this.rotation = [0, 0];
        this.offsetFrom = this.offsetTo = [this.options.offsetX * 2, this.options.offsetY * 2];
        this.offsetStart = -1e9;
        this.alpha = this.options.opacity;
        this.paused = false;
        this.disposed = false;
        this.pinName = null;
        this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
        this.mouse = event => {
            const r = canvas.getBoundingClientRect();
            this.pointer = [Math.max(-1, Math.min(1, (event.clientX - r.left) / Math.max(r.width, 1) * 2 - 1)),
                Math.max(-1, Math.min(1, (event.clientY - r.top) / Math.max(r.height, 1) * 2 - 1))];
        };
        this.visibility = () => { this.last = null; this.wake(); };
        this.motion = () => { this.rotation = [0, 0]; if (this.reduced.matches)
            this.settle(); this.wake(); };
        this.contextLost = event => { event.preventDefault(); this.stop(); this.lost = true; this.onError(new Error('WebGL context lost. Recreate SandKit to recover.')); };
        window.addEventListener('pointermove', this.mouse, { passive: true });
        document.addEventListener('visibilitychange', this.visibility);
        this.reduced.addEventListener('change', this.motion);
        canvas.addEventListener('webglcontextlost', this.contextLost);
        this.observer = new ResizeObserver(() => this.wake());
        this.observer.observe(canvas);
        this.theme = new MutationObserver(() => { this.readColor(); this.wake(); });
        this.theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-theme'] });
        this.readColor();
        this.ready = this.setShapes(shapes);
    }
    readColor() {
        const dark = document.documentElement.classList.contains('dark') || document.documentElement.dataset.theme === 'dark';
        this.canvas.style.color = dark ? this.options.colorDark : this.options.color;
        const c = document.createElement('canvas');
        c.width = c.height = 1;
        const ctx = c.getContext('2d');
        ctx.fillStyle = getComputedStyle(this.canvas).color;
        ctx.fillRect(0, 0, 1, 1);
        this.rgb = [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3).map(v => v / 255);
    }
    makeBuffer(data, list = this.buffers) {
        const gl = this.gl, b = gl.createBuffer();
        list.push(b);
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return b;
    }
    async setShapes(shapes) {
        if (this.disposed)
            return;
        if (!Array.isArray(shapes) || !shapes.length)
            throw new Error('Provide at least one shape.');
        if (new Set(shapes.map(s => s.name)).size !== shapes.length || shapes.some(s => !s.name))
            throw new Error('Shape names must be non-empty and unique.');
        this.sources = shapes;
        const generation = ++this.generation;
        this.sampler?.dispose();
        const sampler = createSampler(this.options, { worker: this.worker });
        this.sampler = sampler;
        const count = Math.round(this.options.count * ((navigator.hardwareConcurrency || 4) < 4 ? 0.6 : 1) * (devicePixelRatio >= 2 ? 0.9 : 1));
        this.onStatus({ state: 'loading', count });
        try {
            const loaded = [];
            for (const source of shapes) {
                const shape = await loadShape(source, count, sampler, this.onError);
                if (generation !== this.generation || this.disposed)
                    return;
                if (shape.count)
                    loaded.push({ ...source, shape });
            }
            if (!loaded.length)
                throw new Error('No visible ink found in the supplied shapes.');
            this.stop();
            for (const b of this.buffers)
                this.gl.deleteBuffer(b);
            this.buffers = [];
            this.count = count;
            this.gl.bindVertexArray(this.vao);
            const rng = seededRand(7), seeds = Float32Array.from({ length: count * 2 }, rng);
            this.makeBuffer(seeds);
            this.gl.enableVertexAttribArray(4);
            this.gl.vertexAttribPointer(4, 2, this.gl.FLOAT, false, 0, 0);
            this.cloud = this.makeBuffer(cloudShape(count, seededRand(11), this.options).data);
            this.items = loaded.map(({ shape, ...source }) => ({ ...source, buffer: this.makeBuffer(shape.data) }));
            this.replay();
            this.onStatus({ state: 'ready', count, shapes: this.items.map(s => s.name) });
        }
        catch (error) {
            if (generation === this.generation && !this.disposed) {
                this.onStatus({ state: 'error', message: error.message });
                throw error;
            }
        }
        finally {
            sampler.dispose();
        }
    }
    setOptions(patch) {
        if (this.disposed)
            return Promise.resolve();
        const next = normalizeOptions(patch, this.options);
        const rebuild = Object.entries(PARAMETERS).some(([k, s]) => s.rebuild && next[k] !== this.options[k]);
        this.options = next;
        this.readColor();
        if (rebuild)
            return this.ready = this.setShapes(this.sources);
        this.wake();
        return Promise.resolve();
    }
    pair(from, to) {
        const gl = this.gl;
        gl.bindVertexArray(this.vao);
        for (const [buf, pos] of [[from, 0], [to, 2]]) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.enableVertexAttribArray(pos);
            gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 16, 0);
            gl.enableVertexAttribArray(pos + 1);
            gl.vertexAttribPointer(pos + 1, 1, gl.FLOAT, false, 16, 12);
        }
    }
    targetIndex() { const index = this.items.findIndex(s => s.name === this.pinName); return index < 0 ? 0 : index; }
    settle() {
        if (!this.items.length)
            return;
        this.to = this.pinName ? this.targetIndex() : this.to;
        this.pair(this.items[this.to].buffer, this.items[this.to].buffer);
        this.phase = 'hold';
        this.phaseStart = this.time;
    }
    replay() {
        if (!this.items.length || this.disposed)
            return;
        this.to = this.targetIndex();
        this.phaseStart = this.time;
        this.duration = this.options.introMs;
        this.phase = 'move';
        this.spread = 0.4;
        this.pair(this.cloud, this.items[this.to].buffer);
        if (this.reduced.matches || this.paused)
            this.settle();
        this.wake();
    }
    pin(name = null) {
        this.pinName = name;
        if (this.reduced.matches)
            this.settle();
        this.wake();
    }
    pause() { this.paused = true; this.stop(); }
    resume() { this.paused = false; this.last = null; this.wake(); }
    stop() { cancelAnimationFrame(this.raf); this.raf = 0; this.last = null; }
    wake() {
        this.stop();
        if (this.disposed || this.lost || document.hidden || !this.items.length)
            return;
        this.draw(0);
        if (this.paused || this.reduced.matches)
            return;
        const frame = stamp => {
            const delta = this.last === null ? 0 : Math.min(100, stamp - this.last);
            this.last = stamp;
            this.time += delta;
            this.draw(delta);
            this.raf = requestAnimationFrame(frame);
        };
        this.raf = requestAnimationFrame(frame);
    }
    draw(delta) {
        const gl = this.gl, T = this.options, u = this.uniforms, now = this.time;
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vao);
        const dpr = Math.min(devicePixelRatio || 1, 2), w = Math.max(1, Math.round(this.canvas.clientWidth * dpr)), h = Math.max(1, Math.round(this.canvas.clientHeight * dpr));
        if (this.canvas.width !== w || this.canvas.height !== h) {
            this.canvas.width = w;
            this.canvas.height = h;
        }
        gl.viewport(0, 0, w, h);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearColor(0, 0, 0, 0);
        let progress = this.phase === 'move' ? Math.min(1, (now - this.phaseStart) / this.duration) : 1;
        if (this.phase === 'move' && progress === 1) {
            this.phase = 'hold';
            this.phaseStart = now;
        }
        if (this.phase === 'hold' && !this.reduced.matches) {
            let next = this.to;
            if (this.pinName)
                next = this.targetIndex();
            else if (now - this.phaseStart >= T.holdMs) {
                const eligible = this.items.map((s, i) => s.pinOnly ? -1 : i).filter(i => i >= 0);
                if (eligible.length)
                    next = eligible[(eligible.indexOf(this.to) + 1) % eligible.length];
            }
            if (next !== this.to) {
                this.pair(this.items[this.to].buffer, this.items[next].buffer);
                this.to = next;
                this.phase = 'move';
                this.phaseStart = now;
                this.duration = T.moveMs;
                this.spread = 1;
                progress = 0;
            }
        }
        let ot = Math.min(1, (now - this.offsetStart) / T.layoutMs);
        const target = [T.offsetX * 2, T.offsetY * 2];
        if (target.some((v, i) => v !== this.offsetTo[i])) {
            this.offsetFrom = this.offsetTo.map((v, i) => this.offsetFrom[i] + (v - this.offsetFrom[i]) * ease(ot));
            this.offsetTo = target;
            this.offsetStart = now;
            ot = 0;
        }
        if (this.reduced.matches || this.paused) {
            this.offsetFrom = this.offsetTo;
            ot = 1;
        }
        const follow = 1 - Math.pow(1 - T.tiltEase, delta / (1000 / 60));
        this.rotation[0] += (-this.pointer[1] * T.tilt * 0.6 - this.rotation[0]) * follow;
        this.rotation[1] += (this.pointer[0] * T.tilt - this.rotation[1]) * follow;
        const t = now / 1000, idle = this.reduced.matches ? 0 : 1;
        const rx = idle * (this.rotation[0] + T.sway * 0.7 * Math.sin(t * 0.17 + 1.3));
        const ry = idle * (this.rotation[1] + T.sway * Math.sin(t * 0.23));
        const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
        gl.uniformMatrix3fv(u.uRot, false, [cy, 0, -sy, sy * sx, cx, cy * sx, sy * cx, -sx, cy * cx]);
        for (const [uniform, key] of Object.entries(LIVE))
            gl.uniform1f(u[uniform], T[key]);
        gl.uniform1f(u.GRAIN_MIN, Math.max(0.1, 1 - T.sizeVariation * 0.45));
        gl.uniform1f(u.GRAIN_SPREAD, T.sizeVariation * 1.1);
        gl.uniform2f(u.uScale, w > h ? h / w : 1, w > h ? 1 : w / h);
        gl.uniform2fv(u.uOffsetFrom, this.offsetFrom);
        gl.uniform2fv(u.uOffsetTo, this.offsetTo);
        for (const [key, value] of Object.entries({ uT: progress, uSpread: this.spread, uTime: t, uJitter: idle * T.jitter, uOffsetT: ot, uPuff: idle * T.layoutPuff, uPointSize: T.pointSize * dpr }))
            gl.uniform1f(u[key], value);
        this.alpha += (T.opacity - this.alpha) * (this.reduced.matches || this.paused ? 1 : 1 - Math.exp(-delta / 220));
        gl.uniform4f(u.uColor, this.rgb[0] * this.alpha, this.rgb[1] * this.alpha, this.rgb[2] * this.alpha, this.alpha);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, this.count);
    }
    dispose() {
        if (this.disposed)
            return;
        this.disposed = true;
        this.generation++;
        this.stop();
        this.sampler?.dispose();
        window.removeEventListener('pointermove', this.mouse);
        document.removeEventListener('visibilitychange', this.visibility);
        this.reduced.removeEventListener('change', this.motion);
        this.canvas.removeEventListener('webglcontextlost', this.contextLost);
        this.observer.disconnect();
        this.theme.disconnect();
        for (const b of this.buffers)
            this.gl.deleteBuffer(b);
        this.gl.deleteVertexArray(this.vao);
        this.gl.deleteProgram(this.program);
    }
}
