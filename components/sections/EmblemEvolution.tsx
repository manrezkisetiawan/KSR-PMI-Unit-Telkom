'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';

/**
 * Linimasa sejarah dengan lambang yang berevolusi mengikuti gulir:
 * tanpa tanda pelindung (1859) → gagasan Dunant → palang merah Konvensi
 * Jenewa (1864) → lambang PMI (1945–1950). Sesudah 1950 lambang tetap,
 * sementara chip tiga akar KSR di kampus Telkom menyala satu per satu.
 *
 * Bentuk palang memakai geometri yang sama dengan logo resmi PMI
 * (public/media/brand/logo-pmi-resmi.svg) dan tidak pernah diputar atau
 * direnggangkan; tahap-tahap hanya menambah lapisan di sekelilingnya.
 *
 * Lambang tampil sebagai logo 3D bertebal yang miring ke satu arah
 * (maksimal 20°) di antara dua tonggak dan kembali menghadap depan tepat
 * di setiap tonggak, sehingga tetap terbaca utuh. Bayangan jatuh di dasar
 * putih memisahkan logo dari layar seolah melayang.
 */

type Era = 'gerakan' | 'pmi' | 'unit';

interface Milestone {
  year: string;
  title: string;
  body: string;
  /** Lokasi peristiwa (opsional). */
  place?: string;
  /** Tokoh yang terlibat (opsional). */
  people?: string;
  era: Era;
  /** Tahap lambang yang ditampilkan saat tonggak ini aktif. */
  stage: number;
}

