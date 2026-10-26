import React from 'react';
import Link from 'next/link';
import { TENTANG_LINKS } from '@/components/layout/TentangShell';

/**
 * Navigasi bab di akhir halaman Tentang: pembaca diteruskan ke halaman
 * berikutnya (Sejarah → 7 Prinsip Dasar → …) seperti membaca buku.
 */
export function ChapterNav({ current }: { current: string }) {
  const index = TENTANG_LINKS.findIndex((link) => link.href === current);
  const prev = index > 0 ? TENTANG_LINKS[index - 1] : undefined;
  const next = index >= 0 ? TENTANG_LINKS[index + 1] : undefined;

  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Bab berikutnya"
      className="w-full border-t border-[var(--border)] bg-[var(--surface-warm)]/50 px-[clamp(20px,2.8vw,56px)] py-12 lg:py-16"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        {prev ? (
          <Link
            href={prev.href}
            className="group inline-flex flex-col gap-1 text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
          >
            <span className="font-mono text-xs font-bold tracking-[0.16em] uppercase">
              ← Sebelumnya
            </span>
            <span className="text-lg font-semibold">{prev.label}</span>
          </Link>
        ) : (
          <span />
        )}

        {next && (
          <Link
            href={next.href}
            className="group inline-flex flex-col gap-2 lg:items-end lg:text-right"
          >
            <span className="font-mono text-xs font-bold tracking-[0.16em] text-[var(--accent)] uppercase">
              Selanjutnya
            </span>
            <span className="inline-flex items-center gap-4 text-[clamp(2rem,4vw,3.75rem)] leading-none font-extrabold tracking-[-0.03em] text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
              {next.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-2"
              >
                →
              </span>
            </span>
          </Link>
        )}
      </div>
    </nav>
  );
}
