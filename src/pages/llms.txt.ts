import type { APIRoute } from "astro";
import { site, projects, socials } from "../data/site";
import { getPosts, getTalks } from "../lib/content";
import { getPublications, getSelected, describe } from "../lib/publications";

/**
 * /llms.txt, in the format proposed at https://llmstxt.org: a plain markdown
 * index of the site for language models, which otherwise have to pick the
 * facts out of navigation and layout markup. Generated from the same data as
 * the pages, so it cannot say something the site does not.
 */

const abs = (path: string) => new URL(path, site.url).href;
const ymd = (date: Date) => date.toISOString().slice(0, 10);

export const GET: APIRoute = async () => {
  const [posts, talks] = await Promise.all([getPosts(), getTalks()]);
  const pubs = getPublications();
  const selected = new Set(getSelected(pubs).map((pub) => pub.title));

  const pub = (p: (typeof pubs)[number]) => {
    const where = [describe(p), p.year].filter(Boolean).join(", ");
    const line = p.url ? `[${p.title}](${p.url})` : p.title;
    return `- ${line}: ${where}${selected.has(p.title) ? " (selected)" : ""}`;
  };

  const lines = [
    `# ${site.title}`,
    "",
    `> ${site.description}`,
    "",
    `Personal site of ${site.name}: publications, talks, blog posts, and side ` +
      "projects. Ben founded CatalystNeuro (https://catalystneuro.com), which works on " +
      "Neurodata Without Borders (https://nwb.org) and the DANDI Archive " +
      "(https://dandiarchive.org). The neuroscience software is CatalystNeuro's " +
      "and is documented there; the software listed here is side projects.",
    "",
    `- Contact: ${site.email}`,
    ...socials
      .filter((s) => s.href.startsWith("http"))
      .map((s) => `- ${s.title}: ${s.href}`),
    "",
    "## Pages",
    "",
    `- [About](${abs("/")}): who Ben is, his work, background, and interests`,
    `- [Publications](${abs("/publications/")}): generated from ORCID ${site.orcid}`,
    `- [Talks](${abs("/talks/")}): talks with recordings`,
    `- [Blog](${abs("/posts/")}): posts about side projects`,
    `- [Software](${abs("/software/")}): side projects`,
    "",
    "## Publications",
    "",
    ...pubs.map(pub),
    "",
    "## Talks",
    "",
    ...talks.map((t) => {
      const video = t.data.youtube ? `, video https://www.youtube.com/watch?v=${t.data.youtube}` : "";
      return `- [${t.data.title}](${abs(t.data.permalink)}): ${t.data.venue}, ${ymd(t.data.date)}${video}`;
    }),
    "",
    "## Software",
    "",
    ...projects.map((p) => `- [${p.name}](${p.href}): ${p.blurb}`),
    "",
    "## Blog posts",
    "",
    ...posts.map((p) => {
      const about = p.data.description ? ` ${p.data.description}` : "";
      return `- [${p.data.title}](${abs(p.data.permalink)}): ${ymd(p.data.date)}.${about}`;
    }),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
