// Builds dist/chromium (Chrome, Brave, Edge) and dist/firefox from one source.
// With --zip, also writes the store packages and a source zip (for AMO) to builds/.

import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { copyFile, cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const manifest = JSON.parse(await readFile(path.join(root, 'manifest.json'), 'utf8'));
const version = manifest.version;

const firefoxSettings = {
  gecko: {
    id: '{1a3293a4-ac4e-4e09-b893-d9ee32e8a934}',
    strict_min_version: '140.0',
    data_collection_permissions: { required: ['none'] }
  }
};

async function buildTarget(target) {
  const out = path.join(root, 'dist', target);
  await rm(out, { recursive: true, force: true });

  await build({
    entryPoints: {
      'content': path.join(root, 'src/content.ts'),
      'popup/popup': path.join(root, 'src/popup/popup.ts')
    },
    outdir: out,
    bundle: true,
    format: 'iife',
    target: target === 'firefox' ? 'firefox140' : 'chrome110',
    logLevel: 'warning'
  });

  await copyFile(path.join(root, 'src/popup/popup.html'), path.join(out, 'popup/popup.html'));
  await copyFile(path.join(root, 'src/popup/popup.css'), path.join(out, 'popup/popup.css'));
  await cp(path.join(root, 'src/assets'), path.join(out, 'assets'), {
    recursive: true,
    filter: (p) => !p.endsWith('.DS_Store')
  });

  const targetManifest = target === 'firefox'
    ? { ...manifest, browser_specific_settings: firefoxSettings }
    : manifest;
  await writeFile(path.join(out, 'manifest.json'), JSON.stringify(targetManifest, null, 2) + '\n');

  console.log(`Built dist/${target}`);
  return out;
}

function zipDir(dir, zipPath) {
  execFileSync('zip', ['-qrX', zipPath, '.', '-x', '*.DS_Store'], { cwd: dir });
}

const chromium = await buildTarget('chromium');
const firefox = await buildTarget('firefox');

if (process.argv.includes('--zip')) {
  const builds = path.join(root, 'builds');
  await mkdir(builds, { recursive: true });
  const zip = (name) => path.join(builds, `censorify-${name}-${version}.zip`);

  for (const name of ['chrome', 'edge', 'firefox', 'source']) {
    await rm(zip(name), { force: true });
  }
  zipDir(chromium, zip('chrome'));
  await copyFile(zip('chrome'), zip('edge'));
  zipDir(firefox, zip('firefox'));
  execFileSync('git', ['archive', '--format=zip', `--prefix=censorify-${version}/`, '-o', zip('source'), 'HEAD'], { cwd: root });

  console.log(`Packaged ${version} into builds/`);
}
