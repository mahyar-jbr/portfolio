# mahyar-portfolio.dev

Personal site for Mahyar Jaberi — AI Agent & Full-Stack Engineer.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · the **Lucent** design system · deployed on Vercel.
No CSS framework and no animation library: styling and motion come from Lucent.

```bash
npm run dev        # localhost:3000 (regenerates styles/tokens.css first)
npm run build      # likewise
npm run typecheck
npm run tokens     # rebuild styles/tokens.css from design-system/lucent/tokens.json
```

## Layout

```
app/                 routes only: / and /work/[slug], plus icon, OG image, 404
components/
  lucent/            one component per Lucent kit component, and the runtime that wires its motion
  sections/          the home page: Hero · Work · Experience · Drawings · Contact
  work/              the case study template and project card art
content/             ALL copy and project data (see below)
  sources/           the verified per-project extracts the copy is written from
design-system/
  lucent/            the Lucent kit, verbatim: brand book, guidelines, tokens, CSS, runtime, brand assets
  archive/           design docs from before Lucent (history only)
lib/lucent.ts        loads the kit's runtime; page swap and smooth-scroll helpers
styles/              tokens.css (generated) and site.css (the only hand-written CSS)
scripts/             build-tokens.mjs
public/              drawings, project screenshots, resume
```

## Design lives in `design-system/`

`design-system/README.md` explains how the kit is wired in and how to re-sync it
when the kit changes. The short version: the files in `design-system/lucent/`
are the kit's own, never edited here, so updating the design is a file copy.

## Content lives in `content/`, not in components

Every string a visitor reads comes from `content/*.ts`. Components import it; they don't
hard-code copy. This is deliberate — it means facts can be corrected without touching
layout, and layout can be reworked without re-typing facts.

| File | Holds |
|---|---|
| `types.ts` | The content model. Describes content, not presentation |
| `site.ts` | Identity, hero properties, section heads, SEO metadata, contact tiles, skills |
| `experience.ts` | Roles, education, credentials |
| `about.ts` | About narrative and highlights (not on the Lucent home page; kept for reuse) |
| `projects.ts` | The six project cards: three case studies, one brief page (work underway), two soon cards (named, nothing to show yet) |
| `art.ts` | Gallery pieces and the Godfall series, with each image's pixel size |

### Every claim is sourced

`content/sources/*_PORTFOLIO_EXTRACT.md` are per-repo factual extraction passes — each one reads
the actual source of a project and cites a file path for every claim, marking anything it
could not prove as `UNVERIFIED`. The copy in `projects.ts` is written from those, and each
`ProjectMetric` carries a `source` field recording where its number came from.

This exists because an earlier draft of this site invented a plausible six-agent
architecture for a project that had never been checked against its code. It read perfectly
well and it was fiction. `content/sources/PROJECT_EXTRACTION_PROMPT.md` is the reusable prompt that
produces these extracts; run it from inside a project repo before writing about it.

Rules that follow from that, and should survive any rewrite:

- No number ships without a `source`.
- Dead deploys are data, not memory — `ExternalLink.status` marks them, so a broken demo
  can never be linked by accident.
- Work with nothing to show yet appears only as a soon card (`SoonProject`): a name and a
  status, no page, no screenshots, no details. MoneyMind's verified write-up is kept,
  unrendered, as `heldBack` for launch day.
- "Multi-agent" describes exactly one project here (Maridian, six verified agents). It is
  not a claim about the author.

## Content and design are edited separately

Content owns `content/`. Design owns `app/`, `components/`, `lib/`, `styles/`, `design-system/`. The handoff
is the TypeScript in `content/types.ts` — if one side breaks the other's assumptions,
`npm run typecheck` fails rather than the site quietly going wrong.

---

© 2026 Mahyar Jaberi
