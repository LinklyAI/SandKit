const base = new URL('../skills/sandkit-art/assets/', import.meta.url);
export const samples = ['brain', 'computer', 'books', 'typewriter'].map(name => ({
    name, url: new URL(name + '.webp', base).href,
    depthUrl: new URL(name + '-depth.webp', base).href,
}));
export const prompt = 'Read https://github.com/LinklyAI/SandKit/blob/main/GETTING_STARTED.md and follow it to set up the two SandKit skills, then create and run an interactive sand-art demo using the included samples in this directory.';
