/**
 * Regenerates the favicon and touch-icon set from public/images/profile.jpeg.
 *
 *   npm run icons
 *
 * Run this after changing the profile photo. The Jekyll site declared eighteen
 * icon files in its page head and shipped none of them, so every page load
 * produced thirteen 404s for years. Generating them all from one source, and
 * failing the build on a referenced file that does not exist, is what keeps
 * that from happening again.
 *
 * Uses sharp, which Astro already depends on for image optimization, so there
 * is no ImageMagick or Python to install first.
 */

import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

/** sharp takes a path or a Buffer, not a URL. */
const SRC = fileURLToPath(new URL("../public/images/profile.jpeg", import.meta.url));
const IMAGES = new URL("../public/images/", import.meta.url);
const ICO = new URL("../public/favicon.ico", import.meta.url);

/** Circular, matching the round avatar in the sidebar. */
const FAVICON = [16, 32, 96];
const ANDROID = [36, 48, 72, 96, 144, 192];
/** ICO entries. 48 is what Windows uses for shortcuts, 16 and 32 for tabs. */
const ICO_SIZES = [16, 32, 48];

/**
 * Square, full bleed, no transparency. iOS composites a touch icon onto black
 * wherever it is transparent, and then applies its own rounded-square mask, so
 * a circle cut out here would show up as a circle floating on a black tile.
 */
const APPLE = [57, 60, 72, 76, 114, 120, 144, 152, 180];

/** Centre crop to a square, so a non-square source is not squashed. */
async function square(src) {
  const img = sharp(src);
  const { width, height } = await img.metadata();
  const side = Math.min(width, height);
  return img
    .extract({
      left: Math.round((width - side) / 2),
      top: Math.round((height - side) / 2),
      width: side,
      height: side,
    })
    .toBuffer();
}

/** A circle of the given size, as an SVG, used as an alpha mask. */
const circleMask = (n) =>
  Buffer.from(
    `<svg width="${n}" height="${n}"><circle cx="${n / 2}" cy="${n / 2}" r="${n / 2}" fill="#fff"/></svg>`,
  );

async function circlePng(base, n) {
  return sharp(base)
    .resize(n, n, { fit: "cover" })
    .composite([{ input: circleMask(n), blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Minimal ICO writer. The format allows each entry to be a whole PNG, which
 * every browser in use reads, so this is a 6-byte header, a 16-byte directory
 * entry per size, then the PNGs.
 */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + pngs.length * 16;
  const entries = [];
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width, 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette size
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const main = async () => {
  await mkdir(IMAGES, { recursive: true });
  const base = await square(SRC);

  for (const n of FAVICON) {
    await writeFile(new URL(`favicon-${n}x${n}.png`, IMAGES), await circlePng(base, n));
    console.log(`  favicon-${n}x${n}.png       circle`);
  }

  for (const n of ANDROID) {
    await writeFile(
      new URL(`android-chrome-${n}x${n}.png`, IMAGES),
      await circlePng(base, n),
    );
    console.log(`  android-chrome-${n}x${n}.png circle`);
  }

  for (const n of APPLE) {
    const data = await sharp(base)
      .resize(n, n, { fit: "cover" })
      .flatten({ background: "#ffffff" })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(new URL(`apple-touch-icon-${n}x${n}.png`, IMAGES), data);
    console.log(`  apple-touch-icon-${n}x${n}.png square, opaque`);
  }

  const ico = buildIco(
    await Promise.all(
      ICO_SIZES.map(async (size) => ({ size, data: await circlePng(base, size) })),
    ),
  );
  await writeFile(ICO, ico);
  await writeFile(new URL("favicon.ico", IMAGES), ico);
  console.log(`  favicon.ico                 circle, ${ICO_SIZES.join("/")}`);
};

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
