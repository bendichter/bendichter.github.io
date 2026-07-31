/**
 * Downloads the YouTube thumbnail for every talk that has a `youtube` id, into
 * src/assets/talks/<id>.jpg, and verifies the id resolves to a real video.
 *
 * The images are committed rather than hotlinked, so the talks page keeps
 * working if a video is later made private, Astro can resize and convert them
 * to WebP, and no request leaves for youtube.com until a reader clicks through.
 *
 *   npm run thumbnails
 */

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";

const TALKS = new URL("../src/content/talks/", import.meta.url);
const OUT = new URL("../src/assets/talks/", import.meta.url);

async function videoIds() {
  const files = await readdir(TALKS);
  const ids = [];
  for (const file of files.filter((f) => f.endsWith(".md"))) {
    const text = await readFile(new URL(file, TALKS), "utf8");
    const match = text.match(/^youtube:\s*(\S+)\s*$/m);
    if (match) ids.push({ id: match[1], file });
  }
  return ids;
}

/** oEmbed doubles as an existence check: a dead id returns a non-200. */
async function verify(id) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${id}`,
  )}&format=json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const { title, author_name } = await res.json();
  return { title, author_name };
}

/** maxres is not generated for every upload; fall back to hq. */
async function thumbnail(id) {
  for (const name of ["maxresdefault", "hqdefault"]) {
    const res = await fetch(`https://img.youtube.com/vi/${id}/${name}.jpg`);
    if (res.ok) return Buffer.from(await res.arrayBuffer());
  }
  return null;
}

const main = async () => {
  await mkdir(OUT, { recursive: true });
  const ids = await videoIds();
  console.log(`${ids.length} talks with a youtube id`);

  let failed = 0;
  for (const { id, file } of ids) {
    const meta = await verify(id);
    if (!meta) {
      console.error(`  ${file}: video ${id} does not resolve`);
      failed++;
      continue;
    }
    const image = await thumbnail(id);
    if (!image) {
      console.error(`  ${file}: no thumbnail for ${id}`);
      failed++;
      continue;
    }
    await writeFile(new URL(`${id}.jpg`, OUT), image);
    console.log(`  ${id}  [${meta.author_name}] ${meta.title.slice(0, 62)}`);
  }

  if (failed) {
    console.error(`\n${failed} talk(s) could not be resolved`);
    process.exit(1);
  }
};

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
