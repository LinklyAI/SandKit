import { t, locale, parameterZh } from '../locale.js';
import { SandKit, DEFAULTS, PARAMETERS, normalizeOptions, textShape, readPixels, validatePair } from '../../src/index.js';
import { samples } from '../samples.js';
const $ = s => document.querySelector(s);
let options = { ...DEFAULTS }, kit, source = 'gallery', paused = false, timer, inspectVersion = 0;
const presets = {
    classic: {}, soft: { pointSize: 0.8, opacity: 0.7, count: 60000, flightFade: 0.7, moveMs: 5000, color: '#887866' },
    bold: { pointSize: 2, fillDensity: 0.45, interiorTone: 0.12, count: 50000, color: '#282828' },
    quiet: { tilt: 0.12, sway: 0, jitter: 0, moveMs: 5500, holdMs: 7000, dustShare: 0 },
};
const message = text => { $('#message').textContent = t(text); };
const textOptions = () => ({ fontFamily: $('#font').value, fontWeight: Number($('#weight').value), letterSpacing: Number($('#spacing').value), extrude: Number($('#extrude').value) });
const config = () => ({ version: 1, source, text: $('#words').value, typography: textOptions(), options, dark: document.documentElement.classList.contains('dark') });
const syncConfig = () => { $('#config').value = JSON.stringify(config(), null, 2); };
function syncControls() {
    for (const [k] of Object.entries(PARAMETERS))
        for (const input of document.querySelectorAll(`[data-key="${k}"]`))
            input.value = options[k];
    for (const button of document.querySelectorAll('.swatch'))
        button.classList.toggle('active', options[button.dataset.key] === button.dataset.color);
    syncConfig();
}
function update(patch, resample = false) {
    options = normalizeOptions(patch, options);
    syncControls();
    clearTimeout(timer);
    const apply = () => kit?.setOptions(options).catch(e => message(e.message));
    // A subsequent live edit must still flush any pending resampling patch.
    if (resample)
        timer = setTimeout(apply, 240);
    else
        apply();
}
const groups = [...new Set(Object.values(PARAMETERS).map(s => s.group))];
for (const [index, group] of groups.entries()) {
    const details = document.createElement('details');
    details.open = index < 2;
    const summary = document.createElement('summary');
    summary.textContent = t(group);
    const reset = document.createElement('button');
    reset.className = 'group-reset';
    reset.textContent = t('Reset');
    reset.onclick = e => { e.preventDefault(); update(Object.fromEntries(Object.entries(PARAMETERS).filter(([, s]) => s.group === group).map(([k]) => [k, DEFAULTS[k]])), true); };
    summary.append(reset);
    details.append(summary);
    for (const [key, s] of Object.entries(PARAMETERS).filter(([, s]) => s.group === group)) {
        const control = document.createElement('div');
        control.className = 'control';
        const label = document.createElement('label');
        label.htmlFor = 'range-' + key;
        const translated = locale === 'zh' ? parameterZh[key] : null;
        label.textContent = (translated?.[0] ?? s.label) + (s.rebuild ? ' ↻' : '');
        const number = document.createElement('input');
        number.type = 'number';
        number.dataset.key = key;
        number.setAttribute('aria-label', (translated?.[0] ?? s.label) + (locale === 'zh' ? ' 数值' : ' value'));
        const range = document.createElement('input');
        range.type = 'range';
        range.id = 'range-' + key;
        range.dataset.key = key;
        for (const input of [number, range]) {
            input.min = s.min;
            input.max = s.max;
            input.step = s.step;
            input.value = options[key];
            input.oninput = () => { if (input.value !== '')
                update({ [key]: Number(input.value) }, s.rebuild); };
        }
        const help = document.createElement('p');
        help.textContent = translated?.[1] ?? s.help;
        label.append(number);
        control.append(label, range, help);
        details.append(control);
    }
    $('#controls').append(details);
}
for (const [target, key, palette] of [['#colors', 'color', ['#4a71ee', '#282828', '#887866', '#b84b35', '#36786e', '#8856ab']], ['#dark-colors', 'colorDark', ['#b6c4ff', '#ece9df', '#d2b794', '#ff997f', '#8dd2c1', '#d2aafa']]]) {
    for (const color of palette) {
        const b = document.createElement('button');
        b.className = 'swatch';
        b.style.background = color;
        b.dataset.key = key;
        b.dataset.color = color;
        b.setAttribute('aria-label', t(key === 'color' ? 'Light theme ink' : 'Dark theme ink') + ' ' + color);
        b.onclick = () => update({ [key]: color });
        $(target).append(b);
    }
}
for (const sample of samples) {
    const b = document.createElement('button');
    b.className = 'thumb';
    b.dataset.name = sample.name;
    const sampleLabel = { brain: 'Brain', computer: 'Macintosh', books: 'Stack of books', typewriter: 'Typewriter' }[sample.name];
    b.title = t(sampleLabel);
    const img = document.createElement('img');
    img.src = sample.url;
    img.alt = t(sampleLabel);
    b.append(img);
    b.onclick = () => { $('#source').value = sample.name; selectSource(); };
    $('#thumbnails').append(b);
}
function currentShapes() { return source === 'text' ? [textShape($('#words').value, textOptions())] : source === 'gallery' ? samples : samples.filter(s => s.name === source); }
async function selectSource() {
    source = $('#source').value;
    $('#text-settings').hidden = source !== 'text';
    for (const b of document.querySelectorAll('.thumb'))
        b.classList.toggle('active', b.dataset.name === source);
    syncConfig();
    try {
        await kit?.setShapes(currentShapes());
        await inspect();
    }
    catch (e) {
        message(e.message);
    }
}
async function inspect() {
    const version = ++inspectVersion, mode = $('#view').value;
    $('#canvas').hidden = mode !== 'particles';
    $('#inspection').hidden = mode === 'particles';
    if (mode === 'particles') {
        if (!paused)
            kit?.resume();
        return;
    }
    kit?.pause();
    try {
        const shape = currentShapes()[0];
        let line, depth;
        if (shape.raster)
            ({ line, depth } = await shape.raster());
        else
            [line, depth] = await Promise.all([readPixels(shape.url), readPixels(shape.depthUrl)]);
        if (version !== inspectVersion)
            return;
        validatePair(line, depth);
        const c = $('#inspection');
        c.width = line.w;
        c.height = line.h;
        const data = new Uint8ClampedArray((mode === 'line' ? line : depth).data);
        if (mode === 'overlay')
            for (let i = 0; i < data.length; i += 4) {
                const ink = (1 - (line.data[i] + line.data[i + 1] + line.data[i + 2]) / 765) * line.data[i + 3] / 255;
                data[i] = data[i] * (1 - ink) + 255 * ink;
                data[i + 1] *= 1 - ink;
                data[i + 2] *= 1 - ink;
            }
        c.getContext('2d').putImageData(new ImageData(data, line.w, line.h), 0, 0);
        message(source === 'gallery' ? 'Source inspection shows the first carousel image.' : 'Red lines over depth reveal alignment differences.');
    }
    catch (e) {
        message(e.message);
    }
}
function restore(raw) {
    if (!raw || raw.version !== 1)
        throw new Error('Unsupported configuration version.');
    options = normalizeOptions(raw.options);
    source = ['gallery', 'text', ...samples.map(s => s.name)].includes(raw.source) ? raw.source : 'gallery';
    $('#source').value = source;
    $('#words').value = String(raw.text ?? 'LINKLY AI').slice(0, 100);
    const t = raw.typography ?? {};
    $('#font').value = ['system-ui', 'Georgia', 'monospace'].includes(t.fontFamily) ? t.fontFamily : 'system-ui';
    $('#weight').value = [400, 600, 800, 900].includes(t.fontWeight) ? String(t.fontWeight) : '800';
    $('#spacing').value = Math.max(-0.05, Math.min(0.2, Number(t.letterSpacing) || 0));
    $('#extrude').value = Math.max(0, Math.min(60, Number(t.extrude) || 0));
    document.documentElement.classList.toggle('dark', raw.dark === true);
    syncControls();
}
try {
    if (location.hash.startsWith('#config='))
        restore(JSON.parse(decodeURIComponent(location.hash.slice(8))));
}
catch (e) {
    message(t('Shared configuration could not be read: ') + t(e.message));
}
syncControls();
$('#text-settings').hidden = source !== 'text';
try {
    kit = new SandKit($('#canvas'), { shapes: currentShapes(), options, onError: e => message(e.message), onStatus: s => {
            $('#status').textContent = s.state === 'ready' ? locale === 'zh' ? `${s.count.toLocaleString()} 粒沙 · ${s.shapes.length} 个形状` : `${s.count.toLocaleString()} grains · ${s.shapes.length} shapes` : s.state === 'error' ? s.message : t('Resampling…');
        } });
    await kit.ready;
}
catch (e) {
    message(e.message);
}
$('#source').onchange = selectSource;
$('#apply-text').onclick = selectSource;
$('#view').onchange = inspect;
$('#theme').onclick = () => { document.documentElement.classList.toggle('dark'); syncConfig(); };
$('#preset').onchange = () => { options = { ...DEFAULTS }; update(presets[$('#preset').value], true); };
$('#reset').onclick = () => { options = { ...DEFAULTS }; update(options, true); $('#preset').value = 'classic'; };
$('#replay').onclick = () => kit?.replay();
$('#play').onclick = () => { paused = !paused; if (paused)
    kit?.pause();
else if ($('#view').value === 'particles')
    kit?.resume(); $('#play').textContent = t(paused ? 'Play' : 'Pause'); };
