import { getTentangPage } from '@/lib/content';
import { MdxRenderer } from '@/lib/mdx';
import { getSources, splitSections } from '@/lib/mdx-sections';
import { PageHero } from '@/components/layout/PageHero';
import { ChapterNav } from '@/components/layout/ChapterNav';
import { SourceNotes } from '@/components/layout/SourceNotes';
import { FadeIn } from '@/components/motion/FadeIn';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tujuh Prinsip Dasar Gerakan',
  description:
    'Kemanusiaan, kesamaan, kenetralan, kemandirian, kesukarelaan, kesatuan, dan kesemestaan menurut ICRC dan PMI.',
};

/** Bagian artikel yang bukan salah satu dari tujuh prinsip. */
const CLOSING = 'Mengapa prinsip ini penting';
const SOURCES = 'Catatan sumber';

export default function PrinsipPage() {
  const { frontmatter, body } = getTentangPage('prinsip');
  const { intro, sections } = splitSections(body);
  const principles = sections.filter((s) => s.title !== CLOSING && s.title !== SOURCES);
  const closing = sections.find((s) => s.title === CLOSING);
  const total = String(principles.length).padStart(2, '0');

  return (
    <div className="flex w-full flex-col">
      <PageHero variant="feature" title={frontmatter.title} lead={frontmatter.ringkas} />

      {intro && (
        <section className="w-full bg-[var(--bg)] px-[clamp(20px,2.8vw,56px)] pt-16 lg:pt-24">
          <FadeIn className="mx-auto max-w-[62ch] text-center text-lg leading-relaxed text-[var(--fg-2)] lg:text-xl">
            <MdxRenderer source={intro} />
          </FadeIn>
        </section>
      )}

      <section
        aria-label="Tujuh prinsip"
        className="w-full bg-[var(--bg)] px-[clamp(20px,2.8vw,56px)] py-16 lg:py-24"
      >
        <ol className="mx-auto w-full max-w-[1200px]">
          {principles.map((p, i) => (
            <li key={p.title} className="border-t border-[var(--border)] last:border-b">
              <FadeIn className="grid grid-cols-1 gap-4 py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:py-14">
                <div>
                  <p className="font-mono text-sm font-bold tracking-[0.16em] text-[var(--accent)]">
                    {String(i + 1).padStart(2, '0')} / {total}
                  </p>
                  <h2 className="mt-2 text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-[var(--fg)]">
                    {p.title}
                  </h2>
                </div>
                <div className="text-lg leading-relaxed text-[var(--fg-2)] lg:pt-9">
                  <MdxRenderer source={p.body} />
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </section>

      {closing && (
        <section className="w-full border-y border-[var(--border)] bg-[var(--surface-warm)]/60 px-[clamp(20px,2.8vw,56px)] py-16 lg:py-20">
          <FadeIn className="mx-auto flex max-w-[64ch] flex-col items-center text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--fg)] sm:text-3xl">
              {closing.title}
            </h2>
            <div className="mt-4 text-lg leading-relaxed text-[var(--fg-2)]">
              <MdxRenderer source={closing.body} />
            </div>
          </FadeIn>
        </section>
      )}

      <SourceNotes source={getSources(body)} />
      <ChapterNav current="/tentang/prinsip" />
    </div>
  );
}
