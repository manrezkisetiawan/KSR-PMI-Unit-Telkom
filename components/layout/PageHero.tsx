import React from 'react';
import { EcgDivider } from '@/components/motion/EcgDivider';
import { AmbulancePass } from '@/components/motion/AmbulancePass';
import { FadeIn } from '@/components/motion/FadeIn';

interface PageHeroProps {
  /** Label kecil di atas judul; dihilangkan bila kosong. */
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Baris aksi (tombol) di bawah lead. */
  actions?: React.ReactNode;
  /** Tampilkan ambulans melintas di tepi bawah hero. */
  ambulance?: boolean;
  /** Tampilkan garis EKG di tepi bawah hero. */
  ecg?: boolean;
  /** `feature`: judul besar rata tengah untuk halaman unggulan. */
  variant?: 'default' | 'feature';
}

/**
 * Hero full-bleed untuk seluruh halaman selain beranda.
 * Lebar penuh layar (bukan kolom tengah) agar konsisten dengan beranda.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  actions,
  ambulance = false,
  ecg = true,
  variant = 'default',
}: PageHeroProps) {
  const feature = variant === 'feature';

  return (
    <section className="siren-sweep relative isolate w-full overflow-hidden border-b border-[var(--border)] bg-[var(--surface-warm)]/60">
      {/* Palang kemanusiaan melayang */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="cross-drift-slow absolute -top-6 right-[6%] opacity-[0.06]">
          <div className="relative h-40 w-40">
            <span className="absolute top-1/2 left-0 h-10 w-40 -translate-y-1/2 bg-[var(--accent)]" />
            <span className="absolute top-0 left-1/2 h-40 w-10 -translate-x-1/2 bg-[var(--accent)]" />
          </div>
        </div>
        <div className="cross-drift absolute right-[26%] bottom-6 hidden opacity-[0.05] lg:block">
          <div className="relative h-24 w-24">
            <span className="absolute top-1/2 left-0 h-6 w-24 -translate-y-1/2 bg-[var(--accent)]" />
            <span className="absolute top-0 left-1/2 h-24 w-6 -translate-x-1/2 bg-[var(--accent)]" />
          </div>
        </div>
      </div>

      <div
        className={`relative z-10 w-full px-[clamp(20px,2.8vw,56px)] ${
          feature ? 'pt-14 pb-10 lg:pt-20 lg:pb-14' : 'pt-9 pb-7 lg:pt-12 lg:pb-9'
        }`}
      >
        <FadeIn className={`w-full ${feature ? 'flex flex-col items-center text-center' : ''}`}>
          {eyebrow && (
            <span className="mb-4 inline-flex items-center gap-2 font-mono text-sm font-bold tracking-[0.16em] text-[var(--accent)] uppercase">
              <span className="animate-heartbeat size-1.5 rounded-full bg-[var(--accent)]" />
              {eyebrow}
            </span>
          )}
          <h1
            className={`font-extrabold text-[var(--fg)] ${
              feature
                ? 'max-w-[18ch] text-[clamp(2.25rem,4.6vw,4.75rem)] leading-[1.05] tracking-[-0.03em] text-balance'
                : 'text-[clamp(1.75rem,2.4vw,2.75rem)] leading-[1.14] tracking-[-0.02em]'
            }`}
          >
            {title}
          </h1>
          {lead && (
            <p
              className={`leading-relaxed text-[var(--fg-2)] ${
                feature ? 'mt-6 max-w-[64ch] text-lg text-pretty' : 'mt-4 max-w-[62ch] text-base'
              }`}
            >
              {lead}
            </p>
          )}
          {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
        </FadeIn>
      </div>

      {ambulance && <AmbulancePass />}
      {ecg && <EcgDivider className="relative z-10" />}
    </section>
  );
}
