import { renderPage } from './pages.mjs';
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.png': 'image/png', '.xml': 'application/xml', '.json': 'application/json', '.md': 'text/plain' };
const port = Number(process.env.PORT || 4173);
http.createServer(async (req, res) => {
    try {
        let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        const page = pathname.match(/^\/site\/(zh\/)?(editor\/)?(?:index.html)?$/);
        if (page) pathname = '/site/' + (page[2] || '') + 'index.html';
        let path = resolve(root, '.' + (pathname === '/' ? '/site/' : pathname));
        if (!path.startsWith(root + sep) || path.split(sep).some(p => p.startsWith('.'))) {
            res.writeHead(403);
            res.end();
            return;
        }
        if ((await stat(path)).isDirectory())
            path = resolve(path, 'index.html');
        let data = await readFile(path);
        if (page || pathname === '/') data = renderPage(data.toString(), page?.[1] ? 'zh' : 'en', Boolean(page?.[2]));
        res.writeHead(200, { 'Content-Type': (types[extname(path)] || 'application/octet-stream'), 'Cache-Control': 'no-store' });
        res.end(data);
    }
    catch {
        res.writeHead(404);
        res.end('Not found');
    }
}).listen(port, '127.0.0.1', () => console.log(`SandKit preview: http://127.0.0.1:${port}/site/\nEditor: http://127.0.0.1:${port}/site/editor/`));
