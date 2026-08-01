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

/**
 * A flat list of forty-odd papers gives a reader no way to tell the Cell paper
 * from a conference abstract, so a handful are pulled to the top by hand.
 * Matched on the normalized title, and a title that no longer matches anything
 * fails the build rather than silently dropping out of the list.
 */
const SELECTED = [
  "The Control of Vocal Pitch in Human Laryngeal Motor Cortex",
  "The Neurodata Without Borders ecosystem for neurophysiological data science",
  "Facilitating analysis of open neurophysiology data on the DANDI Archive using large language model tools",
  "Neurosift: DANDI exploration and NWB visualization in the browser",
  "Dynamic Structure of Neural Variability in the Cortical Representation of Speech Sounds",
  "Learning to Estimate Dynamical State with Probabilistic Population Codes",
];

export function getSelected(pubs: Publication[]): Publication[] {
  const byKey = new Map(pubs.map((pub) => [key(pub.title), pub]));
  const missing = SELECTED.filter((title) => !byKey.has(key(title)));
  if (missing.length) {
    throw new Error(
      `publications: a selected paper is no longer in the list, so it would ` +
        `silently disappear from the top of the page.\n` +
        missing.map((title) => `  ${title}`).join("\n") +
        `\nFix the title in SELECTED, or drop it if the paper is gone.`,
    );
  }
  // Newest first, like every other list on the site. Left in the hand-written
  // order the six read as a shuffled chronology rather than a chosen set.
  return SELECTED.map((title) => byKey.get(key(title))!).sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0),
  );
}

/** ORCID's work types are slugs; "conference-paper" should not reach a reader. */
export function describe(pub: Publication): string {
  if (pub.journal) return pub.journal;
  if (!pub.type) return "Publication";
  const words = pub.type.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
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
