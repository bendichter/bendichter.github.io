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
  { title: "Software", href: "/software/" },
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

export type Project = {
  name: string;
  /** Primary destination for the card: the live thing if there is one. */
  href: string;
  /** Shown as a second link when the project is also on GitHub. */
  repo?: string;
  kind: "app" | "tool";
  /** Language or platform, shown as a chip. */
  lang: string;
  stars?: number;
  /** Short factual notes rendered under the blurb, e.g. "42 moves". */
  facts?: string[];
  blurb: string;
};

/**
 * Side projects, as data rather than prose. Deliberately excludes the
 * neuroscience work: that is CatalystNeuro's and lives at catalystneuro.com.
 * `lang` and `stars` are written by hand rather than fetched, so the page ships
 * no runtime JavaScript and the build does not depend on the GitHub API.
 */
export const projects: Project[] = [
  {
    name: "westie.wiki",
    href: "https://westie.wiki",
    kind: "app",
    lang: "Web app",
    facts: ["42 moves", "127 video clips", "57 dancers"],
    blurb:
      "A community wiki for West Coast Swing moves, edited Wikipedia-style. Every move gets aliases, variants, and related patterns, and any YouTube dance can be marked up move by move so the timeline follows along with the video. Descriptive rather than prescriptive: it records how the community actually dances.",
  },
  {
    name: "Invisible String",
    href: "https://invisiblestringapp.com",
    kind: "app",
    lang: "iOS and Android",
    blurb:
      "Finds the moments a couple was in the same place before they ever met. Matching runs on photo metadata, processed on the device, and pairing works from a code with no account, so the photos never leave the phone.",
  },
  {
    name: "ReachMyReps",
    href: "https://reachmyreps.com",
    kind: "app",
    lang: "Web app",
    blurb:
      "Look up your representatives at every level of government from an address, draft a letter about an issue with AI assistance, then edit it and send it. The tedious parts are automated and the message stays yours.",
  },
  {
    name: "Clnk",
    href: "https://github.com/bendichter/clnk",
    repo: "https://github.com/bendichter/clnk",
    kind: "app",
    lang: "Swift",
    blurb:
      "An iOS app for finding and sharing cocktails at nearby bars, with ratings, photos, and maps.",
  },
  {
    name: "brokenaxes",
    href: "https://github.com/bendichter/brokenaxes",
    repo: "https://github.com/bendichter/brokenaxes",
    kind: "tool",
    lang: "Python",
    stars: 573,
    blurb:
      "A matplotlib package for plots with a broken axis, for when one outlier or one long gap would otherwise flatten everything else on the chart.",
  },
  {
    name: "activity-tracker",
    href: "https://github.com/bendichter/activity-tracker",
    repo: "https://github.com/bendichter/activity-tracker",
    kind: "tool",
    lang: "Python",
    blurb:
      "Pulls Google Workspace, GitHub, and Calendar activity into a single week view, which makes it obvious where the time actually went.",
  },
];

/** The shorter homepage list, derived so the two never drift apart. */
export const software = ["westie.wiki", "Invisible String", "brokenaxes", "ReachMyReps"]
  .map((name) => projects.find((p) => p.name === name)!)
  .filter(Boolean);

/**
 * Drone footage from https://www.youtube.com/@bendichter4116. Titles are
 * shortened to the place, since the channel titles repeat the word "drone" and
 * the section heading already says it.
 */
export const drone = [
  { id: "apq4ZvhcYOI", place: "Mt. Etna", where: "Sicily, Italy" },
  { id: "-xGrDdiKZQA", place: "São Miguel", where: "Azores, Portugal" },
  { id: "tlNK29L03yY", place: "Donner Lake", where: "California" },
  { id: "1S9lE6r9FaY", place: "Antigua", where: "Guatemala" },
  { id: "-oon8rKAKFE", place: "Cap Cana", where: "Dominican Republic" },
  { id: "jBLk7889uZ4", place: "Tugboat Beach", where: "Curaçao" },
];
