# Design System v2 — mahyar-portfolio.dev

**Live page:** `/design-system` · **Tokens:** `app/globals.css`
**Status:** built, pending sign-off.

Light-mode primary. Navy accent, olive-tinted neutral, Apple-derived motion.
Derived from a 6-lane research sweep (Apple HIG · Wealthsimple + premium fintech ·
light-mode craft signals · glass implementation · colour · type & motion), each lane
adversarially verified. **62 findings were killed in verification.**

Every colour here was generated in OKLCH and its WCAG ratio computed. Every spring was
generated from Motion 12.43's own `visualDuration` formula and simulated to rest. Nothing
on the design-system page is an estimate.

---

## 1. The navy-vs-olive answer

He asked for navy **or** olive. The answer is **both, in the roles the maths allows** —
and the reason is checkable, which matters for an engineer's portfolio.

**Navy is the accent.** Olive cannot carry an accent ramp: at L 0.30 olive holds only
**0.066** chroma inside sRGB against navy's **0.139** — a 2.12× gap — so every dark olive
step clips, and clipped dark olive renders as muddy khaki. Radix ships Olive as a *gray*
and excludes it from all 22 accent options. This was verified by independent binary search
of the sRGB gamut boundary, not taken on trust.

**Olive is the neutral's hue.** The entire neutral ramp sits at **hue 110**, chroma rising
0.0025 → 0.0115 → 0.0085. Light surfaces read warm; ink reads neutral. The olive is
everywhere, as temperature rather than as colour.

**Plus one olive semantic tone.** `#486635` at 6.33:1 — the exact colour Wealthsimple
ships in production as `--ws-color-text-success`. Olive works at precisely one lightness,
and this is it.

**The navy avoids the generic-blue trap.** Bootstrap, Apple, Tailwind `blue-600`, Facebook
and LinkedIn all cluster at L 0.566 / C 0.205. Our `navy-9` sits ΔL 0.146 and ΔC 0.090
outside that centroid — dark enough to read as ink, saturated enough to read as chosen.

---

## 2. Colour

Canvas `#FCFCFA`. Ratios measured against it, not rounded up.

| Step | Neutral (h110) | ratio | Navy (h262) | ratio | Role |
|---|---|---|---|---|---|
| 1 | `#fcfcfa` | 1.00 | `#f9fbfe` | 1.01 | canvas |
| 2 | `#f8f9f6` | 1.03 | `#f2f7fe` | 1.05 | raised surface |
| 3 | `#f3f3ef` | 1.08 | `#e8f0fe` | 1.12 | hover fill |
| 4 | `#edede8` | 1.14 | `#dbe8fd` | 1.20 | active fill / selection |
| 5 | `#e4e5de` | 1.23 | `#cddefb` | 1.32 | hairline |
| 6 | `#d5d6ce` | 1.43 | `#bbd1f8` | 1.50 | border |
| 7 | `#babbb2` | 1.89 | `#9dbaee` | 1.91 | **decorative only** |
| 8 | `#92928b` | 3.05 | `#6d92d4` | 3.05 | focus ring / interactive border |
| 9 | `#73736d` | 4.64 | `#284a8b` | 8.37 | non-body text / solid fill |
| 10 | `#63645d` | 5.82 | `#1e3e7b` | 10.07 | secondary text / fill hover |
| 11 | `#565751` | 7.10 | `#3f63a6` | 5.76 | **body text** / accent text |
| 12 | `#20201c` | 15.91 | `#102245` | 15.29 | ink |

Olive: `#486635` (6.33) · `#3e5d2a` (7.29).

**Two traps encoded in the table.**

**Focus rings use step 8, never step 7.** Step 7 measures 1.89:1 / 1.91:1 and fails WCAG
1.4.11's 3:1 floor for non-text UI — even though Radix labels that exact step "UI element
border and focus rings". Step 8 was tuned to clear 3:1 by construction.

**WCAG AA is not sufficient for body text.** `neutral-9` passes AA at 4.64:1 but scores
APCA **Lc 71.3**, under the Lc 75 body-text floor. It is non-body only, at any size. Body
text is step 11.

