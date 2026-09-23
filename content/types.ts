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
  /** Two letters for the row's monogram. Letters, never a company logo. */
  monogram: string;
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
 * stealth   — unreleased; the product's name and screenshots are withheld
 * progress  — underway, no result yet
 * research  — a finished study
 * hackathon — built under a hackathon clock
 */
export interface ProjectStatus {
  label: string;
  kind: 'live' | 'stealth' | 'progress' | 'research' | 'hackathon';
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
  /** Ordering on the home page. The lowest is the featured card. */
  order: number;
  status: ProjectStatus;
  /** The one line under the name on the card. Short: it sits in a glass caption. */
  cardLine: string;
  year: string;
}

/**
 * A project that is not public yet. It appears only as the stealth card, and
 * opening it shows a short quick look instead of a page. Nothing here may name
 * the product, show it, or describe it closely enough to identify it.
 */
export interface StealthProject extends ProjectCard {
  page: 'none';
  quickLook: string[];
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

  /** An incident worth telling. Optional and rare by design. */
  warStory?: {
    title: string;
    body: string;
  };
}

export type Project = CaseStudyProject | BriefProject | StealthProject;

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface SiteMeta {
  title: string;
  description: string;
  ogImageAlt: string;
}
