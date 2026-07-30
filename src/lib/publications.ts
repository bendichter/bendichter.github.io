import orcid from "../data/publications.json";
import extra from "../data/publications-extra.json";

export type Publication = {
  title: string;
  journal: string | null;
  type: string | null;
  year: number | null;
  url: string | null;
  doi: string | null;
  aliases?: string[];
  _comment?: string;
};

/** Same paper, different capitalization and punctuation across sources. */
const key = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/**
 * ORCID is the source of truth; publications-extra.json fills the gaps in it.
 * A supplement entry wins over an ORCID one with the same title, and its
 * `aliases` also absorb the ORCID record, which is how the published eNeuro
 * paper swallows the preprint ORCID lists under a different title.
 */
export function getPublications(): Publication[] {
  const merged = new Map<string, Publication>();

  for (const pub of orcid as Publication[]) merged.set(key(pub.title), pub);

  for (const pub of extra as Publication[]) {
    for (const alias of pub.aliases ?? []) merged.delete(key(alias));
    merged.set(key(pub.title), pub);
  }

  return [...merged.values()].sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title),
  );
}

export function byYear(pubs: Publication[]): [number, Publication[]][] {
  const years = new Map<number, Publication[]>();
  for (const pub of pubs) {
    const y = pub.year ?? 0;
    years.set(y, [...(years.get(y) ?? []), pub]);
  }
  return [...years.entries()].sort((a, b) => b[0] - a[0]);
}

/** Surfaced in the build log so the supplement is visibly temporary. */
export const supplementCount = (extra as Publication[]).length;
