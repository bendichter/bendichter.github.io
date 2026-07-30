// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://bendichter.com",
  integrations: [sitemap()],

  // URLs the Jekyll site published that no longer match a permalink. On a
  // static build these become meta-refresh pages, which is what Jekyll's
  // redirect_from generated too.
  redirects: {
    // shipped for years with "stop" where it should have said "step"
    "/posts/2022-07-18-stacked-stop-plot": "/posts/2022-07-18-stacked-step-plot",
    // the old WordPress-era blog index
    "/wordpress/blog-posts": "/posts",
    "/year-archive": "/posts",
  },

  // Directory-style URLs, so /posts/foo and /posts/foo/ both resolve, which is
  // what the Jekyll site served and what existing inbound links expect.
  trailingSlash: "ignore",
  build: { format: "directory" },
  markdown: {
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
  },
});
