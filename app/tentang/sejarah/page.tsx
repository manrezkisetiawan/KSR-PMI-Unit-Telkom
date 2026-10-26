import { getTentangPage } from '@/lib/content';
import { MdxRenderer } from '@/lib/mdx';
import { PageHero } from '@/components/layout/PageHero';
import { ChapterNav } from '@/components/layout/ChapterNav';
import { EmblemEvolution } from '@/components/sections/EmblemEvolution';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sejarah KSR PMI Unit Universitas Telkom',
  description:
    'Jejak gerakan kemanusiaan dari Pertempuran Solferino 1859 hingga berdirinya KSR PMI Unit Universitas Telkom, disertai rujukan sumber resmi.',
};

/** Ambil bagian "Catatan sumber" dari artikel agar rujukan tetap satu sumber. */
function getSources(body: string) {
  const start = body.indexOf('## Catatan sumber');
  if (start === -1) return null;
  return body.slice(start).replace('## Catatan sumber', '').trim();
}

export default function SejarahPage() {
  const { frontmatter, body } = getTentangPage('sejarah');
  const sources = getSources(body);

  return (
    <div className="flex w-full flex-col">
      <PageHero variant="feature" title={frontmatter.title} lead={frontmatter.ringkas} />

      <EmblemEvolution />

      {sources && (
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
              <MdxRenderer source={sources} />
            </div>
          </div>
        </section>
      )}

      <ChapterNav current="/tentang/sejarah" />
    </div>
  );
}