const MILESTONES: Milestone[] = [
  {
    year: '1859',
    title: 'Pertempuran Solferino',
    body: '24 Juni 1859, pasukan gabungan Prancis–Sardinia dan pasukan Austria bertempur di sekitar Solferino. Dalam satu hari sekitar 40.000 tentara tewas atau terluka, dan layanan medis militer kewalahan. Henry Dunant, pengusaha asal Jenewa yang kebetulan melintas, menggerakkan penduduk Castiglione delle Stiviere untuk merawat korban dari kedua pihak dengan semboyan "tutti fratelli", semua bersaudara.',
    place: 'Solferino & Castiglione, Italia utara',
    people: 'Henry Dunant',
    era: 'gerakan',
    stage: 0,
  },
  {
    year: '1862',
    title: 'A Memory of Solferino',
    body: 'Dunant menerbitkan Un Souvenir de Solférino di Jenewa dengan biaya sendiri. Buku itu mengajukan dua gagasan: perhimpunan relawan yang dilatih sejak masa damai untuk merawat korban perang, dan perjanjian internasional yang melindungi korban luka beserta para penolongnya.',
    place: 'Jenewa, Swiss',
    people: 'Henry Dunant',
    era: 'gerakan',
    stage: 1,
  },
  {
    year: '1863',
    title: 'Komite Lima',
    body: '17 Februari 1863, lima warga Jenewa membentuk komite untuk mewujudkan gagasan Dunant; komite inilah cikal bakal Komite Internasional Palang Merah (ICRC). Pada Oktober tahun yang sama, konferensi internasional di Jenewa menyepakati ban lengan putih berpalang merah sebagai tanda pengenal para penolong.',
    place: 'Jenewa, Swiss',
    people: 'Henry Dunant, Gustave Moynier, Guillaume-Henri Dufour, Louis Appia, Théodore Maunoir',
    era: 'gerakan',
    stage: 2,
  },
  {
    year: '1864',
    title: 'Konvensi Jenewa I',
    body: '22 Agustus 1864, dua belas negara menandatangani Konvensi Jenewa pertama tentang perbaikan keadaan tentara yang terluka di medan perang. Konvensi ini menetapkan palang merah di atas dasar putih sebagai tanda pelindung bagi petugas medis, ambulans, dan rumah sakit yang merawat korban tanpa memandang pihak.',
    place: 'Jenewa, Swiss',
    era: 'gerakan',
    stage: 3,
  },
  {
    year: '1945',
    title: 'PMI berdiri',
    body: '3 September 1945, Presiden Soekarno memerintahkan Menteri Kesehatan dr. Boentaran Martoatmodjo membentuk badan palang merah nasional. Palang Merah Indonesia resmi berdiri pada 17 September 1945, satu bulan setelah proklamasi, dengan Drs. Mohammad Hatta sebagai ketua pertama.',
    place: 'Jakarta',
    people: 'Soekarno, dr. Boentaran Martoatmodjo, Mohammad Hatta',
    era: 'pmi',
    stage: 4,
  },
  {
    year: '1950',
    title: 'Badan hukum PMI',
    body: 'Keputusan Presiden RIS Nomor 25 Tahun 1950 menetapkan PMI sebagai satu-satunya organisasi palang merah di Indonesia. Pada tahun yang sama PMI diakui ICRC dan diterima sebagai anggota ke-68 Federasi Internasional Perhimpunan Palang Merah dan Bulan Sabit Merah.',
    era: 'pmi',
    stage: 5,
  },
  {
    year: '1995',
    title: 'Kerja sama Mendikbud–PMI',
    body: 'Kerja sama Menteri Pendidikan dan Kebudayaan dengan PMI membuat KSR Perguruan Tinggi menjamur di Indonesia. KSR adalah kesatuan relawan terlatih untuk tanggap darurat, pos pertolongan pertama, dan donor darah; unit perguruan tinggi berpangkalan di kampus, berbeda dari KSR Unit Markas.',
    era: 'unit',
    stage: 6,
  },
  {
    year: '1997',
    title: 'KSR PMI Unit STT Telkom',
    body: 'Sekelompok mahasiswa STT Telkom mendirikan KSR karena kehadirannya dirasakan penting untuk mendukung kegiatan kampus. KSR PMI Unit STT Telkom lahir 23 November 1997 lewat sebuah upacara khidmat, dengan kepengurusan sementara yang dikomandani Arief Wibowo.',
    people: 'Arief Wibowo',
    era: 'unit',
    stage: 7,
  },
  {
    year: '1998',
    title: 'Kepengurusan tetap pertama',
    body: 'Kepengurusan tetap pertama terbentuk di bawah Ading Fardhiansyah hingga Juni 2000, lalu berlanjut dari periode ke periode. Belakangan, melalui Musyawarah Anggota ke-10, nama unit berubah menjadi KSR PMI Unit IT Telkom mengikuti perubahan nama institusi.',
    people: 'Ading Fardhiansyah',
    era: 'unit',
    stage: 7,
  },
  {
    year: '2008',
    title: 'KSR Politeknik Telkom',
    body: '22 April 2008, tujuh mahasiswa Politeknik Telkom mendirikan KSR dengan bantuan KSR IT Telkom. Unit ini kemudian mendapat sekretariat yang sekaligus menjadi ruang kesehatan kampus, dan pernah menerima hibah DIKTI untuk pelatihan kesiapsiagaan bencana di Desa Bojong Soang.',
    people: 'Biyan Septyan (komandan pertama)',
    era: 'unit',
    stage: 8,
  },
  {
    year: '2012',
    title: 'Tim medis ospek STISI',
    body: 'Saat ospek mahasiswa STISI Telkom, kampus meminta KSR IT Telkom dan KSR Politeknik Telkom bertugas sebagai tim medis karena belum ada unit kemahasiswaan bidang medis di STISI. Permintaan itu berujung pada pembentukan unit KSR baru.',
    era: 'unit',
    stage: 8,
  },
  {
    year: '2013',
    title: 'KSR PMI Unit TCIS',
    body: '29 September 2013, KSR PMI Unit Telkom Creative Industries School lahir dengan pelantikan sembilan anggota perintis, setelah DIKLATSAR dan PPD perintis yang dibantu KSR IT Telkom dan KSR Politeknik Telkom. Nama TCIS dipilih karena STISI Telkom tengah bersiap menjadi fakultas di Universitas Telkom.',
    era: 'unit',
    stage: 9,
  },
  {
    year: 'Kini',
    title: 'KSR PMI Unit Universitas Telkom',
    body: 'STT Telkom, Politeknik Telkom, dan TCIS kini bernaung sebagai KSR PMI Unit Universitas Telkom: satu unit dengan tiga akar sejarah, meneruskan semangat tutti fratelli di kampus.',
    era: 'unit',
    stage: 10,
  },
];

