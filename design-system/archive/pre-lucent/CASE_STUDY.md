# Case-Study Pages — Design Spec (for review)

Dedicated Next.js routes for the two AI flagships: `/work/maridian`, `/work/moneymind`.
Linked from Work section "View Case Study →". The deepest, most differentiating pages.
Rich narrative + code-drawn diagrams + animated pipeline. Content: CONTENT_DRAFT.md.

---

## 1. Goal
Make non-visual, production-AI / multi-agent work LEGIBLE and impressive to a
recruiter who isn't an AI expert. Show engineering JUDGMENT — the *why* behind
the architecture — not just a feature list. This is where "tech lead / architecture
lead" becomes credible.

## 2. Routing & structure
- `app/work/[slug]/page.jsx` — dynamic route, one template, data-driven.
- Content lives in `data/caseStudies.js` keyed by slug (maridian, moneymind).
- `generateStaticParams` for the two slugs (SSG). Per-page metadata (title/OG).
- Back-link to home `#work`. Sticky minimal nav (logo + back).

## 3. Page template (top → bottom)
```
┌─ HERO ─────────────────────────────────────────────┐
│  ← Back to work                                      │
│  MARIDIAN                          [TMLS 2026 · LIVE]│  ← title + badges
│  A six-agent AI system for factory defect triage.    │  ← one-line what
│  Next.js · FastAPI · LangGraph …      [Demo] [Code]   │  ← stack + links
└──────────────────────────────────────────────────────┘
  AT A GLANCE   role · team · timeline · my-ownership   ← quick facts strip
  ── 01 THE PROBLEM ──     context, why it mattered
  ── 02 THE APPROACH ──    architecture DIAGRAM + prose
  ── 03 HOW IT WORKS ──    animated pipeline / agent flow
  ── 04 KEY DECISIONS ──   the "why" — 2-3 decisions w/ rationale (the senior signal)
  ── 05 WAR STORY ──       (Maridian) the prod-outage debug+fix narrative
  ── 06 RESULT ──          what shipped, metrics, what I'd do next
  ── NEXT PROJECT → ──     link to the other case study
```

## 4. Code-drawn diagrams (no screenshots)
All monochrome, on-brand (borders, brackets, mono labels):
- **Maridian — 6-agent topology:** an orchestrator node feeding 5+ specialist
  agents (e.g. intake → classify → recommend → review → notify), plus the
  operator/distributor portals. Boxes + connectors, brutalist style. Animated
  reveal on scroll; subtle "active" pulse moving through the agents.
- **MoneyMind — 3-layer stack:** Next.js (client) │ FastAPI (agent service) │
  MongoDB Atlas (+ 1024-dim vector index), as stacked labeled bands with the
  data flow between them.

## 5. Animated streaming pipeline (MoneyMind centerpiece)
A horizontal flow that ANIMATES a request traveling through:
`Next.js → FastAPI → LangGraph agent → Atlas (vector search) → Gemini → ⟵ tokens`
- A "packet" travels left→right through the stages; on the return, tokens stream
  back one-by-one into a little response line (echoes the real token-by-token UX).
- Monochrome; each stage is a bracketed node; the active stage lights up.
- Loops slowly; pauses off-screen + under reduced-motion (static labeled flow then).

## 6. "Key Decisions" — the differentiator (per research)
2–3 short blocks, each: **Decision → Why** (tie to constraint/tradeoff/impact).
Examples to draft:
- Maridian: "Why a multi-agent split vs one model" → separation of concerns,
  each agent independently promptable/testable, parallelizable.
- MoneyMind: "Why a 1024-dim vector index on Atlas" → semantic retrieval over the
  user's transactions so the agent answers from real data, not hallucination.
- MoneyMind: "Why token-by-token streaming" → perceived latency; user sees the
  agent 'thinking' immediately.
(Confirm/refine wording with Mahyar — these articulate judgment, must be accurate.)

## 7. War story (Maridian)
Narrative treatment of: every API route failing in production → traced to a DB
path resolving outside the deploy directory → shipped a fix that restored service.
Framed as "what I do under pressure." Short, concrete, with the diagnosis arc.
(This is gold for interviews — shows debugging + ownership.)

## 8. Motion / a11y
- Section reveals (riseIn), diagram draw-in on scroll, pipeline animation.
- reduced-motion: diagrams render static (fully formed), pipeline becomes a static
  labeled flow, no packet animation.
- Each page is mostly server-rendered text (good SEO/LCP); only the diagram/pipeline
  are client components.

## 9. Data model (data/caseStudies.js)
Per slug: title, badges, oneLiner, stack[], links{demo,code}, glance{role,team,
timeline,ownership}, problem, approach, decisions[{decision,why}], result,
resultMetrics[], (maridian: warStory), next{slug,title}, diagram type/config.

## 10. Open decisions for review
1. Section labels — "THE PROBLEM / THE APPROACH / HOW IT WORKS / KEY DECISIONS /
   WAR STORY / RESULT" — good, or trim?
2. The "Key Decisions" wording must be technically accurate — review my drafts.
3. Maridian agent names: I'll infer a plausible 6-agent breakdown (intake→classify→
   recommend→review→notify→orchestrate) — confirm or correct, since it should match
   what you actually built.
4. Add a "lessons / what I'd do next" line per study? (humility + growth signal)
