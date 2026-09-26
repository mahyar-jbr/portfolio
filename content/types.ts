/**
 * Content model for the portfolio.
 *
 * These types describe CONTENT, deliberately not layout. Nothing here says how
 * anything looks, how long it is, or where it sits on the page — so the design
 * tab can restructure freely without content changes, and content can be
 * corrected without touching components.
 *
 * Rule of thumb: if a field would change because the design changed, it does not
 * belong in this file.
 *
 * Every published claim traces back to something verified. Anything still
 * unverified is marked `TODO(verify)` at its use site and must not ship.
 */

/** A link out of the site. `status` decides whether it renders at all. */
export interface ExternalLink {
  label: string;
  href: string;
  /**
   * live    — verified working, safe to publish
   * dead    — deploy is gone; do NOT render
   * private — repo/deploy exists but isn't public
   * pending — will exist later (e.g. MoneyMind production)
   */
  status: 'live' | 'dead' | 'private' | 'pending';
}

export interface Identity {
  fullName: string;
  /** Role title. Short, concrete, no seniority inflation. */
  roleTitle: string;
  /** One sentence: what he does. The hero's only argument. */
  tagline: string;
  location: string;
  email: string;
  phone: string;
  domain: string;
  socials: ExternalLink[];
}

export interface Role {
  company: string;
  title: string;
  /** Display string, e.g. "May – Aug 2025". Dates are content, not data. */
  period: string;
  location: string;
  /**
   * Replaces "company · location" as the row's second line when that pairing
   * doesn't describe the role (a lab and its supervisor, a product and its URL).
   */
  subline?: string;
  /**
   * Two letters for the company's tile: the fallback for a company without a
   * supplied `logo`. Letters are never drawn into a logo.
   */
  monogram: string;
  /**
   * The company's own logo, supplied by Mahyar (2026-09-23): a web copy in
   * public/experience/, cropped to the mark and never recoloured or redrawn.
   * `width` and `height` are the file's pixels.
   */
  logo?: { src: string; width: number; height: number };
  /** The role he is in today — carries the "Now" tag. At most one. */
  current?: boolean;
  /** True for roles not yet started — renders an "Incoming" treatment. */
  incoming?: boolean;
  /**
   * The titles he held there, newest first, each with the month it began: only
   * for a role with a promotion inside it. `title` is then the latest of them.
   */
  positions?: { title: string; since: string }[];
  /** One line of context: what the company/team does. */
  context: string;
  /** What he actually did. Past tense (present for the current role), concrete, no adjectives. */
  bullets: string[];
  /** Technologies genuinely used in this role. */
  stack?: string[];
}

export interface Credential {
  name: string;
  issuer: string;
  /** e.g. "Jan 2026", or null while in progress. */
  earned: string | null;
  inProgress?: boolean;
  link?: ExternalLink;
}

export interface Education {
  institution: string;
  credential: string;
  /**
   * Start year only. No expected graduation date — it moved and is currently
   * unknown, and a wrong date on the one page people cross-check is worse than
   * no date at all.
   */
  started: string;
  location: string;
}

/** How much page a project gets. Depth is an editorial call, not a design one. */
export type ProjectDepth = 'deep' | 'standard' | 'compact';

/** What kind of thing it is — changes what the reader should expect. */
export type ProjectKind = 'product' | 'prototype' | 'research';

export interface ProjectMetric {
  value: string;
  label: string;
  /** Where this number comes from. Required — a metric with no source is a rumor. */
  source: string;
}

export interface TechnicalDecision {
  decision: string;
  /**
   * Why this over the alternative. Only ever populated from something Mahyar
   * actually decided — never reconstructed into a plausible-sounding rationale.
   */
  why: string;
}

/**
 * The status label on a project card. `kind` says what sort of status it is so
 * the design can pick a glyph; the words are `label`.
 *
 * live      — in production, people use it
 * soon      — named, with nothing to show yet
 * progress  — underway, no result yet
 * research  — a finished study
 * hackathon — built under a hackathon clock
 */
export interface ProjectStatus {
  label: string;
  kind: 'live' | 'soon' | 'progress' | 'research' | 'hackathon';
}

/** A real screenshot of the product. Never a mockup. */
export interface Shot {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** One line on what the screenshot shows. */
  caption: string;
}

