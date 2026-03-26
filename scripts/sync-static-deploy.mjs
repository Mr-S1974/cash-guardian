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
    removeIfExists('app-assets'),
    removeIfExists('icons'),
    removeIfExists('manifest.webmanifest'),
    removeIfExists('service-worker.js'),
    removeIfExists('social-preview.png'),
  ]);

  await Promise.all([
    copyIfExists('app-assets', 'app-assets'),
    copyIfExists('icons', 'icons'),
    copyIfExists('manifest.webmanifest', 'manifest.webmanifest'),
    copyIfExists('service-worker.js', 'service-worker.js'),
    copyIfExists('social-preview.png', 'social-preview.png'),
  ]);

  const builtHtml = await readFile(new URL('index.src.html', buildDir), 'utf8');
  await writeFile(new URL('index.html', rootDir), builtHtml, 'utf8');

  if (!(await pathExists(new URL('icons', rootDir)))) {
    await mkdir(new URL('icons', rootDir), { recursive: true });
  }
}

await sync();
