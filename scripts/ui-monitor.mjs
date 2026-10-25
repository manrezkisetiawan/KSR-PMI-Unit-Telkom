/**
 * Monitor UI lokal.
 * Menjalankan dev server Next lalu menyajikan halaman monitor yang
 * menampilkan satu rute sekaligus di beberapa ukuran layar.
 *
 *   bun run ui                 → dev server :3000 + monitor :3100
 *   bun run ui -- --no-dev     → monitor saja (dev server sudah jalan)
 */
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';

const DEV_PORT = Number(process.env.PORT ?? 3000);
const MONITOR_PORT = Number(process.env.UI_MONITOR_PORT ?? 3100);
const DEV_ORIGIN = `http://localhost:${DEV_PORT}`;
const startDev = !process.argv.includes('--no-dev');

/** Rute cadangan bila sitemap belum bisa dibaca. */
const FALLBACK_ROUTES = [
  '/',
  '/tentang/sejarah/',
  '/tentang/visi-misi/',
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

async function devIsUp() {
  try {
    const res = await fetch(DEV_ORIGIN, { signal: AbortSignal.timeout(1500) });
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
      JSON.stringify({ up: await devIsUp(), origin: DEV_ORIGIN }),
    );
  }
  if (req.url === '/api/routes') {
    return send(200, 'application/json', JSON.stringify(await getRoutes()));
  }
  send(200, 'text/html; charset=utf-8', html.replaceAll('__DEV_ORIGIN__', DEV_ORIGIN));
}).listen(MONITOR_PORT, () => {
  console.log(`\n  ▸ Monitor UI   http://localhost:${MONITOR_PORT}`);
  console.log(`  ▸ Situs        ${DEV_ORIGIN}\n`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    dev?.kill(signal);
    process.exit(0);
  });
}
