import { renderPage, sitemap } from './pages.mjs';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const out = new URL('dist/sandkit/', root);
await mkdir(out, { recursive: true });
await cp(new URL('site/', root), out, { recursive: true });
await cp(new URL('src/', root), new URL('src/', out), { recursive: true });
await cp(new URL('skills/sandkit-art/assets/', root), new URL('assets/', out), { recursive: true });
await cp(new URL('LICENSE', root), new URL('LICENSE', out));
for (const [file, from, to] of [
    ['showcase.js', '../src/', './src/'],
    ['samples.js', '../skills/sandkit-art/assets/', './assets/'],
    ['index.html', '../skills/sandkit-art/assets/', './assets/'],
    ['editor/editor.js', '../../src/', '../src/'],
]) {
    const url = new URL(file, out);
    await writeFile(url, (await readFile(url, 'utf8')).replaceAll(from, to));
}
for (const editor of [false, true]) {
    const file = editor ? 'editor/index.html' : 'index.html';
    const template = await readFile(new URL(file, out), 'utf8');
    for (const language of ['en', 'zh']) {
        const target = new URL((language === 'zh' ? 'zh/' : '') + file, out);
        await mkdir(new URL('./', target), { recursive: true });
        await writeFile(target, renderPage(template, language, editor));
    }
}
await writeFile(new URL('sitemap.xml', out), sitemap());
console.log('Static output: dist/sandkit/ — mount at /sandkit/ on the official website.');
