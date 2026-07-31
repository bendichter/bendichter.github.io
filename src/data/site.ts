/** Everything that was scattered across _config.yml, _data/navigation.yml and
 *  _data/authors.yml, in one typed file. */

export const site = {
  url: "https://bendichter.com",
  title: "Ben Dichter",
  name: "Dr. Benjamin Dichter",
  description:
    "Research Software Engineer and Founder of CatalystNeuro, working on data standards and open source tools for neuroscience.",
  email: "ben.dichter@catalystneuro.com",
  avatar: "/images/profile.jpeg",
  orcid: "0000-0001-5725-6910",
};

export const nav = [
  { title: "Publications", href: "/publications/" },
  { title: "Talks", href: "/talks/" },
  { title: "Blog", href: "/posts/" },
];

/** `icon` names an inline SVG in src/components/Icon.astro, so there is no
 *  4,000-line icon font to go stale the way Font Awesome 5.5 did. */
export const socials = [
  { title: "Email", href: "mailto:ben.dichter@catalystneuro.com", icon: "email" },
  { title: "GitHub", href: "https://github.com/bendichter", icon: "github" },
  {
    title: "Google Scholar",
    href: "https://scholar.google.com/citations?user=_IwI_oEAAAAJ",
    icon: "scholar",
  },
  { title: "ORCID", href: "https://orcid.org/0000-0001-5725-6910", icon: "orcid" },
  { title: "Bluesky", href: "https://bsky.app/profile/bendichter.com", icon: "bluesky" },
  { title: "X", href: "https://x.com/BenDichter", icon: "x" },
];

/**
 * Side projects, as data rather than prose. Deliberately excludes the
 * neuroscience work: that is CatalystNeuro's and lives at catalystneuro.com.
 * `lang` and `stars` are written by hand rather than fetched, so the page has
 * no runtime JavaScript and no dependency on the GitHub API at build time.
 */
export const software = [
  {
    name: "brokenaxes",
    href: "https://github.com/bendichter/brokenaxes",
    lang: "Python",
    stars: 573,
    blurb:
      "A matplotlib package for plots with a broken axis, for when one outlier or one long gap would otherwise flatten everything else on the chart.",
  },
  {
    name: "tenseflow",
    href: "https://github.com/bendichter/tenseflow",
    lang: "Python",
    stars: 41,
    blurb:
      "Changes the tense of any English text, which turns out to be harder than a verb lookup because agreement, auxiliaries, and irregulars all have to move together.",
  },
  {
    name: "code-crafter",
    href: "https://github.com/bendichter/code-crafter",
    lang: "Python",
    blurb:
      "Programmatic edits to Python source through its abstract syntax tree, so a large mechanical refactor can be scripted instead of hand-applied.",
  },
  {
    name: "RepoSearch",
    href: "https://github.com/bendichter/repo-search",
    lang: "Python",
    blurb:
      "Semantic search across a GitHub repository. Chunks the source, embeds it, and stores the vectors so you can search by meaning rather than by exact string.",
  },
  {
    name: "activity-tracker",
    href: "https://github.com/bendichter/activity-tracker",
    lang: "Python",
    blurb:
      "Pulls Google Workspace, GitHub, and Calendar activity into a single week view, which makes it obvious where the time actually went.",
  },
  {
    name: "hdfpath",
    href: "https://github.com/bendichter/hdfpath",
    lang: "Python",
    blurb:
      "XPath for HDF5. Selects datasets and groups out of a deep hierarchy with a path expression instead of nested loops.",
  },
  {
    name: "colorpanel",
    href: "https://github.com/bendichter/colorpanel",
    lang: "Python",
    blurb:
      "Colormaps for when one dimension is not enough, mapping a pair of values onto a single color rather than stacking two plots.",
  },
  {
    name: "Clnk",
    href: "https://github.com/bendichter/clnk",
    lang: "Swift",
    blurb:
      "An iOS app for finding and sharing cocktails at nearby bars, with ratings, photos, and maps.",
  },
];
