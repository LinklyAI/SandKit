import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderPage, sitemap, publicBase } from '../scripts/pages.mjs';
import { PARAMETERS } from '../src/options.js';
import { parameterZh, zh } from '../site/locale.js';
for (const editor of [false, true]) {
    test(`localized ${editor ? 'editor' : 'showcase'} has crawlable content and reciprocal URLs`, async () => {
        const template = await readFile(new URL(editor ? '../site/editor/index.html' : '../site/index.html', import.meta.url), 'utf8');
        for (const language of ['en', 'zh']) {
            const html = renderPage(template, language, editor);
            const page = (language === 'zh' ? 'zh/' : '') + (editor ? 'editor/' : '');
            assert.ok(html.includes(`lang="${language}"`));
            assert.ok(html.includes(`rel="canonical" href="${publicBase + page}"`));
            for (const alternate of ['en', 'zh', 'x-default']) assert.ok(html.includes(`hreflang="${alternate}"`));
            assert.ok(html.includes('property="og:image"'));
            const schema = JSON.parse(html.match(/type="application\/ld\+json">(.*?)<\/script>/s)[1]);
            assert.equal(schema.inLanguage, language);
            assert.equal(schema.url, publicBase + page);
            if (language === 'zh') {
                assert.ok(html.includes(editor ? '形状与素材' : '让每一粒沙，'));
                assert.ok(html.includes('href="https://linkly.ai/zh"'));
                if (!editor) assert.ok(html.includes('href="./zh/#create"'));
                // All static source text has a translation unless it is a brand, code or ratio.
                for (const match of template.matchAll(/>([^<>]+)</g)) {
                    const text = match[1].trim();
                    if (!/[A-Za-z]/.test(text) || /^(SandKit|GitHub)/.test(text)) continue;
                    assert.ok(zh[text], `Missing static translation: ${text}`);
                }
            }
        }
    });
}
test('all editor parameters have translated labels and help', () => {
    for (const key of Object.keys(PARAMETERS)) assert.equal(parameterZh[key]?.length, 2, key);
});
test('sitemap contains exactly the four canonical pages', () => {
    const urls = [...sitemap().matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
    assert.deepEqual(urls, ['', 'zh/', 'editor/', 'zh/editor/'].map(path => publicBase + path));
});
