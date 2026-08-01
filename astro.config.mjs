// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://bendichter.com",
  integrations: [
    sitemap({
      // Tag archives are noindexed as thin duplicates of /posts/, and the
      // privacy page is not something anyone should arrive at from search.
      // A sitemap should list what you want indexed, nothing else.
      filter: (page) => !/\/(tags|terms)\//.test(page),
    }),
  ],

  // URLs the Jekyll site published that no longer match a permalink. On a
  // static build these become meta-refresh pages, which is what Jekyll's
  // redirect_from generated too.
  redirects: {
    // shipped for years with "stop" where it should have said "step"
    "/posts/2022-07-18-stacked-stop-plot": "/posts/2022-07-18-stacked-step-plot",
    // the old WordPress-era blog index
    "/wordpress/blog-posts": "/posts",
    "/year-archive": "/posts",
    // The Jekyll site's CV page, which embedded a PDF that is no longer
    // published. The publication list is the part of it people came for.
    "/cv": "/publications",
    "/resume": "/publications",
  },

  // Directory-style URLs, so /posts/foo and /posts/foo/ both resolve, which is
  // what the Jekyll site served and what existing inbound links expect.
  trailingSlash: "ignore",
  build: { format: "directory" },
  markdown: {
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
  },
});
