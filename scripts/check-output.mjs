/**
 * Post-build checks on the generated HTML in dist/.
 *
 * Run by `npm run build`, so a failure here fails the build.
 */

import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const DIST = new URL("../dist/", import.meta.url);

/**
 * Astro collapses the whitespace between a line of text and an inline element
 * that begins the next line, so
 *
 *     Founder of
 *     <a href="...">CatalystNeuro</a>
 *
 * renders as "Founder ofCatalystNeuro". The fix in the source is a trailing
 * {" "}, but the mistake is invisible in the template and easy to reintroduce,
 * so it is cheaper to catch it in the output.
 */
function missingSpacesAroundInlineTags(html) {
  const pattern = /(\w)(<a\b[^>]*>)|(<\/a>)(\w)/g;
  return [...html.matchAll(pattern)].map((m) => {
    const start = Math.max(0, m.index - 50);
    return html
      .slice(start, m.index + m[0].length + 25)
      .replace(/\s+/g, " ")
      .trim();
  });
}

/** An empty or duplicated <title> is a silent SEO regression. */
function titleProblems(html) {
  const titles = [...html.matchAll(/<title>(.*?)<\/title>/gs)].map((m) => m[1].trim());
  if (titles.length === 0) return ["no <title>"];
  if (titles.length > 1) return [`${titles.length} <title> tags`];
  if (!titles[0]) return ["empty <title>"];
  return [];
}

/** Every content image should carry alt text, even if it is empty by choice. */
function imagesWithoutAlt(html) {
  return [...html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/g)].map((m) => m[0].slice(0, 90));
}

const CHECKS = [
  ["text runs into a link with no space", missingSpacesAroundInlineTags],
  ["title tag", titleProblems],
  ["img without alt", imagesWithoutAlt],
];

let failures = 0;
let pages = 0;

for await (const file of glob("**/*.html", { cwd: DIST })) {
  const html = await readFile(new URL(file, DIST), "utf8");
  pages++;
  for (const [label, check] of CHECKS) {
    for (const hit of check(html)) {
      console.error(`  ${file}: ${label}\n    ${hit}`);
      failures++;
    }
  }
}

if (failures) {
  console.error(`\ncheck-output: ${failures} problem(s) across ${pages} pages`);
  process.exit(1);
}

console.log(`check-output: ${pages} pages clean`);
