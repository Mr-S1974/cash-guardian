import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const candidates = ['wrangler.toml', 'wrangler.json', 'wrangler.jsonc'];
const configPath = candidates.find((candidate) => fs.existsSync(path.join(cwd, candidate)));

if (!configPath) {
  console.error('Cloudflare Wrangler config is missing.');
  console.error('Run `npm run cf:pages:config:download` once to pull the current Pages config.');
  console.error('This is safer than hand-writing wrangler config because Pages config becomes source of truth.');
  process.exit(1);
}

console.log(`Using ${configPath} for Cloudflare Pages deploy.`);
