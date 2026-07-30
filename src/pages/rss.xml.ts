import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { site } from "../data/site";
import { getPosts } from "../lib/content";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: post.data.permalink,
      categories: post.data.tags,
    })),
  });
}
