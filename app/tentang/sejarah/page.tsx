import { getTentangPage } from '@/lib/content';
import { getSources } from '@/lib/mdx-sections';
import { PageHero } from '@/components/layout/PageHero';
import { ChapterNav } from '@/components/layout/ChapterNav';
import { SourceNotes } from '@/components/layout/SourceNotes';
import { EmblemEvolution } from '@/components/sections/EmblemEvolution';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sejarah KSR PMI Unit Universitas Telkom',
  description:
    'Jejak gerakan kemanusiaan dari Pertempuran Solferino 1859 hingga berdirinya KSR PMI Unit Universitas Telkom, disertai rujukan sumber resmi.',
};

export default function SejarahPage() {
  const { frontmatter, body } = getTentangPage('sejarah');

  return (
    <div className="flex w-full flex-col">
      <PageHero variant="feature" title={frontmatter.title} lead={frontmatter.ringkas} />
      <EmblemEvolution />
      <SourceNotes source={getSources(body)} />
      <ChapterNav current="/tentang/sejarah" />
    </div>
  );
}
