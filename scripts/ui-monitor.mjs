/**
 * Monitor UI lokal.
 * Menjalankan dev server Next lalu menyajikan halaman monitor yang
 * menampilkan satu rute sekaligus di beberapa ukuran layar.
 *
 *   bun run ui                 → dev server :3000 + monitor :3100
 *   bun run ui -- --no-dev     → monitor saja (dev server sudah jalan)
 *   bun run ui:banding         → + versi "sebelum" (origin/main) di :3001
 *   bun run ui:banding <ref>   → bandingkan dengan branch/commit lain
 *
 * Versi "sebelum" dijalankan dari git worktree di folder saudara
 * (<nama-repo>-ui-sebelum) agar tidak ikut terbaca lint/typecheck proyek.
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

const DEV_PORT = Number(process.env.PORT ?? 3000);
const MONITOR_PORT = Number(process.env.UI_MONITOR_PORT ?? 3100);
const DEV_ORIGIN = `http://localhost:${DEV_PORT}`;
const startDev = !process.argv.includes('--no-dev');

const COMPARE_PORT = Number(process.env.UI_COMPARE_PORT ?? 3001);
const COMPARE_ORIGIN = `http://localhost:${COMPARE_PORT}`;
const compareFlag = process.argv.indexOf('--compare');
const compareRef =
  compareFlag === -1
    ? null
    : process.argv[compareFlag + 1] && !process.argv[compareFlag + 1].startsWith('--')
      ? process.argv[compareFlag + 1]
      : 'origin/main';

/** Rute cadangan bila sitemap belum bisa dibaca. */
const FALLBACK_ROUTES = [
  '/',
  '/tentang/sejarah/',
  '/tentang/prinsip/',
  '/tentang/lambang/',
  '/tentang/struktur/',
  '/kepengurusan/',
  '/kepengurusan/arsip/',
  '/program/',
  '/kegiatan/',
  '/prestasi/',
  '/galeri/',
  '/layanan/',
  '/gabung/',
  '/kontak/',
];

let dev;
if (startDev) {
  dev = spawn('bun', ['--bun', 'next', 'dev', '-p', String(DEV_PORT)], { stdio: 'inherit' });
  dev.on('exit', (code) => process.exit(code ?? 0));
}

function git(args, cwd = process.cwd()) {
  const res = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (res.status !== 0) throw new Error(`git ${args.join(' ')}\n${res.stderr}`);
  return res.stdout.trim();
}

/** Siapkan worktree versi "sebelum" lalu jalankan dev server-nya. */
let compare = null;
let compareDev;
if (compareRef) {
  const root = git(['rev-parse', '--show-toplevel']);
  const dir = path.resolve(root, '..', `${path.basename(root)}-ui-sebelum`);
  const sha = git(['rev-parse', '--verify', `${compareRef}^{commit}`]);
  compare = {
    origin: COMPARE_ORIGIN,
    ref: compareRef,
    sha: sha.slice(0, 7),
    subject: git(['log', '-1', '--format=%s', sha]),
  };

  console.log(`\n  ▸ Menyiapkan versi sebelum: ${compareRef} (${compare.sha}) di ${dir}`);
  if (existsSync(dir)) {
    git(['checkout', '--detach', '--force', sha], dir);
  } else {
    git(['worktree', 'prune']);
    git(['worktree', 'add', '--detach', dir, sha]);
  }
  spawnSync('bun', ['install'], { cwd: dir, stdio: 'inherit' });

  compareDev = spawn('bun', ['--bun', 'next', 'dev', '-p', String(COMPARE_PORT)], {
    cwd: dir,
    stdio: 'ignore',
  });
}

async function isUp(origin) {
  try {
    const res = await fetch(origin, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

/** Ambil daftar rute dari sitemap agar rute dinamis ikut terdaftar. */
async function getRoutes() {
  try {
    const res = await fetch(`${DEV_ORIGIN}/sitemap.xml`, { signal: AbortSignal.timeout(15000) });
    const xml = await res.text();
    const paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    if (paths.length) return [...new Set([...paths, '/halaman-tidak-ada/'])];
  } catch {
    // jatuh ke daftar cadangan
  }
  return FALLBACK_ROUTES;
}

const html = await readFile(new URL('./ui-monitor.html', import.meta.url), 'utf8');

createServer(async (req, res) => {
  const send = (status, type, body) => {
    res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
    res.end(body);
  };

  if (req.url === '/api/status') {
    return send(
      200,
      'application/json',
      JSON.stringify({
        up: await isUp(DEV_ORIGIN),
        compareUp: compare ? await isUp(COMPARE_ORIGIN) : false,
      }),
    );
  }
  if (req.url === '/api/routes') {
    return send(200, 'application/json', JSON.stringify(await getRoutes()));
  }
  if (req.url === '/api/config') {
    return send(200, 'application/json', JSON.stringify({ origin: DEV_ORIGIN, compare }));
  }
  send(200, 'text/html; charset=utf-8', html.replaceAll('__DEV_ORIGIN__', DEV_ORIGIN));
}).listen(MONITOR_PORT, () => {
  console.log(`\n  ▸ Monitor UI   http://localhost:${MONITOR_PORT}`);
  console.log(`  ▸ Situs        ${DEV_ORIGIN}`);
  if (compare) console.log(`  ▸ Sebelum      ${COMPARE_ORIGIN}  (${compare.ref} · ${compare.sha})`);
  console.log('');
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    dev?.kill(signal);
    compareDev?.kill(signal);
    process.exit(0);
  });
}
