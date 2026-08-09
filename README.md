# mahyar-portfolio.dev

Personal site for Mahyar Jaberi — AI Agent & Full-Stack Engineer.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion · deployed on Vercel.

```bash
npm run dev        # localhost:3000
npm run build
npm run typecheck
```

## Layout

```
app/           routes — /, /work/[slug], /art, /design-system
components/    ui primitives, sections, layout
content/       ALL copy and project data (see below)
design/        design system + section specs
public/        images, resume
```

## Content lives in `content/`, not in components

Every string a visitor reads comes from `content/*.ts`. Components import it; they don't
hard-code copy. This is deliberate — it means facts can be corrected without touching
layout, and layout can be reworked without re-typing facts.

| File | Holds |
|---|---|
| `types.ts` | The content model. Describes content, not presentation |
| `site.ts` | Identity, hero, SEO metadata, contact, skills |
| `experience.ts` | Roles, education, credentials |
| `about.ts` | About narrative and highlights |
| `projects.ts` | The four projects |
| `art.ts` | Gallery pieces and the Godfall series |

### Every claim is sourced

`content/*_PORTFOLIO_EXTRACT.md` are per-repo factual extraction passes — each one reads
the actual source of a project and cites a file path for every claim, marking anything it
could not prove as `UNVERIFIED`. The copy in `projects.ts` is written from those, and each
`ProjectMetric` carries a `source` field recording where its number came from.

This exists because an earlier draft of this site invented a plausible six-agent
architecture for a project that had never been checked against its code. It read perfectly
well and it was fiction. `content/PROJECT_EXTRACTION_PROMPT.md` is the reusable prompt that
produces these extracts; run it from inside a project repo before writing about it.

Rules that follow from that, and should survive any rewrite:

- No number ships without a `source`.
- Dead deploys are data, not memory — `ExternalLink.status` marks them, so a broken demo
  can never be linked by accident.
- "Multi-agent" describes exactly one project here (Maridian, six verified agents). It is
  not a claim about the author.

## Content and design are edited separately

Content owns `content/`. Design owns `app/`, `components/`, `lib/`, `design/`. The handoff
is the TypeScript in `content/types.ts` — if one side breaks the other's assumptions,
`npm run typecheck` fails rather than the site quietly going wrong.

---

© 2026 Mahyar Jaberi
