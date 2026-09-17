import { t, locale, translatedPrompt } from './locale.js';
import { SandKit, textShape } from '../src/index.js';
import { samples, prompt } from './samples.js';
const currentPrompt = locale === 'zh' ? translatedPrompt : prompt;
const $ = s => document.querySelector(s);
$('#theme').onclick = () => document.documentElement.classList.toggle('dark');
$('#prompt').textContent = currentPrompt;
$('#copy-prompt').onclick = async () => {
    try {
        await navigator.clipboard.writeText(currentPrompt);
        $('#copy-prompt').textContent = t('Copied ✓');
    }
    catch {
        $('#copy-prompt').textContent = t('Select and copy the prompt above');
    }
};
const sharedText = new URLSearchParams(location.search).get('text');
if (sharedText !== null) $('#text').value = sharedText.slice(0, 40);
let kit, text;
const textScale = () => {
    const { width, height } = $('#text-art').getBoundingClientRect();
    return Math.min(2, 0.94 * width / Math.max(1, Math.min(width, height)));
};
const textResize = new ResizeObserver(() => { text?.setOptions({ pictureScale: textScale() }).catch(error => { $('#text-status').textContent = t(error.message); }); });
textResize.observe($('#text-art'));
try {
    kit = new SandKit($('#art'), { shapes: samples, options: { pictureScale: 1.02, color: '#4a71ee', colorDark: '#b6c4ff' }, onStatus: s => { $('#status').textContent = s.state === 'ready' ? locale === 'zh' ? `${s.count.toLocaleString()} 粒沙 · 移动光标探索` : `${s.count.toLocaleString()} grains · move to explore` : s.state === 'error' ? s.message : t('Gathering grains…'); } });
    await kit.ready;
}
catch (e) {
    $('#fallback').hidden = false;
    $('#status').textContent = t('Static preview') + ' · ' + e.message;
}
for (const b of document.querySelectorAll('[data-shape]'))
    b.onclick = () => {
        kit?.pin(b.dataset.shape || null);
        document.querySelector('.sample-bar .selected')?.classList.remove('selected');
        b.classList.add('selected');
    };
try {
    text = new SandKit($('#text-art'), { shapes: [textShape($('#text').value, { fontFamily: 'monospace' })], options: { pictureScale: textScale(), count: 42000, color: '#4a71ee', colorDark: '#b6c4ff', tilt: 0.22 } });
    await text.ready;
}
catch (e) {
    $('#text-status').textContent = e.message;
}
$('#words').onsubmit = async (e) => {
    e.preventDefault();
    if (!text)
        return;
    try {
        await text.setShapes([textShape($('#text').value, { fontFamily: 'monospace' })]);
        $('#text-status').textContent = '';
    }
    catch (error) {
        $('#text-status').textContent = t(error.message);
    }
};
window.addEventListener('pagehide', () => { textResize.disconnect(); kit?.dispose(); text?.dispose(); }, { once: true });

document.querySelector('[data-language]').addEventListener('click', event => {
    const url = new URL(event.currentTarget.href);
    url.searchParams.set('text', $('#text').value);
    event.currentTarget.href = url.href;
});
