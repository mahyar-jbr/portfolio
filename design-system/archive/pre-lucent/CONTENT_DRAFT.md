# CONTENT_DRAFT.md — SUPERSEDED (2026-08-08)

This file was the content source of truth on **2026-06-02**. It is now wrong in almost
every particular and must not be used. Its contents are preserved in git history
(`git show 9a84101:CONTENT_DRAFT.md`) if the old wording is ever needed.

**The live source of truth is `content/*.ts`.** See the README.

## What it got wrong, so nobody reintroduces it

| Stale claim | Actual, verified 2026-08-08 |
|---|---|
| Lineup `BowlWise · Maridian · MoneyMind · WealthTrack` | `01 BowlWise · 02 MoneyMind · 03 Maridian · 04 Tactical DNA`. WealthTrack is cut |
| "Sept 2023 – Apr 2027 (Expected)" | Graduation moved and is **unknown**. Publish no grad date anywhere |
| Framed for internship hunting | He is **not** hunting. 1-year AI Solutions Engineer co-op at FGF from Sept 2026 |
| BowlWise "61 automated tests" | **121**, all passing |
| BowlWise "150 products / 6 brands" | **260 products / 15 brands** |
| Maridian live demo at `fgf-sentinel-web.vercel.app` | Backend decommissioned, 404. **Link nothing** |
| Maridian "technical lead… led the technical build end to end" on a "5-person team" | Team of **6**. He was infrastructure lead and integrator; he wrote **none** of the agents, tools, or schema |
| MoneyMind "Google Cloud Agent Hackathon" | **Google Cloud Rapid Agent Hackathon, MongoDB Track** |
| Tagline "production multi-agent AI systems — live in stores" | Retired. The thing live in stores (BowlWise) contains no AI at all |

Two further traps that were never in this file but are worth recording next to it:

- **`data/caseStudies.js` (now deleted) contained a fabricated six-agent breakdown for
  Maridian** — intake / classify / recommend / review. Invented by an earlier session,
  flagged `VERIFY`, never confirmed, and nearly shipped as the hero graphic. The real six
  are Triage, Options, Scorer, Decision, Batch Tracker, Recovery Planner.
- **`STRUCTURE.md` is likewise superseded** by `design/SECTIONS.md`, which says so itself.