**Tailwind's default palette is wiped** (`--color-*: initial`). Its OKLCH values sit
outside sRGB and silently clip — `oklch(0.685 0.169 237.323)` has a *negative* red channel
and clamps to a different colour than its own documented hex fallback.

---

## 3. Glass — chrome only

Apple's HIG, verbatim: *"Don't use Liquid Glass in the content layer… use standard
materials for elements in the content layer, such as app backgrounds."* Glass lives on the
nav and floating controls. Nowhere else. That is also what makes its contrast provable — a
translucent surface over arbitrary content can't be guaranteed; over a fixed chrome
position it can.

**Alpha floor 0.72**, solved from worst-case compositing rather than from what looked good
over the hero. Ink on a 0.72 scrim measures **7.88:1 over pure black**, 9.33:1 over vivid
red, 8.44:1 over pure blue, 10.15:1 over magenta. Safe by construction — including over the
artwork on `/art`. Blur and saturate cannot break the bound.

**Four rules, each verified, each a way this silently breaks:**

1. **Never nest glass.** Chromium refuses a backdrop-filtered element's children their own
   `backdrop-filter`; Gecko and WebKit allow it. So it works while you develop on Safari and
   breaks for the Chrome majority.
2. **Never put a CSS variable inside `backdrop-filter`.** Safari 18 cannot resolve custom
   properties there — tokenising `--glass-blur` yields **no glass at all in Apple's own
   browser**. Literal lengths only; switch tiers by swapping the whole declaration.
3. **Never filter an ancestor.** `opacity<1`, `mask`, `clip-path`, `filter`,
   `mix-blend-mode` or `will-change` on any parent creates a backdrop root and flattens the
   effect. A scroll-reveal that fades a section is the most likely way this breaks in
   practice. Animate leaf nodes only.
4. **Never animate the `backdrop-filter` value.** Keep it static; animate
   `background-color` alpha instead.

**No refraction.** True Apple-style lensing needs an SVG `feDisplacementMap` as a
`backdrop-filter`, which is **Chrome-only**. It would degrade to a flat blur in Safari —
the one browser where an "Apple-like" claim actually gets judged. The **specular rim** is
the portable cue and is what we ship: inset highlight + gradient border + outer shadow, no
`backdrop-filter` dependency at all.

**Accessibility is a three-layer defence, because the obvious hook doesn't work.**
`prefers-reduced-transparency` is unsupported in **every Safari version 3.1–27 and iOS
Safari 3.2–26.5** — precisely the cohort most likely to have switched Reduce Transparency
on. So: (a) the 0.72 floor is safe with no query at all, (b) `prefers-contrast: more`,
which *is* Baseline since May 2022 and works in Safari, (c) a visible persisted toggle —
the only mechanism that reaches everyone.

---

## 4. Type

**Inter via the `opsz` entrypoint.** The bare `@fontsource-variable/inter` import is the
wght-only cut — one axis — so headings were rendering Inter's **14px-optimised outlines at
display sizes**. The opsz cut carries opsz 14–32 for +24.7 KB (+51%). Confirmed at the
binary level via the `fvar` table.

**SF Pro is not an option.** Apple's licence: *"you may not use the Apple Font to create,
develop, display or otherwise distribute any documentation, artwork, website content or any
other work product."* No paid tier exists.

**Tracking is computed, not chosen.** Inter's own Dynamic Metrics formula:

```
tracking_em = -0.0223 + 0.185 · e^(-0.1745 · px)
```

It crosses zero at **12.125px**, which is why caption and micro sizes get *positive*
tracking — the opposite of the usual instinct. Every value in the scale comes off this
curve.

**Three weights, capped at 600.** Wealthsimple ships 400 and 500 for 96 of 108 weight
declarations across 1.07 MB of CSS; Stripe sets headings at 300. Reaching for 700/800 is
what makes a light UI read as loud rather than expensive.

**Mono:** Geist Mono Variable (23 KB) for the agent traces.

