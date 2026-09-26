/**
 * Re-roots a finished build in dist/ under a subpath, for PR previews:
 *
 *   node scripts/rebase-preview.mjs /pr-preview/pr-23/
 *
 * Previews are served from bendichter.com/pr-preview/pr-N/, but every page
 * links to "/posts/", "/_astro/…", and so on, which on a preview would lead
 * straight back to the live site. Astro's `base` option only covers the URLs
 * Astro generates, not the hand-written ones in templates and markdown, so
 * instead of threading a base through every link, the preview workflow builds
 * exactly what production builds and then rewrites the root-relative URLs in
 * the output. The preview is the production build, moved.
 *
 * Absolute URLs (canonical, og:image, JSON-LD) are left alone, so a preview
 * still names the live page as canonical.
 *
 * After rewriting, any root-relative URL that still points outside the preview
 * fails the script: a link form this does not know about is a preview that
 * silently sends reviewers to the live site, which is the one thing it must
 * not do.
 */

import { readFile, writeFile, glob } from "node:fs/promises";

const arg = process.argv[2];
if (!arg || !arg.startsWith("/")) {
  console.error("usage: node scripts/rebase-preview.mjs /pr-preview/pr-N/");
  process.exit(1);
}
const base = arg.endsWith("/") ? arg : `${arg}/`;
const DIST = new URL("../dist/", import.meta.url);

/** "/x" becomes "<base>x"; "//host/x" is protocol-relative and left alone. */
const rebase = (url) => (url.startsWith("/") && !url.startsWith("//") ? base + url.slice(1) : url);

function rewriteHtml(html) {
  return (
    html
      // href, src, and friends: a single URL per attribute.
      .replace(/\b(href|src|poster|action)="([^"]*)"/g, (_, attr, url) => `${attr}="${rebase(url)}"`)
      // srcset: a comma-separated list of "url descriptor" candidates.
      .replace(/\bsrcset="([^"]*)"/g, (_, list) => {
        const candidates = list.split(",").map((c) => {
          const [url, ...rest] = c.trim().split(/\s+/);
          return [rebase(url), ...rest].join(" ");
        });
        return `srcset="${candidates.join(", ")}"`;
      })
      // The legacy-URL redirect pages: <meta http-equiv="refresh" content="0;url=/posts">.
      .replace(/(content="\d+;\s*url=)([^"]*)"/gi, (_, head, url) => `${head}${rebase(url)}"`)
  );
}

/** The manifest's start_url, scope, and icon paths. */
const rewriteManifest = (text) => text.replace(/"(\/[^"/][^"]*|\/)"/g, (_, url) => `"${rebase(url)}"`);

/** Anything root-relative left over is a link that escapes the preview. */
function escapes(text) {
  const refs = [
    ...text.matchAll(/\b(?:href|src|poster|action)="(\/[^"]*)"/g),
    ...text.matchAll(/\bsrcset="([^"]*)"/g),
    ...text.matchAll(/content="\d+;\s*url=(\/[^"]*)"/gi),
  ].flatMap((m) => m[1].split(",").map((c) => c.trim().split(/\s+/)[0]));
  return refs.filter((url) => url.startsWith("/") && !url.startsWith("//") && !url.startsWith(base));
}

let files = 0;
const leaks = [];

for await (const file of glob("**/*.{html,webmanifest}", { cwd: DIST })) {
  const path = new URL(file, DIST);
  const before = await readFile(path, "utf8");
  const after = file.endsWith(".html") ? rewriteHtml(before) : rewriteManifest(before);
  if (after !== before) await writeFile(path, after);
  files++;
  for (const url of new Set(escapes(after))) leaks.push(`  ${file}: ${url}`);
}

if (leaks.length) {
  console.error(`rebase-preview: links that would leave the preview for the live site:\n${leaks.join("\n")}`);
  process.exit(1);
}

console.log(`rebase-preview: ${files} files re-rooted under ${base}`);
