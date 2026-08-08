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
  /** True for roles not yet started — renders an "Incoming" treatment. */
  incoming?: boolean;
  /** One line of context: what the company/team does. */
  context: string;
  /** What he actually did. Past tense, concrete, no adjectives. */
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

export interface Project {
  slug: string;
  name: string;
  kind: ProjectKind;
  depth: ProjectDepth;
  /** Ordering on the home page. */
  order: number;

  /** One sentence. What it is, for whom. */
  oneLiner: string;
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

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface SiteMeta {
  title: string;
  description: string;
  ogImageAlt: string;
}