**No serif.** The research recommended adding Newsreader for `/art`; that was killed as
marketing-site reasoning — a second ~132 KB family for one secondary page, on a site whose
premium thesis is that jank reads as cheap.

---

## 5. Motion

Named springs, generated from Motion's own `visualDuration` path and simulated to rest.
Shipped as CSS `linear()` tokens (Baseline since Dec 2023), so they run off the main thread
and cost nothing on the interaction path.

| Token | visualDuration / bounce | settle | overshoot | Use |
|---|---|---|---|---|
| `--spring-hover` | 0.18 / 0.20 | 332 ms | 1.15% | hover, small state |
| `--spring-press` | 0.25 / 0.28 | 419 ms | 3.61% | press, toggle travel — **the "jelly"** |
| `--spring-enter` | 0.42 / 0.12 | 519 ms | 0.15% | element enter |
| `--spring-layout` | 0.55 / 0.10 | 715 ms | 0.04% | layout shift |
| `--spring-smooth` | 0.50 / 0.00 | 883 ms | 0.00% | Apple's default |
| `--spring-bouncy` | 0.50 / 0.30 | 806 ms | 4.42% | sparingly |

**Motion's defaults are not Apple's.** Framer Motion animates transforms at stiffness 500 /
damping 25 — a bounce of **0.44**. Apple's declared default is **0.0**. That one number is
most of the distance between "premium" and "cartoonish", and it is why untuned Framer
Motion never quite feels right.

**A live defect was fixed.** Motion ships `reducedMotion: 'never'`, so the OS setting is
ignored until you opt in. The repo had zero references to `MotionConfig`, `reducedMotion` or
`useReducedMotion` — every animation was ignoring `prefers-reduced-motion` entirely. Now set
to `'user'` in `app/providers.tsx`. Note it only disables transform and layout; opacity and
colour still animate, and `filter`/`backdrop-filter` need their own `useReducedMotion()`
branch.

---

## 6. Surfaces

**Radii** — Wealthsimple's shipped scale: 4 / 12 / 24 / 32 / pill. No 6px, no 8px.
Nested radius: `inner = max(0px, outer − padding)`. Nesting a 12px box inside another 12px
box produces the pinched corner that reads as amateurish even when nobody can name why.

**Elevation** — four steps, each two or three stacked shadows tinted with the neutral's hue
rather than pure black. A single blurry drop shadow is the fastest way to make a light
interface look cheap; real light gives a tight contact shadow plus a wide ambient one.

**Spacing** — 8pt grid. Section rhythm 128px, rising to 160px at ≥768px (Wealthsimple's
one media query).

---

## 7. The `/art` problem

A tightly-branded accent everywhere is exactly what clashes with original full-colour
artwork. On `/art` the accent chroma drops from **0.115 to ~0.008** — the system stops
competing with the work. The glass scrim's worst-case floor already guarantees legibility
over any image on that page.

---

## 8. Open — Mahyar's calls

1. **Accent intensity.** navy-9 `#284a8b` is deliberately dark and ink-like. A brighter
   navy is available but moves toward the generic-blue cluster.
2. **Portrait in About** — still open from `SECTIONS.md` §5.
3. **Squircles.** `corner-shape: squircle` is the real Apple corner but has thin support.
   Currently plain `border-radius`. Worth revisiting as support lands.
4. **Glass surface count.** Currently exactly one (the nav). Every additional glass surface
   is a performance and contrast liability; adding a second should require a reason.

---

## 9. Craft checklist

- Body text is `n-11`. `n-9` is non-body only, at any size.
- Focus rings are step 8. Never step 7.
- Never `#ffffff` as canvas and never `#000000` as ink.
- Three font weights: 400, 500, 600.
- Tracking comes off the Inter curve, not from taste.
- One glass surface. Glass is chrome, never content.
- Shadows are layered and hue-tinted, never a single blur.
- Radii nest with `max(0px, outer − padding)`.
- Every animated value gets a named spring token — never an inline `transition`.
- Measure the real page with the `web-perf` skill before trusting any perf assumption here.
