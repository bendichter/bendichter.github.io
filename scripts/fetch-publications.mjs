/**
 * Rebuilds src/data/publications.json from the public ORCID API.
 *
 * The Jekyll site kept its publication list as ~200 lines of hand-written HTML
 * inside a markdown file. That is the page most likely to go stale, and it did:
 * it was missing every 2025 paper, carried the same preprint twice under two
 * titles, had a "boiRxiv" typo, and had one link that was two URLs concatenated
 * by a bad markdown conversion and resolved to nothing.
 *
 * Run this when something new lands in ORCID:
 *   npm run publications
 *
 * The output is committed, so builds stay offline and reproducible and a
 * flaky ORCID API can never break a deploy.
 */

import { writeFile } from "node:fs/promises";

const ORCID = process.env.ORCID_ID ?? "0000-0001-5725-6910";
const API = `https://pub.orcid.org/v3.0/${ORCID}`;
const OUT = new URL("../src/data/publications.json", import.meta.url);

const headers = { Accept: "application/json" };

async function get(path) {
  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) throw new Error(`ORCID ${path} returned ${res.status}`);
  return res.json();
}

/** ORCID groups the same work reported by several sources; take one summary. */
function pickSummary(group) {
  const summaries = group["work-summary"] ?? [];
  // Prefer the record with a DOI, then the most recently updated.
  const withDoi = summaries.find((s) =>
    (s["external-ids"]?.["external-id"] ?? []).some((x) => x["external-id-type"] === "doi"),
  );
  return withDoi ?? summaries[0];
}

function externalIds(summary) {
  const ids = summary["external-ids"]?.["external-id"] ?? [];
  const of = (type) => ids.find((x) => x["external-id-type"] === type)?.["external-id-value"];
  return { doi: of("doi"), pmid: of("pmid"), arxiv: of("arxiv") };
}

function urlFor({ doi, pmid, arxiv }, summary) {
  if (doi) return `https://doi.org/${doi}`;
  if (arxiv) return `https://arxiv.org/abs/${arxiv}`;
  if (pmid) return `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  return summary.url?.value ?? null;
}

/**
 * ORCID files a separate DOI for every tagged software release, so NeuroConv
 * alone accounts for 20 "works". Those belong on the software list, not the
 * publication list.
 */
const PUBLICATION_TYPES = new Set([
  "journal-article",
  "preprint",
  "conference-paper",
  "book-chapter",
  "book",
  "report",
]);

/** Same paper, different capitalization and punctuation across sources. */
const titleKey = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Prefer the published version over its preprint, then the richer record. */
function better(a, b) {
  const score = (w) =>
    (w.type === "journal-article" ? 4 : 0) +
    (w.journal && w.journal !== "Zenodo" ? 2 : 0) +
    (w.doi ? 1 : 0);
  if (score(b) !== score(a)) return score(b) > score(a) ? b : a;
  return (b.year ?? 0) > (a.year ?? 0) ? b : a;
}

const main = async () => {
  const { group = [] } = await get("/works");
  console.log(`ORCID reports ${group.length} works`);

  const works = [];
  for (const g of group) {
    const summary = pickSummary(g);
    if (!summary) continue;

    const type = summary.type ?? null;
    if (!PUBLICATION_TYPES.has(type)) continue;

    const year = Number(summary["publication-date"]?.year?.value);
    const ids = externalIds(summary);
    const journal = summary["journal-title"]?.value?.trim() ?? null;
    works.push({
      title: summary.title?.title?.value?.trim(),
      journal: journal === "Zenodo" ? null : journal,
      type,
      year: Number.isFinite(year) ? year : null,
      url: urlFor(ids, summary),
      doi: ids.doi ?? null,
    });
  }

  // Collapsing by title is what retires the duplicate-preprint bug: the NWB
  // ecosystem paper was listed twice, as a 2021 bioRxiv preprint and its 2022
  // eLife version, and the same arXiv preprint appeared under two titles.
  const byTitle = new Map();
  for (const w of works) {
    if (!w.title) continue;
    const key = titleKey(w.title);
    const existing = byTitle.get(key);
    byTitle.set(key, existing ? better(existing, w) : w);
  }

  const deduped = [...byTitle.values()].sort(
    (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title),
  );

  console.log(
    `kept ${deduped.length} publications ` +
      `(${group.length - works.length} software/other dropped, ` +
      `${works.length - deduped.length} duplicates merged)`,
  );
  await writeFile(OUT, JSON.stringify(deduped, null, 2) + "\n");
};

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
