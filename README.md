# bendichter.com

Personal site, built with [Astro](https://astro.build). This is a prototype
replacement for the AcademicPages Jekyll fork the site ran on previously.

## Running it

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # writes ./dist
npm run preview    # serve ./dist
```

Deployment is a GitHub Actions workflow (`.github/workflows/deploy.yml`) that
runs `npm ci && npm run build` and publishes `dist` to GitHub Pages.

## Where things live

| Path | What it is |
| --- | --- |
| `src/content/posts/` | Blog posts, markdown with front matter |
| `src/content/talks/` | Talks, markdown with front matter |
| `src/content.config.ts` | Front matter schemas, enforced at build time |
| `src/lib/content.ts` | Cross-file content checks (dates, duplicate URLs) |
| `src/data/site.ts` | Name, nav, social links, the software list |
| `src/data/publications.json` | Generated from ORCID, do not edit by hand |
| `src/data/publications-extra.json` | Papers missing from ORCID, edited by hand |
| `src/assets/` | Images referenced by posts, optimized at build |
| `public/` | Files served as-is: favicons, CV, `.well-known` |

## Adding a post

Drop a markdown file in `src/content/posts/` named `YYYY-MM-DD-slug.md`:

```yaml
---
title: "Post title"
date: 2026-07-30
permalink: /posts/2026-07-30-slug
tags:
  - python
---
```

`title`, `date`, and `permalink` are required and the build fails without them.
Reference images with a relative path (`../../assets/thing.png`) so Astro
optimizes them; a path that points at a file which does not exist is a build
error rather than a broken image on the live site.

## Updating publications

```sh
npm run publications
```

This rewrites `src/data/publications.json` from the public ORCID API, dropping
the per-release software DOIs and collapsing preprints into their published
versions. Commit the result, so builds stay offline and reproducible.

ORCID is currently missing some papers, so `publications-extra.json` holds those
by hand. Every entry in that file is a gap in the ORCID record. Adding the work
to ORCID and deleting the entry here is the better fix, because ORCID feeds
everywhere else too, not just this site.

## Why the build is strict

The schemas and checks exist because the previous site shipped all of these to
production and nobody noticed for years:

- A talk dated 2012 in its front matter and 2020 in its filename, which sorted
  it below a 2018 talk and made the talks page look abandoned.
- A post permalink reading `stacked-stop-plot` instead of `stacked-step-plot`.
- A publication link that was two URLs concatenated by a bad markdown
  conversion and resolved to nothing.
- The same paper listed twice, as a preprint and as the published version.
- Thirteen favicon files referenced by the page head but never generated.

Making each of these a build failure is cheaper than finding them later.
