/**
 * Rebuilds src/data/publication-authors.json: the author list for every paper
 * on the publications page, keyed by DOI.
 *
 * ORCID's works summary carries no contributors, so the page could say what a
 * paper was and where it appeared but not who wrote it or where I sit in the
 * list, which is the first thing a reader checking a record looks for. The
 * DOI resolver speaks CSL JSON for Crossref and DataCite DOIs alike, so one
 * request per paper covers journals, bioRxiv, arXiv, OSF, and IEEE.
 *
 * Runs as part of `npm run publications`, or alone:
 *   npm run authors
 *
 * Like publications.json, the output is committed so builds stay offline.
 * A paper with no DOI can carry an `authors` array by hand in
 * publications-extra.json instead.
 */

import { readFile, writeFile } from "node:fs/promises";
import { doiFor } from "../src/lib/doi.mjs";

const ORCID_OUT = new URL("../src/data/publications.json", import.meta.url);
const EXTRA = new URL("../src/data/publications-extra.json", import.meta.url);
const OUT = new URL("../src/data/publication-authors.json", import.meta.url);

/** "Benjamin K." -> "BK", "Jean-Paul" -> "JP". */
const initials = (given) =>
  given
    .split(/[\s.-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join("");

/** Vancouver style, "Dichter BK", which keeps a long list scannable. */
function formatAuthor(a) {
  if (a.literal) return a.literal;
  if (a.name) return a.name;
  if (!a.family) return null;
  return a.given ? `${a.family} ${initials(a.given)}` : a.family;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function authorsFor(doi) {
  let res;
  // Crossref rate-limits bursts with a 429; back off rather than drop a paper.
  for (let attempt = 0; attempt < 4; attempt++) {
    res = await fetch(`https://doi.org/${doi}`, {
      headers: { Accept: "application/vnd.citationstyles.csl+json" },
      redirect: "follow",
    });
    if (res.status !== 429) break;
    await sleep(2000 * 2 ** attempt);
  }
  if (!res.ok) throw new Error(`${res.status}`);
  const csl = await res.json();
  return (csl.author ?? []).map(formatAuthor).filter(Boolean);
}

const main = async () => {
  const pubs = [
    ...JSON.parse(await readFile(ORCID_OUT, "utf8")),
    ...JSON.parse(await readFile(EXTRA, "utf8")),
  ];

  const out = {};
  const problems = [];
  for (const pub of pubs) {
    if (pub.authors) continue; // written by hand in the supplement
    const doi = doiFor(pub);
    if (!doi) {
      problems.push(`no DOI, add authors by hand: ${pub.title}`);
      continue;
    }
    try {
      const authors = await authorsFor(doi);
      if (!authors.length) problems.push(`no authors in metadata for ${doi}`);
      else out[doi] = authors;
      if (authors.length && !authors.some((a) => a.startsWith("Dichter "))) {
        problems.push(`not listed as an author on ${doi}: ${pub.title}`);
      }
    } catch (err) {
      problems.push(`${doi} returned ${err.message}`);
    }
  }

  const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(OUT, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`wrote authors for ${Object.keys(out).length} of ${pubs.length} publications`);
  for (const p of problems) console.warn(`  ${p}`);
};

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
