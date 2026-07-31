/**
 * Regenerates the favicon and touch-icon set from public/images/profile.jpeg.
 *
 *   npm run icons
 *
 * Run this after changing the profile photo. The Jekyll site declared eighteen
 * icon files in its page head and shipped none of them, so every page load
 * produced thirteen 404s for years. Generating them from one source, and
 * checking in the build that every referenced file exists, is what keeps that
 * from happening again.
 *
 * Requires ImageMagick or `sips`; uses whichever is available.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, rm } from "node:fs/promises";

const run = promisify(execFile);

const SRC = new URL("../public/images/profile.jpeg", import.meta.url).pathname;
const OUT = new URL("../public/images/", import.meta.url).pathname;
const ICO = new URL("../public/favicon.ico", import.meta.url).pathname;

const APPLE = [57, 60, 72, 76, 114, 120, 144, 152, 180];
const FAVICON = [16, 32, 96];
const ANDROID = [36, 48, 72, 96, 144, 192];

async function has(cmd) {
  try {
    await run("which", [cmd]);
    return true;
  } catch {
    return false;
  }
}

const main = async () => {
  await mkdir(OUT, { recursive: true });
  const magick = (await has("magick")) ? "magick" : (await has("convert")) ? "convert" : null;

  if (!magick) {
    console.error("ImageMagick not found. Install it with: brew install imagemagick");
    process.exit(1);
  }

  const square = ["-gravity", "center", "-crop", "1:1", "+repage"];

  for (const [prefix, sizes] of [
    ["apple-touch-icon", APPLE],
    ["favicon", FAVICON],
    ["android-chrome", ANDROID],
  ]) {
    for (const n of sizes) {
      const out = `${OUT}${prefix}-${n}x${n}.png`;
      await run(magick, [SRC, ...square, "-resize", `${n}x${n}`, "-strip", out]);
      console.log(`  ${prefix}-${n}x${n}.png`);
    }
  }

  // A real multi-resolution ICO, not a JPEG with the wrong extension, which is
  // what the Jekyll site shipped.
  await rm(ICO, { force: true });
  await run(magick, [SRC, ...square, "-resize", "48x48", "-define", "icon:auto-resize=48,32,16", ICO]);
  console.log("  favicon.ico");
};

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
