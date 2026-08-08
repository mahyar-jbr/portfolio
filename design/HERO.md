# Hero — Design Spec (v1, for review)

The signature section. Sets the design tokens, type scale, and motion vocabulary the whole site inherits.
Governed by STRUCTURE.md. Positioning: **AI Agent & Full-Stack Engineer.**

---

## 1. Goal & first-impression job
In ~3 seconds a recruiter must read: **who** (Mahyar), **what** (AI Agent & Full-Stack Engineer), **proof of level** (ships real systems), and feel **"this person has craft."** The agent-network 3D *is* the craft proof — and it's a metaphor for what he builds (multi-agent systems), not a generic toy.

---

## 2. Tagline options (AI-agent-forward) — PICK ONE in review
Format = role title (small, tracked, above) + headline name + ONE impact line.

**A — "ship" forward (recommended):**
> AI AGENT & FULL-STACK ENGINEER
> **MAHYAR JABERI**
> I design and ship production multi-agent AI systems — live in stores, not just on GitHub.

**B — system/scale forward:**
> AI AGENT & FULL-STACK ENGINEER
> **MAHYAR JABERI**
> I build multi-agent AI systems end to end — architecture, agents, and the UI on top.

**C — tight / confident:**
> AI AGENT & FULL-STACK ENGINEER
> **MAHYAR JABERI**
> I turn AI agents into products people actually use.

**D — proof-stacked (uses real traction):**
> AI AGENT & FULL-STACK ENGINEER
> **MAHYAR JABERI**
> Production AI engineer. Shipped to 2 retail stores, tech-lead at 2 agentic-AI hackathons.

Notes: keep ONE line (research: no greeting, one benefit line). "MAHYAR JABERI" full name (current site shows only "MAHYAR" — full name reads more professional for recruiters). Sub-line under headline; role title above as the eyebrow.

---

## 3. Layout (desktop)
```
┌──────────────────────────────────────────────────────────────┐
│  [nav]                                                          │
│                                                                │
│   AI AGENT & FULL-STACK ENGINEER            ◀ eyebrow, tracked  │
│   ╔══════════════════════════════════╗                         │
│   ║  M A H Y A R   J A B E R I       ║      ◀ huge display      │
│   ╚══════════════════════════════════╝                         │
│   I design and ship production multi-agent  ◀ ONE tagline       │
│   AI systems — live in stores, not just GitHub.                │
│                                                                │
│   [ View Work → ]  [ Résumé ]  [ ⌥ GitHub ]   ◀ 3 CTAs          │
│                                                                │
│        · · ·· ·  agent-network 3D lives BEHIND all of this · · ·│
│   ▸ scroll                                          ◀ scroll cue│
└──────────────────────────────────────────────────────────────┘
```
- Left-aligned, max-w-7xl, generous top space below the fixed nav.
- The 3D canvas is absolutely positioned, full-bleed, `-z-10`, BEHIND the DOM text. The headline is the LCP element (pure DOM) so it paints instantly even if WebGL is slow/off.
- Mobile: same stack, name wraps to 2 lines, 3D density reduced or swapped for the static fallback (see §6).
- CTA change from current 3 (Explore Work / Get In Touch / GitHub) → **View Work / Résumé / GitHub** (Résumé matters more to recruiters than a contact button up top; contact is its own section).

---

## 4. The signature: AGENT SWARM (FINAL — approved 2026-06-02)

