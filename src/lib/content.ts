import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Checks that a per-entry schema cannot express, because they compare an entry
 * against its own filename or against every other entry in the collection.
 * These throw, which fails the build, which is the entire point: the Jekyll
 * site carried all three of these defects in production for years because
 * nothing ever looked.
 */

const FILENAME_DATE = /^(\d{4})-(\d{2})-(\d{2})-/;

type Dated = CollectionEntry<"posts" | "talks">;

function assertDatesMatchFilenames(name: string, entries: Dated[]) {
  const bad = entries.flatMap((entry) => {
    const match = entry.id.match(FILENAME_DATE);
    if (!match) return [];
    const [, y, m, d] = match;
    const fromName = `${y}-${m}-${d}`;
    const fromMatter = entry.data.date.toISOString().slice(0, 10);
    if (fromName === fromMatter) return [];

    // A different year is an error: it throws the entry into the wrong section
    // of the archive, which is how a 2020 talk ended up below a 2018 one. A
    // different day within the same year is only worth a warning, since drafts
    // legitimately get renamed or published later than they were started.
    if (fromName.slice(0, 4) !== fromMatter.slice(0, 4)) {
      return [`  ${entry.id}: front matter says ${fromMatter}, filename says ${fromName}`];
    }
    console.warn(
      `[content] ${name}/${entry.id}: front matter date ${fromMatter} does not ` +
        `match the filename date ${fromName}. Same year, so only a warning.`,
    );
    return [];
  });

  if (bad.length) {
    throw new Error(
      `${name}: front matter date disagrees with the filename.\n${bad.join("\n")}\n` +
        `A wrong-but-valid date is invisible until the entry sorts into the wrong ` +
        `place. The NWBWidgets talk was dated 2012 instead of 2020 and sat below a ` +
        `2018 talk, making the talks page look abandoned.`,
    );
  }
}

function assertPermalinksUnique(name: string, entries: Dated[]) {
  const seen = new Map<string, string>();
  const clashes: string[] = [];
  for (const entry of entries) {
    const existing = seen.get(entry.data.permalink);
    if (existing) clashes.push(`  ${entry.data.permalink} <- ${existing}, ${entry.id}`);
    else seen.set(entry.data.permalink, entry.id);
  }
  if (clashes.length) {
    throw new Error(
      `${name}: two entries claim the same URL, so one would overwrite the ` +
        `other.\n${clashes.join("\n")}`,
    );
  }
}

/** Astro calls the loaders once per page; validate (and warn) only the first time. */
const validated = new Set<string>();

function validate(name: string, entries: Dated[]) {
  if (validated.has(name)) return entries;
  assertDatesMatchFilenames(name, entries);
  assertPermalinksUnique(name, entries);
  validated.add(name);
  return entries;
}

const byNewest = (a: Dated, b: Dated) => b.data.date.valueOf() - a.data.date.valueOf();

export async function getPosts() {
  const entries = await getCollection("posts", ({ data }) => !data.draft);
  return validate("posts", entries).sort(byNewest) as CollectionEntry<"posts">[];
}

export async function getTalks() {
  const entries = await getCollection("talks");
  return validate("talks", entries).sort(byNewest) as CollectionEntry<"talks">[];
}

/** Groups entries by year, newest first, for the archive listings. */
export function groupByYear<T extends Dated>(entries: T[]): [number, T[]][] {
  const years = new Map<number, T[]>();
  for (const entry of entries) {
    const year = entry.data.date.getUTCFullYear();
    years.set(year, [...(years.get(year) ?? []), entry]);
  }
  return [...years.entries()].sort((a, b) => b[0] - a[0]);
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