const ERA_LABEL: Record<Era, string> = {
  gerakan: 'Gerakan Internasional · 1859–1864',
  pmi: 'Palang Merah Indonesia · 1945–1950',
  unit: 'KSR di Kampus Telkom · 1995–kini',
};

/** Keterangan lambang untuk tiap tahap. */
const STAGE_CAPTION = [
  'Belum ada tanda pelindung',
  'Gagasan sebuah tanda netral',
  'Palang merah diusulkan',
  'Lambang palang merah di atas dasar putih',
  'Kelopak PMI mengelilingi palang',
  'Lambang Palang Merah Indonesia',
  'KSR Perguruan Tinggi',
  'Akar pertama: STT Telkom',
  'Akar kedua: Politeknik Telkom',
  'Akar ketiga: TCIS',
  'Tiga akar, satu unit',
];

/** Tahap terakhir yang mengubah lambang; sesudahnya lambang PMI tetap. */
const LAST_EMBLEM_STAGE = 5;

const ROOTS = ['STT Telkom', 'Politeknik Telkom', 'TCIS'];

/**
 * Gambar asli Pertempuran Solferino (domain publik) yang memudar menjadi
 * lambang di awal linimasa. Simpan berkasnya di `public` sesuai `src` dan
 * isi `credit` dari halaman sumbernya. Bila berkas belum ada, panel
 * kembali ke siluet samar.
 */
const SOLFERINO_IMAGE = {
  src: '/media/sejarah/solferino-1859.jpg',
  alt: 'Lukisan Pertempuran Solferino, 24 Juni 1859',
  credit: 'Pertempuran Solferino, 1859 · domain publik · Wikimedia Commons',
};

/* Geometri dari logo resmi PMI (koordinat asli, pusat ±240,228). */
const CROSS =
  '273.2 132.1 273.2 195.8 336.9 195.8 336.9 261.2 273.2 261.2 273.2 324.9 207.5 324.9 207.5 261.2 143.7 261.2 143.7 195.8 207.5 195.8 207.5 132.1';
const FLOWER_OUTER =
  'M318.9,128.1c33.2-6.1,67,9,84.1,38,23.4,39.5,8,91.8-33.2,111.6,19.5,37.4,6.1,83.8-29.9,105.3-31.9,19-73.1,13.1-98.6-13.5-4.2,3.4-8,7.2-12.4,10.3-27.9,19.4-64.9,19-92.4-.8-31.4-22.6-42.1-65.7-24.4-100.3-44.4-21.7-59.5-77.9-30.4-118.6,18.1-25.3,49.4-37.5,80.1-31.9,2.8-22.7,17.5-44,36.9-55.9,48.6-29.7,112.1,0,120.2,55.9Z';
const FLOWER_INNER =
  'M306.5,146.1c35-15.9,75.8.8,89.7,36.4,12,30.6-.6,65.7-29,81.8-5.6,3.2-11.4,4.9-17.3,7.1,26.6,31.4,18.3,80-17.4,100.5-30.2,17.3-67.4,8.8-87.6-19.2-.6-.8-3.2-5.3-3.5-5.3-.6-.2-3.2,4.5-3.9,5.3-11.1,15.3-29.3,26.8-48.6,27.9-56.9,3.5-92.3-57.7-59.6-104.9.5-.8,3.4-3.9,2.9-4.5-40.7-8.5-63.2-52.9-46.6-91.3,14.7-33.8,54.9-49.2,88.7-33.8-1.4-15.7,2.9-31.9,12.1-44.6,22-30.6,65-36.8,94.9-13.7,17.7,13.7,27.4,35.9,25.3,58.3Z';

