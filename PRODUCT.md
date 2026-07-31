# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary visitor is a potential collaborator or client: someone from a neuroscience lab, funder, or organization evaluating Ben (and by extension CatalystNeuro) for consulting, collaboration, or grant work. A successful visit leaves them confident in Ben's track record and gives them a clear path to reach out or continue to catalystneuro.com.

Secondary audiences reached by the same content: academic peers verifying publications and talks, readers arriving at individual blog posts from external links, and people curious about Ben's side projects.

## Product Purpose

bendichter.com is Ben Dichter's personal site: his professional identity, research record (publications, talks), blog, and side projects in one place. Success means a visitor quickly understands who Ben is and what he has done, and can verify it through real artifacts (papers, videos, working software).

## Positioning

This site is Ben the individual, not the company. Company-level marketing lives at catalystneuro.com; this site links out to it rather than duplicating it. The software page deliberately excludes the neuroscience work for the same reason (recorded in `src/data/site.ts`). What this site can claim that no neighboring site can: the first-person record of one person's work across research software, publications, talks, and personal apps.

## Operating Context

- Content types: blog posts and talks as markdown content collections (`src/content/`), publications fetched by script into `src/data/publications.json` (with manual additions in `publications-extra.json`), side projects and drone videos as typed data in `src/data/site.ts`.
- Publications update via `npm run publications`; thumbnails and icons have similar scripts. Social cards are generated per post and per talk at build time (satori + resvg).
- Deployed to GitHub Pages through a GitHub Actions workflow; the `master` branch is the source of truth and pushes go live automatically.

## Capabilities and Constraints

- Astro 7 static site, Node >= 22.12. `npm run dev` for local dev, `npm run build` runs a build plus an output check script.
- Ships no runtime JavaScript on the software page by design (stars and language chips are hand-written rather than fetched, so the build does not depend on the GitHub API).
- Old Jekyll-era URLs are preserved through redirects in `astro.config.mjs` and directory-style URLs; inbound links to old permalinks resolve.
- The user stated there are no strong durable constraints beyond keeping the content itself; the stack is open to change if a future redesign warrants it.

## Brand Commitments

- Name: "Ben Dichter" (site title), "Dr. Benjamin Dichter" (formal name). Domain bendichter.com.
- Avatar `public/images/profile.jpeg`, with a circle-cropped favicon derived from it.
- Voice: measured, plain, first person, honest and non-promotional (see the user's global writing-voice instructions; site copy already follows it).
- Identity anchors: Research Software Engineer, Founder of CatalystNeuro, work on data standards (NWB) and open source tools for neuroscience.

## Evidence on Hand

- Real publications 2014 to 2025 in `src/data/publications.json`, refreshed by script.
- Real talks with YouTube recordings and thumbnails (`src/content/talks/`, `src/assets/talks/`).
- Ten blog posts 2018 to 2026 (`src/content/posts/`), including matplotlib tooling posts and project announcements.
- Working side projects with live URLs: westie.wiki, Invisible String, ReachMyReps, brokenaxes (573 GitHub stars, hand-recorded), and others in `src/data/site.ts`.
- Drone footage YouTube channel, curated list in `src/data/site.ts`.
- Do not fabricate: testimonials, client names, download counts, or metrics beyond what the data files record.

## Product Principles

1. Evidence over claims: every assertion on the site should be backed by a linked artifact (paper, video, repo, live app).
2. Personal scope: company material belongs to catalystneuro.com; this site links, it does not duplicate.
3. Content as data: publications, projects, and talks live in typed data files and content collections so pages never drift from their source.
4. Fast and quiet: static output, minimal or no runtime JavaScript, no third-party trackers required for the site to do its job.
5. Preserve inbound links: old URLs keep resolving through redirects when structure changes.
