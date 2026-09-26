/**
 * The DOI a publication's author list is filed under in
 * src/data/publication-authors.json. Shared by scripts/fetch-authors.mjs, which
 * writes that file, and src/lib/publications.ts, which reads it, so the two
 * cannot disagree about the key.
 *
 * arXiv and OSF mint DataCite DOIs for every paper, even ones the listing
 * links by URL, so those resolve too.
 *
 * @param {{ doi?: string | null, url?: string | null }} pub
 * @returns {string | null}
 */
export function doiFor(pub) {
  if (pub.doi) return pub.doi.toLowerCase();
  const arxiv = pub.url?.match(/arxiv\.org\/abs\/([\w.]+)/)?.[1];
  if (arxiv) return `10.48550/arxiv.${arxiv}`.toLowerCase();
  const osf = pub.url?.match(/osf\.io\/(\w+)/)?.[1];
  if (osf) return `10.31219/osf.io/${osf}`.toLowerCase();
  return null;
}
