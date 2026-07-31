import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";

/**
 * Builds the 1200x630 card that shows when a page is shared. Every page used to
 * share one image, the profile photo, so a link to any post looked identical to
 * a link to any other.
 *
 * Rendered at build time with satori, so the pages themselves stay static and
 * ship no JavaScript. The font is resolved from node_modules rather than a
 * system font, because librsvg would otherwise pick whatever the machine
 * happens to have and CI would render differently from a laptop.
 */

const require = createRequire(import.meta.url);

const fontPath = (weight: 400 | 600) =>
  require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`);

let fonts: Awaited<ReturnType<typeof loadFonts>> | null = null;

async function loadFonts() {
  const [regular, semibold] = await Promise.all([
    readFile(fontPath(400)),
    readFile(fontPath(600)),
  ]);
  return [
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

/** The same six-step spectrum the site uses, as the bar across the top. */
const SPECTRUM = ["#3355cc", "#1d74b8", "#0d8a92", "#38863f", "#b3781a", "#b8492f"];

const INK = "#16181d";
const MUTED = "#565e70";
const BG = "#fcfcfd";

type Card = {
  title: string;
  /** Small label above the title: "Blog", "Talk", the venue, and so on. */
  kind?: string;
  /** Small line at the bottom right, usually a date or venue. */
  meta?: string;
};

/** Each kind takes its own step of the spectrum, so the card says which it is
 *  by colour before anyone reads the label. */
const ACCENT: Record<string, string> = { Blog: SPECTRUM[0], Talk: SPECTRUM[2] };

export async function renderCard({ title, kind, meta }: Card): Promise<Buffer> {
  const accent = ACCENT[kind ?? ""] ?? SPECTRUM[0];
  fonts ??= await loadFonts();

  // Long titles need to step down a size or they overflow the card.
  const fontSize = title.length > 95 ? 52 : title.length > 60 ? 62 : 74;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: BG,
          fontFamily: "Inter",
        },
        children: [
          // spectrum bar
          {
            type: "div",
            props: {
              style: { display: "flex", height: 14 },
              children: SPECTRUM.map((c) => ({
                type: "div",
                props: { style: { flex: 1, backgroundColor: c } },
              })),
            },
          },
          {
            type: "div",
            props: {
              style: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "62px 72px 56px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "column" },
                    children: [
                      kind && {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 22,
                            fontWeight: 600,
                            letterSpacing: 2.4,
                            textTransform: "uppercase",
                            color: accent,
                            marginBottom: 26,
                          },
                          children: kind,
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize,
                            fontWeight: 600,
                            lineHeight: 1.18,
                            letterSpacing: -1.2,
                            color: INK,
                            // satori has no line clamp; the size step above plus
                            // this cap keeps even the longest title on the card
                            maxHeight: 380,
                            overflow: "hidden",
                          },
                          children: title,
                        },
                      },
                    ].filter(Boolean),
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: 26,
                      color: MUTED,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: { display: "flex", fontWeight: 600, color: INK },
                          children: "Ben Dichter",
                        },
                      },
                      {
                        type: "div",
                        props: { style: { display: "flex" }, children: meta ?? "bendichter.com" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630, fonts },
  );

  return Buffer.from(new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng());
}
