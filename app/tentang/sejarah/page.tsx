import { getTentangPage } from '@/lib/content';
import { TentangShell } from '@/components/layout/TentangShell';
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
    <TentangShell
      slug="sejarah"
      heroVariant="feature"
      title={frontmatter.title}
      lead={frontmatter.ringkas}
      body={body}
      before={<EmblemEvolution />}
    />
  );
}