/**
 * A photo from the room on the day a project was shown: people, not the
 * product (that is a Shot). Shipped resized, in sRGB, with no EXIF or GPS. Its
 * alt and caption name Mahyar and no one else: not a teammate, not a visitor.
 */
export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** One line on the moment. */
  caption: string;
}

/**
 * A short clip from the same day, silent: the file has no audio track.
 * `still` is its last frame, the one it comes to rest on, so the still can
 * stand in for it before it plays, under reduced motion and without scripts.
 */
export interface Clip {
  src: string;
  still: string;
  width: number;
  height: number;
  /** What the clip shows, for a reader who can't see it. */
  alt: string;
  caption: string;
}

/** One beat of "how it works". Three of them, in order. */
export interface Step {
  title: string;
  body: string;
}

/** A labelled fact for a case study's summary row ("In stores", "Event"). */
export interface MetaFact {
  label: string;
  value: string;
}

/** What every project has, whatever page it gets. */
interface ProjectCard {
  slug: string;
  name: string;
  kind: ProjectKind;
  /** Ordering on the home page. With an odd count, the lowest is the featured card. */
  order: number;
  status: ProjectStatus;
  /** The one line under the name on the card. Short: it sits in a glass caption. */
  cardLine: string;
  year: string;
}

/**
 * A project that is named on the site but has nothing to show yet. It appears
 * only as a card that opens nothing: no page, no link, no screenshots, no
 * details. The card line and year are optional because some of these have
 * neither yet, and neither may be invented to fill the gap.
 */
export interface SoonProject extends Omit<ProjectCard, 'cardLine' | 'year'> {
  page: 'none';
  cardLine?: string;
  year?: string;
  /**
   * A short silent loop as the card's banner, in place of its name. Only what
   * Mahyar chose to show: a character, never a screenshot of the product.
   */
  video?: CardVideo;
  /**
   * What a tap on the card gets, since it opens nothing: a character rises into
   * the banner, says one line and goes again. Like `video`, only a character,
   * never the product. Without scripts the card stays inert and he never shows.
   */
  cameo?: {
    /** A transparent cutout of him standing, head to feet. `width` and `height` are the file's pixels. */
    image: { src: string; width: number; height: number };
    /** What he says, in his own voice. Short: it sits in a speech bubble on the card, and is read out. */
    line: string;
  };
}

/** A soon card's banner loop. The files are cut to loop cleanly and carry no audio track. */
export interface CardVideo {
  src: string;
  /** The loop's first frame: shown until it plays, and instead of it under reduced motion or without scripts. */
  poster: string;
  width: number;
  height: number;
  /**
   * What the clip shows, in a line. The card hides the clip from screen readers,
   * since its caption already names the project, so nothing reads this out; it
   * says what the file is.
   */
  description: string;
}

/**
 * Work that has started but has nothing to show yet: a short page with the
 * summary row and what is being built, and no results.
 */
export interface BriefProject extends ProjectCard {
  page: 'brief';
  /** One sentence under the name. */
  lede: string;
  role: string;
  facts: MetaFact[];
  /** The tools it is built with, as a case study's are. */
  stack?: string[];
  /** What is being built, one line each. */
  building: string[];
}

export interface CaseStudyProject extends ProjectCard {
  page: 'case-study';
  depth: ProjectDepth;

  /** One sentence. What it is, for whom. */
  oneLiner: string;
  /** The product's own mark, shown beside its name on the case study. */
  mark?: string;
  /** Extra facts for the summary row, after role and status. */
  facts?: MetaFact[];
  steps?: Step[];
  shots?: Shot[];
  /** Short context labels: "Course project", "Hackathon", "Live in production". */
  badges: string[];
  stack: string[];
  links: ExternalLink[];

  /** The user/business need. Always stated before the solution. */
  problem: string;
  /** What was built, and the shape of it. */
  approach: string;
  /** What shipped and what came of it. Outcome, not effort. */
  result: string;

  metrics?: ProjectMetric[];
  decisions?: TechnicalDecision[];

  /** Team projects only — his specific scope, stated plainly. */
  contribution?: {
    role: string;
    teamSize: number;
    owned: string;
  };

  /** The day it was shown, from the room: Mahyar's own photos and clip of it. */
  demoDay?: {
    clip?: Clip;
    photos: Photo[];
  };
}

export type Project = CaseStudyProject | BriefProject | SoonProject;

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface SiteMeta {
  title: string;
  description: string;
  ogImageAlt: string;
}
