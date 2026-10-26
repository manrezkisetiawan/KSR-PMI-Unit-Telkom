'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

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
  era: Era;
  /** Tahap lambang yang ditampilkan saat tonggak ini aktif. */
  stage: number;
}

const MILESTONES: Milestone[] = [
  {
    year: '1859',
    title: 'Pertempuran Solferino',
    body: '24 Juni, sekitar 40.000 tentara Prancis dan Austria tewas atau terluka di Italia utara. Belum ada tanda yang melindungi penolong di medan perang.',
    era: 'gerakan',
    stage: 0,
  },
  {
    year: '1862',
    title: 'A Memory of Solferino',
    body: 'Henry Dunant menerbitkan buku yang mengusulkan komite relawan dan perjanjian internasional.',
    era: 'gerakan',
    stage: 1,
  },
  {
    year: '1863',
    title: 'Komite Lima',
    body: '17 Februari di Jenewa, lima warga mendirikan komite yang menjadi cikal bakal ICRC.',
    era: 'gerakan',
    stage: 2,
  },
  {
    year: '1864',
    title: 'Konvensi Jenewa I',
    body: 'Delegasi dari belasan negara mengadopsi lambang palang merah di atas dasar putih.',
    era: 'gerakan',
    stage: 3,
  },
  {
    year: '1945',
    title: 'PMI berdiri',
    body: '17 September, Palang Merah Indonesia dibentuk satu bulan setelah proklamasi kemerdekaan.',
    era: 'pmi',
    stage: 4,
  },
  {
    year: '1950',
    title: 'Badan hukum PMI',
    body: 'Keputusan Presiden Nomor 25 Tahun 1950 menetapkan PMI sebagai organisasi palang merah tunggal.',
    era: 'pmi',
    stage: 5,
  },
  {
    year: '1995',
    title: 'Kerja sama Mendikbud–PMI',
    body: 'Pendirian KSR Perguruan Tinggi menjamur di Indonesia, membuka jalan bagi unit di kampus Telkom.',
    era: 'unit',
    stage: 6,
  },
  {
    year: '1997',
    title: 'KSR PMI Unit STT Telkom',
    body: '23 November, lahir melalui upacara dengan kepengurusan sementara dikomandani Arief Wibowo.',
    era: 'unit',
    stage: 7,
  },
  {
    year: '1998',
    title: 'Kepengurusan tetap pertama',
    body: 'Ading Fardhiansyah memimpin hingga Juni 2000, dilanjutkan periode-periode berikutnya.',
    era: 'unit',
    stage: 7,
  },
  {
    year: '2008',
    title: 'KSR Politeknik Telkom',
    body: '22 April, dibentuk tujuh mahasiswa dengan komandan pertama Biyan Septyan.',
    era: 'unit',
    stage: 8,
  },
  {
    year: '2012',
    title: 'Tim medis ospek STISI',
    body: 'STISI Telkom meminta bantuan tim medis, memicu pembentukan unit KSR baru.',
    era: 'unit',
    stage: 8,
  },
  {
    year: '2013',
    title: 'KSR PMI Unit TCIS',
    body: '29 September, sembilan anggota perintis dilantik setelah DIKLATSAR dan PPD perintis.',
    era: 'unit',
    stage: 9,
  },
  {
    year: 'Kini',
    title: 'KSR PMI Unit Universitas Telkom',
    body: 'Tiga akar, satu unit: STT Telkom, Politeknik Telkom, dan TCIS menyatu menjadi KSR PMI Unit Universitas Telkom.',
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

/* Geometri dari logo resmi PMI (koordinat asli, pusat ±240,228). */
const CROSS =
  '273.2 132.1 273.2 195.8 336.9 195.8 336.9 261.2 273.2 261.2 273.2 324.9 207.5 324.9 207.5 261.2 143.7 261.2 143.7 195.8 207.5 195.8 207.5 132.1';
const FLOWER_OUTER =
  'M318.9,128.1c33.2-6.1,67,9,84.1,38,23.4,39.5,8,91.8-33.2,111.6,19.5,37.4,6.1,83.8-29.9,105.3-31.9,19-73.1,13.1-98.6-13.5-4.2,3.4-8,7.2-12.4,10.3-27.9,19.4-64.9,19-92.4-.8-31.4-22.6-42.1-65.7-24.4-100.3-44.4-21.7-59.5-77.9-30.4-118.6,18.1-25.3,49.4-37.5,80.1-31.9,2.8-22.7,17.5-44,36.9-55.9,48.6-29.7,112.1,0,120.2,55.9Z';
const FLOWER_INNER =
  'M306.5,146.1c35-15.9,75.8.8,89.7,36.4,12,30.6-.6,65.7-29,81.8-5.6,3.2-11.4,4.9-17.3,7.1,26.6,31.4,18.3,80-17.4,100.5-30.2,17.3-67.4,8.8-87.6-19.2-.6-.8-3.2-5.3-3.5-5.3-.6-.2-3.2,4.5-3.9,5.3-11.1,15.3-29.3,26.8-48.6,27.9-56.9,3.5-92.3-57.7-59.6-104.9.5-.8,3.4-3.9,2.9-4.5-40.7-8.5-63.2-52.9-46.6-91.3,14.7-33.8,54.9-49.2,88.7-33.8-1.4-15.7,2.9-31.9,12.1-44.6,22-30.6,65-36.8,94.9-13.7,17.7,13.7,27.4,35.9,25.3,58.3Z';

function Emblem({ stage }: { stage: number }) {
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
        style={{ opacity: on(0, 0) ? 1 : 0 }}
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
/** Kemiringan maksimum logo (derajat). */
const MAX_TILT = 20;

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

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 55%', 'end 55%'],
  });
  const railScale = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  const reduceMotion = useReducedMotion();
  // 0…1: besar kemiringan; 0 berarti menghadap depan.
  const sway = useMotionValue(0);
  const swaySpring = useSpring(sway, { stiffness: 150, damping: 22, mass: 0.6 });
  const rotateY = useTransform(swaySpring, (v) => v * MAX_TILT);
  const rotateX = useTransform(swaySpring, (v) => v * -4);
  // Bayangan menjauh dan melembut saat logo miring, seakan terangkat.
  const shadowX = useTransform(swaySpring, (v) => `${5 + v * 6}%`);
  const shadowY = useTransform(swaySpring, (v) => `${7 + v * 3}%`);
  const shadowScale = useTransform(swaySpring, (v) => 0.97 - v * 0.05);
  const shadowOpacity = useTransform(swaySpring, (v) => 0.3 - v * 0.1);

  useEffect(() => {
    let frame = 0;

    // Posisi kontinu di linimasa: 2.5 berarti tepat di antara tonggak 2 dan 3.
    const update = () => {
      frame = 0;
      const line = window.innerHeight * TRIGGER;
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
      // Miring ke satu arah, nol tepat di setiap tonggak.
      sway.set(reduceMotion ? 0 : Math.abs(Math.sin(Math.PI * pos)));
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
  }, [sway, reduceMotion]);

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
            <div className="relative size-24 shrink-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-2 [--evo-depth:0.7px] [perspective:900px] sm:size-28 lg:aspect-square lg:size-auto lg:rounded-[var(--radius-lg)] lg:p-10 lg:[--evo-depth:2.8px] lg:[perspective:1000px]">
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
              <motion.div
                className="relative h-full w-full [transform-style:preserve-3d]"
                style={{ rotateY, rotateX }}
              >
                <Extrusion stage={Math.min(stage, LAST_EMBLEM_STAGE)} />
                <div className="relative h-full w-full [transform:translateZ(0)]">
                  <Emblem stage={Math.min(stage, LAST_EMBLEM_STAGE)} />
                </div>
              </motion.div>
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
              style={{ scaleY: railScale }}
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
                      className={`pb-2 font-mono text-xs font-bold tracking-[0.14em] text-[var(--meta)] uppercase ${i === 0 ? '' : 'pt-10'}`}
                    >
                      {ERA_LABEL[m.era]}
                    </p>
                  )}

                  <div className="relative py-[min(10vh,80px)] lg:py-[min(14vh,120px)]">
                    <span
                      aria-hidden="true"
                      className={`absolute top-[min(10vh,80px)] -left-8 mt-1.5 size-3 rounded-full ring-4 ring-[var(--bg)] transition-colors duration-300 lg:top-[min(14vh,120px)] ${
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
                      <p className="mt-2 max-w-[52ch] text-base leading-relaxed text-[var(--fg-2)]">
                        {m.body}
                      </p>
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