function Emblem({ stage, hasPainting }: { stage: number; hasPainting: boolean }) {
  const on = (min: number, max = Infinity) => stage >= min && stage <= max;

  return (
    <svg viewBox="20 8 440 460" aria-hidden="true" className="emblem-evo h-full w-full">
      {/* Tahap 0: siluet samar, belum ada tanda */}
      <polygon
        points={CROSS}
        className="evo-layer"
        fill="none"
        stroke="#15171a"
        strokeOpacity={0.18}
        strokeWidth={2}
        strokeDasharray="6 8"
        style={{ opacity: on(0, 0) && !hasPainting ? 1 : 0 }}
      />

      {/* Tahap 1: gagasan, garis putus-putus merah */}
      <polygon
        points={CROSS}
        className="evo-layer"
        fill="none"
        stroke="#E4002B"
        strokeWidth={3}
        strokeDasharray="14 10"
        style={{ opacity: on(1, 1) ? 1 : 0 }}
      />

      {/* Tahap 2: garis palang tergambar penuh */}
      <polygon
        points={CROSS}
        pathLength={1}
        className="evo-draw"
        fill="none"
        stroke="#E4002B"
        strokeWidth={4}
        strokeLinejoin="miter"
        style={{ strokeDashoffset: on(2) ? 0 : 1, opacity: on(2, 3) ? 1 : 0 }}
      />

      {/* Tahap 4: kelopak PMI tergambar, tahap 5+: terisi */}
      <path
        d={FLOWER_OUTER}
        pathLength={1}
        className="evo-draw"
        fill="none"
        stroke="#E4002B"
        strokeWidth={4}
        style={{ strokeDashoffset: on(4) ? 0 : 1, opacity: on(4, 4) ? 1 : 0 }}
      />
      <path
        d={FLOWER_OUTER}
        fill="#E4002B"
        className="evo-layer"
        style={{ opacity: on(5) ? 1 : 0 }}
      />
      <path
        d={FLOWER_INNER}
        fill="#FFFFFF"
        className="evo-layer"
        style={{ opacity: on(5) ? 1 : 0 }}
      />

      {/* Tahap 3+: palang merah terisi */}
      <polygon
        points={CROSS}
        fill="#E4002B"
        className="evo-layer"
        style={{ opacity: on(3) ? 1 : 0 }}
      />
    </svg>
  );
}

/** Jumlah lapisan ketebalan di belakang muka logo. */
const EXTRUDE_LAYERS = 20;
/** Garis pemicu tonggak aktif, relatif terhadap tinggi layar. */
const TRIGGER = 0.55;
/** Kemiringan maksimum logo karena gulir (derajat). */
const MAX_TILT = 20;
/** Anggukan atas-bawah saat berpindah tonggak (derajat). */
const MAX_NOD = 8;
/** Seberapa jauh logo terangkat ke arah layar saat miring (px). */
const MAX_LIFT = 48;
/** Kemiringan tambahan mengikuti kursor (derajat). */
const POINTER_TILT = 5;

function extrudeShade(i: number) {
  // Merah tua di dekat muka, makin gelap ke belakang.
  const t = i / (EXTRUDE_LAYERS - 1);
  const r = Math.round(176 - 86 * t);
  const b = Math.round(31 - 11 * t);
  return `rgb(${r} 0 ${b})`;
}

/** Siluet gelap logo untuk bayangan jatuh. */
function EmblemShadow({ stage }: { stage: number }) {
  return (
    <svg viewBox="20 8 440 460" aria-hidden="true" className="emblem-evo h-full w-full">
      <path
        d={FLOWER_OUTER}
        fill="#15171a"
        className="evo-layer"
        style={{ opacity: stage >= 5 ? 1 : 0 }}
      />
      <polygon
        points={CROSS}
        fill="#15171a"
        className="evo-layer"
        style={{ opacity: stage >= 3 && stage < 5 ? 1 : 0 }}
      />
    </svg>
  );
}

