# Work Section — Design Spec (for review)

Section 01 on the home page (immediately after Hero). The recruiter hook.
Governed by STRUCTURE.md. Content: CONTENT_DRAFT.md (resume-accurate).
Layout chosen: **big stacked feature rows.**

---

## 1. Job of this section
Recruiters skim for proof first. Lead with the AI work, framed so engineering
judgment is visible (problem → approach → result), individual contribution clear.
This is where "CS student with projects" becomes "engineer who ships AI systems."

## 2. Section header
- Eyebrow: "01 / SELECTED WORK" (oversized 01, tracked label, animated underline —
  matches the section-header system from the tokens).
- One-line intro: e.g. "Production systems — multi-agent AI, shipped and live."
  (tighter + more AI-forward than the current "collection of projects…" copy).

## 3. The lineup (4 rows, in this order)
| # | Project | Depth | Link target | The hook (impact-first) |
|---|---------|-------|-------------|--------------------------|
| 01 | BowlWise | rich row | modal (rich inline) | Live on tablets in 2 PetValu stores · solo · 61 tests |
| 02 | Maridian | rich row → PAGE | /work/maridian | 6-agent system · technical lead · fixed a prod outage |
| 03 | MoneyMind | rich row → PAGE | /work/moneymind | Streaming AI finance agent · architecture lead · vector index |
| 04 | WealthTrack | rich row | modal / GitHub | Cross-platform mobile · ~60% fewer API calls |

## 4. Anatomy of ONE feature row (big, full-width, stacked)
```
┌────────────────────────────────────────────────────────────────┐
│  01                                          [ LIVE · 2 STORES ]│  ← number + status badge
│  BOWLWISE                                                       │  ← huge title (clickable)
│  ───────────────────────────                                    │  ← animated underline
│  React · FastAPI · MongoDB · Python · Pydantic · Docker         │  ← tech pills (with icons)
│                                                                 │
│  PROBLEM   Pet owners can't tell which of 150 foods fits their │  ← problem→approach→result,
│            dog's breed, allergies, and needs.                   │     3 short labeled lines
│  APPROACH  Scored every product against vet nutrition standards │     (NOT a bullet dump)
│            (AAFCO/NRC/WSAVA); built a 7-step profile wizard.    │
│  RESULT    Live on customer tablets in 2 PetValu stores. 20     │
│            FastAPI endpoints, 4-collection Mongo, 61 tests.     │
│                                                                 │
│  [ screenshots: 2-4 thumbnails ]                                │  ← image grid
│  [ View Case Study → ]  [ Live Demo ]  [ Code ]                 │  ← actions
└────────────────────────────────────────────────────────────────┘
```
Key differences from the current site:
- **Problem → Approach → Result** replaces the flat "key highlights" bullet list.
  This is the #1 conversion lever from the research. Each is ONE tight line/2.
- For AI flagships (02, 03), the primary CTA is **"View Case Study →"** (the
  dedicated page); secondary = Live Demo / Code.
- BowlWise (01) primary = Live Demo (it's the strongest "this is real"); also
  a rich modal for screenshots.
- WealthTrack (04) = leaner row (problem/result only), primary = Code.

## 5. Per-project hooks & framing (impact-first one-liners)
- **BowlWise** — "Live on customer tablets in 2 PetValu stores." Status badge: LIVE.
  Problem: 150 foods, no way to match to a dog. Approach: vet-standard scoring +
  7-step wizard. Result: shipped solo end-to-end; 20 endpoints, 61 tests, 95 Lighthouse.
- **Maridian** — "Six-agent AI system. Technical lead, 5-person team." Badge:
  TMLS 2026 · LIVE DEMO. Problem: factory defect triage. Approach: 6-agent system +
  operator portals, owned architecture/API/deploy. Result: demoed at TMLS 2026;
  diagnosed + fixed a full production outage (DB path outside deploy dir).
- **MoneyMind** — "Streaming AI finance agent. Architecture lead." Badge: Google
  Cloud Hackathon. Problem: make personal finance conversational over real data.
  Approach: 3-layer system, LangGraph agent, 1024-dim vector index. Result: verified
  end-to-end token-by-token streaming pipeline (Next→FastAPI→LangGraph→Atlas→Gemini).
- **WealthTrack** — "Cross-platform mobile investing tracker." Problem: track
  stocks/crypto/ETFs in one app. Result: RN/Expo iOS+Android, real-time prices,
  caching cut API calls ~60%, 12-endpoint REST API.

## 6. Motion / interaction (consistent with Hero + tokens)
- Rows reveal on scroll (riseIn variant), staggered.
- Hover: border lights up (zinc→white), big number glows, title nudges right,
  underline extends. (Carry the good hover language from the current WorkSection,
  standardized via tokens.)
- Status badges (LIVE) get a subtle pulse dot.
- Tech pills: existing icon+label pills (techIcons.js), refined.
- prefers-reduced-motion: reveals become simple fades; no hover-translate.

## 7. Badges / status system (new, premium touch)
Small uppercase tracked badges per project to signal credibility fast:
- `LIVE · 2 STORES` (BowlWise), `TMLS 2026` (Maridian), `GOOGLE CLOUD` (MoneyMind).
- A pulsing dot for anything currently live (BowlWise, Maridian demo).

## 8. Data model changes (data/projects.js)
Restructure each project to support the new framing:
- add `tagline` (the impact one-liner), `problem`, `approach`, `result` (strings),
  `badges` (array), `caseStudy` (slug for /work/[slug] or null), keep `tech`,
  `images`, `liveDemo`, `github`, `year`.
- Reconcile to the 4-project lineup; drop School/DogWash/Hotel.

## 9. Open decisions for review
1. Intro line wording (the one-liner under "01 / SELECTED WORK").
2. Problem→Approach→Result labels — keep those three words, or different
   (e.g. "Challenge / Build / Impact")?
3. Status badge content per project — agree with §7?
4. WealthTrack: keep in the lineup, or cut to make the section all-AI-and-BowlWise?
5. Section title: "Selected Work" vs "Work" vs "Projects" vs "Shipped"?