const fit = () => {
    const value = $('#aspect').value, frame = $('#frame'), container = frame.parentElement;
    if (value === 'auto') {
        frame.style.width = '100%';
        frame.style.height = '100%';
        return;
    }
    const [w, h] = value.split('/').map(Number), width = Math.min(container.clientWidth - 40, (container.clientHeight - 40) * w / h);
    frame.style.width = width + 'px';
    frame.style.height = width * h / w + 'px';
};
$('#aspect').onchange = fit;
new ResizeObserver(fit).observe($('.canvas-wrap'));
$('#copy').onclick = async () => { try {
    await navigator.clipboard.writeText(JSON.stringify(config(), null, 2));
    message('Configuration copied.');
}
catch {
    message('Copy the JSON from the field above.');
} };
$('#share').onclick = async () => {
    const url = new URL(location.href);
    url.hash = 'config=' + encodeURIComponent(JSON.stringify(config()));
    history.replaceState(null, '', url);
    try {
        await navigator.clipboard.writeText(url.href);
        message('Share link copied.');
    }
    catch {
        message('Copy the URL from the address bar.');
    }
};
$('#download').onclick = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(config(), null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sandkit.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$('#import').onclick = () => $('#file').click();
$('#apply-config').onclick = async () => {
    try {
        const raw = JSON.parse($('#config').value);
        restore(raw);
        await kit?.setOptions(options);
        await selectSource();
        message('Configuration applied.');
    }
    catch (e) {
        message(e.message);
    }
};
$('#file').onchange = async () => {
    try {
        const file = $('#file').files[0];
        if (!file)
            return;
        if (file.size > 100000)
            throw new Error('Config file is too large.');
        restore(JSON.parse(await file.text()));
        await kit?.setOptions(options);
        await selectSource();
        message('Configuration imported.');
    }
    catch (e) {
        message(e.message);
    }
    $('#file').value = '';
};
window.addEventListener('pagehide', () => { clearTimeout(timer); kit?.dispose(); }, { once: true });

document.querySelector('[data-language]').addEventListener('click', event => {
    const url = new URL(event.currentTarget.href);
    url.hash = 'config=' + encodeURIComponent(JSON.stringify(config()));
    event.currentTarget.href = url.href;
});
