import type { APIRoute } from "astro";
import { renderCard } from "../../lib/og";
import { getPosts, getTalks, formatDate } from "../../lib/content";

/**
 * One social card per post and per talk, written to /og/<slug>.png at build
 * time. Static output, so these are plain files on disk; nothing renders at
 * request time.
 */
export async function getStaticPaths() {
  const [posts, talks] = await Promise.all([getPosts(), getTalks()]);

  return [
    ...posts.map((post) => ({
      params: { slug: post.data.permalink.replace(/^\/|\/$/g, "").replace(/\//g, "-") },
      props: {
        title: post.data.title,
        kind: "Blog",
        meta: formatDate(post.data.date),
      },
    })),
    ...talks.map((talk) => ({
      params: { slug: talk.data.permalink.replace(/^\/|\/$/g, "").replace(/\//g, "-") },
      props: {
        title: talk.data.title,
        kind: "Talk",
        meta: talk.data.venue,
      },
    })),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderCard(props as Parameters<typeof renderCard>[0]);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=31536000" },
  });
};

/** Mirrors the params built above, so pages can point at their own card. */
export const ogPath = (permalink: string) =>
  `/og/${permalink.replace(/^\/|\/$/g, "").replace(/\//g, "-")}.png`;
