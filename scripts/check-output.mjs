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

/**
 * Every content image should carry alt, even when it is deliberately empty
 * because the image is decorative and its link already has a text label.
 *
 * The attribute has to be matched in both forms: the minifier rewrites the
 * empty `alt=""` that Astro emits into a bare `alt`, which is valid HTML and
 * which assistive technology reads as empty alt, so requiring `alt=` here
 * reports every decorative image as a fault.
 */
function imagesWithoutAlt(html) {
  return [...html.matchAll(/<img\b(?![^>]*\salt(?=[\s=>/]))[^>]*>/g)].map((m) =>
    m[0].slice(0, 90),
  );
}

/**
 * Every local file the HTML points at has to exist in dist.
 *
 * This is the check that would have caught the Jekyll site declaring eighteen
 * favicon and touch-icon files it never generated, and the prototype's own
 * apple-touch-icon reference surviving a branch that predated the icons.
 * A broken asset reference is invisible in the page source and silent in the
 * browser, so nothing short of looking at the output finds it.
 */
async function missingLocalAssets(html, file, exists) {
  const refs = [...html.matchAll(/(?:href|src)="(\/[^"#?]*)["#?]/g)].map((m) => m[1]);
  const bad = [];
  for (const ref of new Set(refs)) {
    if (ref.startsWith("//")) continue;
    const target = decodeURIComponent(ref.replace(/\/$/, "")) || "/index.html";
    if (
      !(await exists(target)) &&
      !(await exists(`${target}/index.html`)) &&
      !(await exists(`${target}.html`))
    ) {
      bad.push(ref);
    }
  }
  return bad;
}

const CHECKS = [
  ["text runs into a link with no space", missingSpacesAroundInlineTags],
  ["title tag", titleProblems],
  ["img without alt", imagesWithoutAlt],
];

let failures = 0;
let pages = 0;

const { stat } = await import("node:fs/promises");
const seen = new Map();
const exists = async (p) => {
  const key = p.replace(/^\//, "");
  if (!seen.has(key)) {
    seen.set(
      key,
      stat(new URL(key, DIST))
        .then(() => true)
        .catch(() => false),
    );
  }
  return seen.get(key);
};

for await (const file of glob("**/*.html", { cwd: DIST })) {
  const html = await readFile(new URL(file, DIST), "utf8");
  pages++;
  for (const [label, check] of CHECKS) {
    for (const hit of check(html)) {
      console.error(`  ${file}: ${label}\n    ${hit}`);
      failures++;
    }
  }
  for (const ref of await missingLocalAssets(html, file, exists)) {
    console.error(`  ${file}: references a file that does not exist\n    ${ref}`);
    failures++;
  }
}

if (failures) {
  console.error(`\ncheck-output: ${failures} problem(s) across ${pages} pages`);
  process.exit(1);
}

console.log(`check-output: ${pages} pages clean`);
