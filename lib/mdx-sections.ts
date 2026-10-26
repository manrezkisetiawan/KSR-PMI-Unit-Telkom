/**
 * Pecah isi MDX menjadi pembuka (sebelum `## ` pertama) dan bagian-bagian
 * per judul `## `, agar halaman bisa menata tiap bagian secara khusus.
 */
export interface MdxSection {
  title: string;
  body: string;
}

export function splitSections(body: string): { intro: string; sections: MdxSection[] } {
  const [intro = '', ...rest] = body.split(/^## /m);
  const sections = rest.map((chunk) => {
    const newline = chunk.indexOf('\n');
    return {
      title: (newline === -1 ? chunk : chunk.slice(0, newline)).trim(),
      body: newline === -1 ? '' : chunk.slice(newline + 1).trim(),
    };
  });
  return { intro: intro.trim(), sections };
}

/** Isi bagian "Catatan sumber", atau null bila tidak ada. */
export function getSources(body: string): string | null {
  return splitSections(body).sections.find((s) => s.title === 'Catatan sumber')?.body ?? null;
}
