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

/** The homepage software list, as data rather than prose. */
export const software = [
  {
    name: "Neurodata Without Borders",
    href: "https://nwb.org",
    blurb:
      "A data standard for neurophysiology, covering electrophysiology, optical physiology, behavior, and the metadata that makes a dataset reusable.",
  },
  {
    name: "DANDI Archive",
    href: "https://dandiarchive.org",
    blurb:
      "A public archive for neurophysiology datasets, with versioning and programmatic access.",
  },
  {
    name: "NeuroConv",
    href: "https://github.com/catalystneuro/neuroconv",
    blurb:
      "Converts data from a wide range of acquisition systems into NWB, which is usually the hardest part of adopting the standard.",
  },
  {
    name: "nwbwidgets",
    href: "https://github.com/NeurodataWithoutBorders/nwbwidgets",
    blurb:
      "Interactive Jupyter widgets for exploring the contents of an NWB file without writing plotting code.",
  },
  {
    name: "Neurosift",
    href: "https://github.com/flatironinstitute/neurosift",
    blurb:
      "Browser-based visualization of NWB files and DANDI datasets, with no local installation.",
  },
  {
    name: "SpikeInterface",
    href: "https://github.com/SpikeInterface/spikeinterface",
    blurb:
      "A unified interface to spike sorting algorithms and extracellular recording formats.",
  },
  {
    name: "brokenaxes",
    href: "https://github.com/bendichter/brokenaxes",
    blurb: "A small matplotlib package for plots with a broken axis.",
  },
];
