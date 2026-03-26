import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const rootDir = new URL('..', import.meta.url);
const buildDir = new URL('../.static-build/', import.meta.url);

async function pathExists(path) {
  try {
    await readdir(path);
    return true;
  } catch {
    return false;
  }
}

async function removeIfExists(relativePath) {
  await rm(new URL(relativePath, rootDir), { recursive: true, force: true });
}

async function copyIfExists(fromRelativePath, toRelativePath) {
  const from = new URL(fromRelativePath, buildDir);

  try {
    await cp(from, new URL(toRelativePath, rootDir), { recursive: true });
  } catch {
    // Skip missing optional outputs.
  }
}

async function sync() {
  await Promise.all([
    removeIfExists('app'),
    removeIfExists('app-assets'),
    removeIfExists('icons'),
    removeIfExists('_redirects'),
    removeIfExists('manifest.webmanifest'),
    removeIfExists('service-worker.js'),
    removeIfExists('social-preview.png'),
    removeIfExists('social-preview.jpeg'),
    removeIfExists('social-preview-v2.jpeg'),
  ]);

  await Promise.all([
    copyIfExists('app-assets', 'app-assets'),
    copyIfExists('icons', 'icons'),
    copyIfExists('_redirects', '_redirects'),
    copyIfExists('manifest.webmanifest', 'manifest.webmanifest'),
    copyIfExists('service-worker.js', 'service-worker.js'),
    copyIfExists('social-preview.png', 'social-preview.png'),
    copyIfExists('social-preview.jpeg', 'social-preview.jpeg'),
    copyIfExists('social-preview-v2.jpeg', 'social-preview-v2.jpeg'),
  ]);

  const builtHtml = await readFile(new URL('index.src.html', buildDir), 'utf8');
  await mkdir(new URL('app/', rootDir), { recursive: true });
  await writeFile(new URL('app/index.html', rootDir), builtHtml, 'utf8');
  await writeFile(
    new URL('index.html', rootDir),
    `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=/app" />
    <link rel="canonical" href="https://cash-guardian.pages.dev/app" />
    <meta name="robots" content="noindex" />
    <title>CASH GUARDIAN</title>
    <script>
      window.location.replace('/app');
    </script>
  </head>
  <body></body>
</html>
`,
    'utf8',
  );

  if (!(await pathExists(new URL('icons', rootDir)))) {
    await mkdir(new URL('icons', rootDir), { recursive: true });
  }
}

await sync();
