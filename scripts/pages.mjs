import { zh } from '../site/locale.js';
export const publicBase = 'https://linkly.ai/sandkit/';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export function renderPage(template, language = 'en', editor = false) {
    const isZh = language === 'zh';
    let html = template;
    if (isZh) {
        html = html.replace('lang="en"', 'lang="zh"')
            .replace(/>([^<>]+)</g, (_, text) => '>' + text.replace(text.trim(), zh[text.trim()] ?? text.trim()) + '<')
            .replace(/(content|alt|aria-label)="([^"]*)"/g, (_, key, value) => `${key}="${escape(zh[value] ?? value)}"`);
        // Keep assets shared; only page navigation changes with the locale.
        html = html.replace('<head>', `<head>\n<base href="${editor ? '../../editor/' : '../'}">`);
        if (editor) html = html.replaceAll('href="../"', 'href="../zh/"');
        else html = html.replaceAll('href="./editor/"', 'href="./zh/editor/"').replace('href="#create"', 'href="./zh/#create"').replace('class="brand" href="./"', 'class="brand" href="./zh/"');
        html = html.replaceAll('href="https://linkly.ai/#get-started"', 'href="https://linkly.ai/zh#get-started"').replaceAll('href="https://linkly.ai/"', 'href="https://linkly.ai/zh"');
    }
    const page = (isZh ? 'zh/' : '') + (editor ? 'editor/' : '');
    const canonical = publicBase + page;
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    const description = editor
        ? (isZh ? '在 SandKit 在线编辑器中调试沙画：沙粒、深度、运动、文字与配色，实时预览并分享参数。' : 'Fine-tune sand art in the SandKit editor: particles, depth, motion, typography and color. Preview live and share your configuration.')
        : html.match(/name="description" content="([^"]*)"/)[1];
    const suffix = editor ? 'editor/' : '';
    const metadata = `
${editor ? `<meta name="description" content="${description}">` : ''}
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${publicBase + suffix}">
<link rel="alternate" hreflang="zh" href="${publicBase + 'zh/' + suffix}">
<link rel="alternate" hreflang="x-default" href="${publicBase + suffix}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SandKit by Linkly AI">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${isZh ? 'zh_CN' : 'en_US'}">
<meta property="og:locale:alternate" content="${isZh ? 'en_US' : 'zh_CN'}">
<meta property="og:image" content="${publicBase}assets/typewriter.webp">
<meta property="og:image:width" content="800">
<meta property="og:image:height" content="800">
<meta property="og:image:alt" content="${isZh ? 'SandKit 复古打字机线稿演示' : 'SandKit vintage typewriter illustration'}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareSourceCode', name: 'SandKit', description, url: canonical, codeRepository: 'https://github.com/LinklyAI/SandKit', license: 'https://opensource.org/license/mit', programmingLanguage: 'JavaScript', inLanguage: language, author: { '@type': 'Organization', name: 'Linkly AI', url: 'https://linkly.ai/' } })}</script>
`;
    const alternate = editor ? (isZh ? './' : '../zh/editor/') : (isZh ? './' : './zh/');
    html = html.replace('</head>', metadata + '</head>').replace('<nav>', `<nav>\n<a class="language-link" data-language href="${alternate}" lang="${isZh ? 'en' : 'zh'}" hreflang="${isZh ? 'en' : 'zh'}">${isZh ? 'English' : '中文'}</a>`);
    return html;
}
export function sitemap() {
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ['', 'zh/', 'editor/', 'zh/editor/'].map(path => `  <url><loc>${publicBase + path}</loc></url>`).join('\n') + '\n</urlset>\n';
}
