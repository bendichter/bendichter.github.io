// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://bendichter.com",
  integrations: [sitemap()],
  // Directory-style URLs, so /posts/foo and /posts/foo/ both resolve, which is
  // what the Jekyll site served and what existing inbound links expect.
  trailingSlash: "ignore",
  build: { format: "directory" },
  markdown: {
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
  },
});
