# Portfolio Structure — FINALIZED (2026-06-02)

The agreed blueprint for the premium overhaul. Governs all section-by-section design work.
Decisions backed by fact-checked research (see memory: portfolio-research-findings).
Content source of truth: CONTENT_DRAFT.md.

---

## Positioning
**Mahyar Jaberi — AI Agent & Full-Stack Engineer.**
Lead on the differentiator: builds & ships production multi-agent AI systems. Full-stack range underneath.
Exact hero tagline finalized in the Hero design step (AI-agent-forward direction chosen).

## Stack & craft direction
- **Next.js 15 (App Router)** + Tailwind (with design tokens) + Framer Motion. Deploy Vercel.
- Monochrome/brutalist B&W identity, ELEVATED (real type scale, tokens, restraint).
- ONE signature moment: **agent-network 3D hero** (react-three-fiber), behind DOM headline, code-split/ssr:false, reduced-motion + mobile fallback. Everything else restrained.
- prefers-reduced-motion: swap heavy motion → light cross-fade (don't just disable).
- Perf is part of the craft (Bruno Simon: "10 FPS = no one sticks around"). Target strong Lighthouse.

---

## Information Architecture (single-page scroll + 2 case-study routes)

### Home `/` — section order
```
HERO            agent-network 3D · name · role title · ONE tagline · [View Work][Resume][GitHub]
01 WORK         projects FIRST — the hook
02 EXPERIENCE   Nova Ventures · Sepantech · Pet Valu (reframed)
03 ABOUT        story · stats · education · certs (Stanford ML in progress, IBM)
04 SKILLS       categorized, now incl. AI/ML category
05 GALLERY      art — kept as differentiator
06 CONTACT      form (Formspree) + socials + availability
```
Changes from current live site:
1. WORK moved from #2 → #1 (ahead of About).
2. ABOUT moved from #1 → #3.
3. Hero copy repositioned generic → AI-agent role + impact tagline.
4. Fix the duplicate "01" marker bug (Hero + About both showed 01).
5. Nav: add active-section highlighting.

### Case-study routes (HYBRID model)
```
/work/maridian     full page — 6-agent system, technical lead, TMLS 2026
/work/moneymind    full page — AI finance agent, architecture lead, Google Cloud hackathon
```
- BowlWise → rich inline card + modal (live + solo; very strong but presented on-home).
- WealthTrack → minimal inline card (one-liner + tech tags + a metric).

---

## Project presentation rules (the #1 conversion lever)

Every project: **problem → approach → implementation → measurable result.** Outcome-first, scannable.
NOT flat "key highlights" bullet lists (that's the tutorial-follower format we're leaving behind).

For the AI flagships specifically:
- State the **problem** first (the user/business need).
- **Justify** the architectural & metric choices (why LangGraph? why a 1024-dim vector index? why this metric — retrieval precision, tool-call success, latency, cost-per-task?). This is where real competence shows.
- Tie to **impact/outcome** (live in 2 stores; token-by-token over real data; restored a prod outage).
- Always make YOUR individual contribution explicit on team/lead work.

### Per-project depth
| # | Project | Depth | Where | Key proof |
|---|---------|-------|-------|-----------|
| 01 | BowlWise | Rich (card+modal) | Home | Live in 2 PetValu stores, solo, 20 endpoints, 61 tests |
| 02 | Maridian | DEEP (page) | /work/maridian | 6-agent, tech lead, fixed prod outage, live demo |
| 03 | MoneyMind | DEEP (page) | /work/moneymind | streaming agent pipeline, arch lead, vector index |
| 04 | WealthTrack | Minimal (card) | Home | RN mobile, ~60% fewer API calls, 12 endpoints |

---

## AI legibility deliverables (make multi-agent work legible to non-experts)
CORE (build these):
1. **Architecture diagrams** — MoneyMind 3-layer stack; Maridian 6-agent topology. Annotated, monochrome, on-brand.
2. **Animated pipeline visual** — MoneyMind streaming flow Next.js → FastAPI → LangGraph → Atlas → Gemini, token-by-token feel.
3. **Recorded demo / GIF** — Maridian operator portal; BowlWise in-store tablet flow.

STRETCH (only if rock-solid, build LAST):
4. **Live embedded AI demo** — a scoped working agent. Risk: cost/latency/reliability; research found NO proven lift vs a recording. Must have graceful fallback to the recorded demo. Ship the recording if not bulletproof.

---

## Known fixes to fold in during the rebuild (found in code review)
- NavBar reads `document.documentElement.scrollHeight` during render → SSR crash. Fix with framer `useScroll().scrollYProgress`.
- AboutSection calls `useRef` inside `.map()` (Rules-of-Hooks violation) → split into per-stat card components.
- AboutSection mousemove → setState re-renders whole 700-line tree → isolate cursor glow, drive with useMotionValue (zero React re-renders).
- Two inconsistent modals (polished ArtworkModal vs plain ProjectModal) → unify to one brutalist modal language.
- public/ is 53MB; delete unused lassonde-logo.png (3.4MB); next/image for all images; videos preload="none" + poster, mount on open.
- Self-host Inter via next/font (kill render-blocking @import).
- Reconcile skills to the tighter resume set + add AI/ML category.

---

## Migration backbone (from the Plan agent — full detail in that plan)
9 PR-sized chunks on a `feat/next15-migration` branch, app runnable throughout:
1 scaffold Next · 2 tokens+fonts+globals · 3 data+libs+ui primitives · 4 Hero+Nav+Footer · 5 About+Work+Modal ·
6 Experience+Skills+Contact · 7 Gallery split+video · 8 r3f agent-network hero · 9 assets+SEO+cutover.

---

## Open items deferred to design step
- Exact hero tagline wording (draft 3-4, pick).
- Whether a single accent color enters the monochrome system, used sparingly.
- Case-study page template layout (hero, diagram, narrative, gallery, next-project footer).
- Gallery: keep as-is vs restyle to match the new system.
