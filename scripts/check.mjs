import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
let failed = false;
async function walk(url) {
    for (const e of await readdir(url, { withFileTypes: true })) {
        const child = new URL(e.name + (e.isDirectory() ? '/' : ''), url);
        if (e.isDirectory()) {
            if (!['.git', 'dist', 'node_modules'].includes(e.name))
                await walk(child);
        }
        else if (/\.(mjs|js)$/.test(e.name)) {
            const check = spawnSync(process.execPath, ['--check', fileURLToPath(child)], { encoding: 'utf8' });
            if (check.status) {
                console.error(check.stderr);
                failed = true;
            }
        }
    }
}
await walk(root);
for (const name of ['sandkit-art', 'sandkit-build']) {
    const text = await readFile(new URL(`skills/${name}/SKILL.md`, root), 'utf8');
    if (!text.startsWith(`---\nname: ${name}\ndescription:`)) {
        console.error('Invalid skill metadata:', name);
        failed = true;
    }
}
if (failed)
    process.exitCode = 1;
else
    console.log('JavaScript syntax and skill metadata checks passed.');
