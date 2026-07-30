import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * The point of this file is that bad content becomes a build failure instead of
 * a page nobody notices is wrong. Every rule here corresponds to a real defect
 * that was sitting on the live Jekyll site.
 *
 * Field-level rules live here. Rules that need to compare an entry against its
 * filename, or against the other entries, live in src/lib/content.ts, because a
 * collection schema only ever sees one entry's front matter.
 */

/**
 * Jekyll permalinks are absolute paths and have to be preserved exactly, or
 * every inbound link and search result breaks. Requiring the shape here is what
 * stops a typo from silently minting a new URL: one post shipped for years at
 * "/posts/2022-07-18-stacked-stop-plot" because nothing checked the spelling.
 */
const permalink = z
  .string()
  .regex(
    /^\/[A-Za-z0-9._/-]*\/?$/,
    "must be an absolute path, e.g. /posts/2024-03-31-code-crafter",
  )
  // Mixed case is allowed because one live talk URL already has it
  // (/talks/2018-08-10-NWB-extension-simulation) and changing a published URL
  // to tidy it up would break every inbound link for no reader benefit.
  .refine((p) => !p.includes("//"), "must not contain an empty path segment");

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    permalink,
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/talks" }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    permalink,
    /** A talk with no venue is not one a reader can place. */
    venue: z.string().min(1),
    location: z.string().optional(),
    /** Bare YouTube id, so embed markup lives in the layout, not in prose. */
    youtube: z.string().optional(),
  }),
});

export const collections = { posts, talks };
