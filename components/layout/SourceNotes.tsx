import React from 'react';
import { MdxRenderer } from '@/lib/mdx';

/** Daftar rujukan ringkas di akhir halaman Tentang. */
export function SourceNotes({ source }: { source: string | null }) {
  if (!source) return null;

  return (
    <section
      aria-labelledby="sumber-title"
      className="w-full bg-[var(--bg)] px-[clamp(20px,2.8vw,56px)] py-12 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <h2
          id="sumber-title"
          className="font-mono text-xs font-bold tracking-[0.16em] text-[var(--muted)] uppercase"
        >
          Catatan sumber
        </h2>
        <div className="mt-4 max-w-[80ch] text-sm text-[var(--fg-2)]">
          <MdxRenderer source={source} />
        </div>
      </div>
    </section>
  );
}