> Iteration history: agent-network 3D graph (rejected — too techy/templatey) → liquid
> distorted sphere (rejected — premium but generic, didn't say "AI/dev") → **agent
> swarm "parallel thoughts"** (APPROVED). Built in `components/hero/AgentSwarm.jsx`.

**Concept:** a living canvas field where many agent "thought fragments" — real
agent-flavored snippets (`plan →`, `▸ reasoning…`, `tool_call(search)`, `{graph}`,
`token···`, `→ act`, `embed(1024d)`, `langgraph.run`) — spawn at random positions,
drift, flicker, and decay, many firing in parallel. Reads as "multiple agents
thinking at once." Artful chaos that's unmistakably multi-agent AI + a bit of the
artist in him. **Pure monochrome** (white/gray, NO accent — final call), calmer
energy (dialed back from "too chaotic"). Canvas + rAF (no React re-renders, no WebGL).

**Final tunables (in AgentSwarm.jsx):** density TARGET min(62, area/11000); drift ±13;
life 1.8–3.0s; glitch 28%; monochrome rgba(235) at ~0.5 alpha; faint white parallel-
link lines at 0.07. Pauses on tab-hidden. Skipped entirely under reduced-motion.

**Layout:** split — name/eyebrow/tagline/CTAs on the LEFT, swarm weighted to the
right (`right-0 w-full md:w-3/5`) bleeding behind the name, with a left-edge black
gradient so the headline stays legible. Headline stays pure DOM (LCP).

NOTE: three.js + @react-three/fiber are now UNUSED (swarm is canvas). Left installed
for possible future use; candidate for removal.

---

## 4b. (superseded) original Agent-Network 3D concept
**Concept:** a slowly-drifting 3D constellation of ~40–70 nodes connected by thin edges — a living "multi-agent graph." Monochrome (white/zinc points + faint white lines on pure black). It reads as: neural net / agent topology / knowledge graph. Ties the visual to the positioning.

**Look:**
- Nodes: small white points/spheres, varying size (a few "hub" nodes larger = the orchestrator agents). Subtle additive glow.
- Edges: thin lines, low opacity (~0.1–0.2), only between near nodes. A few edges occasionally "pulse" a brighter pulse traveling node→node (data/token flowing between agents — echoes the MoneyMind streaming pipeline).
- Depth: gentle parallax; nodes nearer camera brighter/larger. Fog to fade distant nodes into black.
- Palette: strictly monochrome to honor the B&W system. (If we adopt one accent later, a single pulse could use it — decide in tokens step.)

**Behavior / interaction (meaningful, not decorative — per research):**
- Idle: whole graph slowly rotates/drifts (very slow, ~one rotation/60s). Calm, not busy.
- Cursor: nodes within a radius of the pointer gently repel/attract (magnetic), and edges near the cursor brighten — so moving the mouse feels like "perturbing the network." One clear, meaningful interaction.
- On load: nodes assemble from scattered → settle into the graph (ties to the name's entrance).
- Scroll: graph drifts back / fades as you leave the hero (parallax via useScroll), handing off to the Work section.

**Tech:** react-three-fiber + three (BufferGeometry points + LineSegments; no drei unless needed). `useFrame` for drift + pulse. Cursor via pointer → simple force in the frame loop (no raycaster needed). dpr capped [1, 1.5]. Pause `useFrame` when tab hidden or hero scrolled out of view.

---

## 5. Typography & type scale (sets the site system)
- **Display (name):** Inter 900, very tight tracking (-0.04em), clamp() from ~3rem (mobile) → ~10–12rem (desktop). (Current uses up to 16rem "MAHYAR" alone; full name needs a slightly smaller cap so it fits.)
- **Eyebrow (role):** Inter 700, uppercase, tracking 0.3em, text-xs/sm, zinc-400.
- **Tagline:** Inter 300–400, text-lg→2xl, zinc-300, max-w-2xl, leading-relaxed.
- **CTAs:** Inter 700, uppercase, tracking-wider, the existing white-slide-on-hover button (kept — it's good), but standardized as the canonical button token.
- This locks: `font-display` (900), the tracking tokens (brand 0.3em, tight -0.04em), and the zinc text ramp — all reused everywhere.

## 6. Motion & accessibility
- Name entrance: per-letter stagger up + slight 3D tilt settle (keep the current feel, refine timing/easing to the brand ease `cubic-bezier(0.6,0.01,0.05,0.95)`).
- Eyebrow/tagline/CTAs: fade+rise, staggered after the name.
- **prefers-reduced-motion:** do NOT mount the 3D canvas at all → render the **static fallback**; name appears with a simple cross-fade (no letter-stagger, no tilt). (Research: swap to light motion, don't just kill it. And reduced-motion users never download three.js.)
- **Mobile / weak hardware:** if `max-width:768px` OR `hardwareConcurrency < 4` OR no WebGL → static fallback. Caps battery/jank.

## 7. Static fallback (no-WebGL / reduced-motion / mobile)
A pure-DOM/SVG monochrome node-graph: ~15 static dots + faint connecting lines as a background, with a very subtle CSS opacity pulse on a couple of nodes (respecting reduced-motion → none). Same compositional vibe, zero GPU. The headline + tagline + CTAs are identical to the WebGL version, so the hero is fully functional and on-brand without three.js.

---

## 8. What changes vs. the current hero (HeroSection.jsx)
- Copy: "Computer Science Student" / "York · Full-Stack Developer · Problem Solver" → role eyebrow + AI-agent tagline.
- Name: "MAHYAR" → "MAHYAR JABERI" (full).
- Add the agent-network 3D background (current hero has none — just text on black).
- CTAs: Explore Work / Get In Touch / GitHub → View Work / Résumé / GitHub.
- Keep: the white-slide button interaction, corner-bracket accents (as tokens), per-letter name entrance (refined).
- Add: scroll cue at the bottom; reduced-motion + mobile fallbacks.

---

## 9. Decisions — LOCKED (2026-06-02)
1. **Tagline: A** — "I design and ship production multi-agent AI systems — live in stores, not just on GitHub."
2. **Name: full "MAHYAR JABERI."**
3. **3D vibe:** agent-network constellation as described in §4 (sparse, elegant, hub nodes + pulsing edges).
4. **Accent: ONE accent, pulse-ONLY.** Monochrome everywhere except the data-flow pulses traveling along edges. Exact hue (candidates: electric cyan #22d3ee-ish, or warm amber) chosen live when rendered. Reserved exclusively for the pulse — nowhere else in the site (revisit only if tokens step finds a reason).
5. **CTAs: View Work / Résumé / GitHub.**

Still to decide live (during build): exact accent hue; final node count/density; pulse frequency.