/** Sisi tebal logo: salinan siluet yang ditumpuk ke belakang (translateZ). */
function Extrusion({ stage }: { stage: number }) {
  const shape = stage >= 5 ? 'flower' : stage >= 3 ? 'cross' : null;

  return Array.from({ length: EXTRUDE_LAYERS }, (_, i) => (
    <svg
      key={i}
      viewBox="20 8 440 460"
      aria-hidden="true"
      className="emblem-evo absolute inset-0 h-full w-full"
      style={{ transform: `translateZ(calc(var(--evo-depth) * -${i + 1}))` }}
    >
      <path
        d={FLOWER_OUTER}
        fill={extrudeShade(i)}
        className="evo-layer"
        style={{ opacity: shape === 'flower' ? 1 : 0 }}
      />
      <polygon
        points={CROSS}
        fill={extrudeShade(i)}
        className="evo-layer"
        style={{ opacity: shape === 'cross' ? 1 : 0 }}
      />
    </svg>
  ));
}

export function EmblemEvolution() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const [hasPainting, setHasPainting] = useState(false);

  const reduceMotion = useReducedMotion();
  const spring = { stiffness: 90, damping: 16, mass: 0.8 };

  // 0…1: besar kemiringan; 0 berarti menghadap depan.
  const sway = useMotionValue(0);
  // -1…1: anggukan; naik lalu turun selama perpindahan tonggak.
  const nod = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const swaySpring = useSpring(sway, spring);
  const nodSpring = useSpring(nod, spring);
  const pointerXSpring = useSpring(pointerX, spring);
  const pointerYSpring = useSpring(pointerY, spring);

  const rotateY = useTransform(
    [swaySpring, pointerXSpring],
    ([s, p]: number[]) => s! * MAX_TILT + p! * POINTER_TILT,
  );
  const rotateX = useTransform(
    [nodSpring, pointerYSpring],
    ([n, p]: number[]) => n! * MAX_NOD - p! * POINTER_TILT,
  );
  const lift = useTransform(swaySpring, (v) => v * MAX_LIFT);
  // Bayangan menjauh dan melembut saat logo terangkat.
  const shadowX = useTransform(swaySpring, (v) => `${5 + v * 7}%`);
  const shadowY = useTransform(
    [swaySpring, nodSpring],
    ([s, n]: number[]) => `${7 + s! * 4 + n! * 2}%`,
  );
  const shadowScale = useTransform(swaySpring, (v) => 0.97 - v * 0.07);
  const shadowOpacity = useTransform(swaySpring, (v) => 0.3 - v * 0.12);

  // Lukisan Solferino memudar seiring gulir menuju tonggak kedua.
  const painting = useMotionValue(1);
  const paintingScale = useTransform(painting, (v) => 1 + v * 0.06);

  // Isian rel merah mengikuti garis pemicu secara langsung, tanpa jeda.
  const railFill = useMotionValue(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const list = listRef.current?.getBoundingClientRect();
      if (!list) return;
      // innerHeight dan getBoundingClientRect sama-sama dalam piksel layar,
      // termasuk saat body diskalakan (zoom).
      const line = window.innerHeight * TRIGGER;

      railFill.set(Math.min(1, Math.max(0, (line - list.top) / list.height)));

      // Posisi kontinu di linimasa: 2.5 berarti tepat di antara tonggak 2 dan 3.
      const centers = itemRefs.current.map((el) => {
        const rect = el?.getBoundingClientRect();
        return rect ? rect.top + rect.height / 2 : 0;
      });
      const last = centers.length - 1;
      let pos = 0;
      if (line >= centers[last]!) {
        pos = last;
      } else if (line > centers[0]!) {
        for (let i = 0; i < last; i++) {
          if (line < centers[i + 1]!) {
            pos = i + (line - centers[i]!) / (centers[i + 1]! - centers[i]!);
            break;
          }
        }
      }

      setActive(Math.round(pos));
      painting.set(Math.min(1, Math.max(0, 1 - pos / 0.9)));
      // Miring ke satu arah dan mengangguk, nol tepat di setiap tonggak.
      sway.set(reduceMotion ? 0 : Math.abs(Math.sin(Math.PI * pos)));
      nod.set(reduceMotion ? 0 : Math.sin(2 * Math.PI * pos));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [sway, nod, painting, railFill, reduceMotion]);

  // Tampilkan lukisan hanya bila berkasnya memang tersedia.
  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setHasPainting(true);
    probe.src = SOLFERINO_IMAGE.src;
  }, []);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  };
  const onPointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const current = MILESTONES[active] ?? MILESTONES[0]!;
  const stage = current.stage;

  return (
    <section
      aria-labelledby="evolusi-title"
      className="w-full border-b border-[var(--border)] bg-[var(--bg)] px-[clamp(20px,2.8vw,56px)] pb-16 lg:pb-24"
    >
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* Panel lambang: bar ringkas di HP, kolom sticky di desktop */}
        <div className="sticky top-[var(--header-h)] z-20 -mx-[clamp(20px,2.8vw,56px)] self-start border-b border-[var(--border)] bg-[var(--bg)]/95 px-[clamp(20px,2.8vw,56px)] py-3 backdrop-blur lg:top-[calc(var(--header-h)+40px)] lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:pt-16 lg:backdrop-blur-none">
          <div className="flex items-center gap-4 lg:flex-col lg:items-stretch lg:gap-6">
            <div
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
              className="relative size-24 shrink-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-2 [--evo-depth:0.7px] [perspective:900px] sm:size-28 lg:aspect-square lg:size-auto lg:rounded-[var(--radius-lg)] lg:p-10 lg:[--evo-depth:2.8px] lg:[perspective:1000px]"
            >
              {/* Lukisan asli Solferino yang memudar menjadi lambang */}
              {hasPainting && (
                <motion.div
                  aria-hidden={active > 0}
                  className="absolute inset-0 overflow-hidden rounded-[inherit]"
                  style={{ opacity: painting }}
                >
                  <motion.div className="absolute inset-0" style={{ scale: paintingScale }}>
                    <Image
                      src={SOLFERINO_IMAGE.src}
                      alt={SOLFERINO_IMAGE.alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 112px"
                      className="object-cover sepia-[0.35]"
                    />
                  </motion.div>
                </motion.div>
              )}

              {/* Bayangan jatuh berbentuk siluet logo di atas dasar putih */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-2 blur-[3px] lg:inset-10 lg:blur-[18px]"
                style={{
                  x: shadowX,
                  y: shadowY,
                  scale: shadowScale,
                  opacity: shadowOpacity,
                }}
              >
                <EmblemShadow stage={Math.min(stage, LAST_EMBLEM_STAGE)} />
              </motion.div>

              {/* Melayang pelan (CSS) + miring, mengangguk, dan terangkat (gulir) */}
              <div className="evo-float relative h-full w-full [transform-style:preserve-3d]">
                <motion.div
                  className="relative h-full w-full [transform-style:preserve-3d]"
                  style={{ rotateY, rotateX, z: lift }}
                >
                  <Extrusion stage={Math.min(stage, LAST_EMBLEM_STAGE)} />
                  <div className="relative h-full w-full [transform:translateZ(0)]">
                    <Emblem stage={Math.min(stage, LAST_EMBLEM_STAGE)} hasPainting={hasPainting} />
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-bold tracking-[0.16em] text-[var(--muted)] uppercase">
                {String(active + 1).padStart(2, '0')} / {String(MILESTONES.length).padStart(2, '0')}
              </p>
              <p
                key={current.year}
                className="evo-year mt-1 font-mono text-3xl leading-none font-bold text-[var(--accent)] lg:text-6xl"
              >
                {current.year}
              </p>
              <p className="mt-2 text-sm leading-snug font-semibold text-[var(--fg)] lg:text-lg">
                {STAGE_CAPTION[stage]}
              </p>
              {hasPainting && active === 0 && (
                <p className="mt-1 hidden text-xs text-[var(--meta)] lg:block">
                  {SOLFERINO_IMAGE.credit}
                </p>
              )}

              {/* Tiga akar menyala saat unit terbentuk */}
              <ul
                className={`mt-3 hidden flex-wrap gap-2 transition-opacity duration-300 sm:flex ${
                  stage >= 6 ? 'opacity-100' : 'invisible opacity-0'
                }`}
              >
                {ROOTS.map((root, i) => {
                  const lit = stage >= 7 + i;
                  return (
                    <li
                      key={root}
                      className={`rounded-[var(--radius-pill)] border px-3 py-1 font-mono text-xs transition-colors duration-300 ${
                        lit
                          ? 'border-[var(--accent)] text-[var(--accent)]'
                          : 'border-[var(--border)] text-[var(--meta)]'
                      }`}
                    >
                      {root}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Linimasa */}
        <div className="pt-10 lg:pt-16">
          <span className="font-mono text-sm font-bold tracking-wider text-[var(--accent)] uppercase">
            Evolusi Lambang
          </span>
          <h2
            id="evolusi-title"
            className="mt-2 text-2xl font-bold tracking-tight text-[var(--fg)] sm:text-3xl"
          >
            Dari Solferino ke kampus Telkom
          </h2>
          <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-[var(--fg-2)]">
            Gulir untuk mengikuti bagaimana sebuah tanda pelindung lahir, menjadi lambang Palang
            Merah Indonesia, lalu menaungi tiga unit KSR yang kini menjadi satu.
          </p>

          <ol ref={listRef} className="relative mt-10 lg:pb-[20vh]">
            {/* Rel linimasa dan isian progres gulir */}
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[5px] w-0.5 bg-[var(--border)]"
            />
            <motion.span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[5px] w-0.5 origin-top bg-[var(--accent)]"
              style={{ scaleY: railFill }}
            />

            {MILESTONES.map((m, i) => {
              const isActive = i === active;
              const isPast = i < active;
              const newEra = i === 0 || MILESTONES[i - 1]!.era !== m.era;
              return (
                <li
                  key={`${m.year}-${m.title}`}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  data-index={i}
                  className="relative pl-8"
                >
                  {newEra && (
                    <p
                      className={`pb-2 font-mono text-xs font-bold tracking-[0.14em] text-[var(--meta)] uppercase ${i === 0 ? '' : 'pt-8'}`}
                    >
                      {ERA_LABEL[m.era]}
                    </p>
                  )}

                  <div className="relative py-8 lg:py-12">
                    <span
                      aria-hidden="true"
                      className={`absolute top-8 -left-8 mt-1.5 size-3 rounded-full ring-4 ring-[var(--bg)] transition-colors duration-300 lg:top-12 ${
                        isActive || isPast ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
                      } ${isActive ? 'animate-heartbeat' : ''}`}
                    />
                    <div
                      className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-45'}`}
                    >
                      <p className="font-mono text-sm font-bold tracking-wider text-[var(--accent)]">
                        {m.year}
                      </p>
                      <h3 className="mt-1 text-xl leading-snug font-bold text-[var(--fg)] sm:text-2xl">
                        {m.title}
                      </h3>
                      <p className="mt-2 max-w-[60ch] text-base leading-relaxed text-[var(--fg-2)]">
                        {m.body}
                      </p>
                      {(m.place || m.people) && (
                        <dl className="mt-3 flex flex-col gap-1 text-sm">
                          {m.place && (
                            <div className="flex gap-2">
                              <dt className="w-16 shrink-0 font-mono text-xs leading-5 tracking-wider text-[var(--meta)] uppercase">
                                Tempat
                              </dt>
                              <dd className="text-[var(--muted)]">{m.place}</dd>
                            </div>
                          )}
                          {m.people && (
                            <div className="flex gap-2">
                              <dt className="w-16 shrink-0 font-mono text-xs leading-5 tracking-wider text-[var(--meta)] uppercase">
                                Tokoh
                              </dt>
                              <dd className="text-[var(--muted)]">{m.people}</dd>
                            </div>
                          )}
                        </dl>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
