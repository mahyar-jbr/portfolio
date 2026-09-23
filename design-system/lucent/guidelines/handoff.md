# Handoff

For whoever builds the site from this kit, agent or human. Read the brand book first, then this.

## What ships

- `tokens.json` plus the generated `tokens.css`: every colour, type style, space, radius, shadow, blur, duration, easing, spring and layer as CSS variables, with light and dark values.
- `components/bundle.css`: every component and the layout primitives (`lu-page`, `lu-section`, `lu-head`, `lu-kicker`, `lu-title`, `lu-lede`, `lu-prose`, `lu-meta`, `lu-case`, `lu-shot`, `lu-steps`, `lu-points`, `lu-timeline`, `lu-footer`).
- `components/bundle.js`: `window.Lucent`, the motion engine and the behaviour for every component. One classic script, no dependencies, no network calls.
- `components/index.d.ts`: the API as types.
- Components, each with a README and a live preview: GlassPanel, Button, Switch, NavBar, SegmentedControl, SkillChip, ProjectCard, Toast, Sheet, ContactTiles, ExperienceList, ArtGallery, BrandMark, Hero, HeroLens, CaseStudy, PortfolioPage, MotionLibrary.
- `assets/Brand/` (the mark, lockup, app icon), `assets/Bowlwise/` (real screenshots), `assets/MoneyMind/` (private, never published).

## Setting it up

1. One page shell: inline `tokens.css` and `components/bundle.css` in a `<style>`, then `components/bundle.js` as a classic `<script>` before your own. No build step is required; no framework is assumed. In React, keep the classes and call `Lucent.auto()` in an effect after mount.
2. Mark up sections with the component classes from each README. Call `Lucent.auto(root)` once after every render, and `Lucent.enter(hero)` once on the first paint.
3. Routes: `/` for the home page (`PortfolioPage`), `/work/<slug>` for each case study (`CaseStudy`). On a route change call `Lucent.transition(swap)`; on the home page use `data-scroll-to` anchors. On a case study, call `navApi.clear()` so the nav lens fades out.
4. Theme: the page follows the system setting through the token blocks. If you add a toggle, use `Switch` plus `Lucent.setTheme()`.
5. Head: `<title>Mahyar Jaberi</title>`, a one-sentence description, the app icon from `assets/Brand/mj-app-icon.svg` as the favicon, and an Open Graph image built from the page hero cover.

## Content to fill in

- **Projects:** BowlWise (real screenshots in `assets/Bowlwise/`), the stealth fintech (no name, no screenshots, stealth card only), Graph RAG for FHIR. Each needs a case study page; keep the beats in the CaseStudy README.
- **Experience:** FGF Brands co-op, EECS 4070 directed studies, BowlWise, Pet Valu. The bullets in the preview are prompts, not copy; replace them with results.
- **Drawings:** the gallery ships with placeholders. Swap in 10 to 15 real pieces with titles, medium, year and process shots where they exist.
- **Links:** GitHub, LinkedIn, resume PDF in `ContactTiles`; the live link and repo in each case study's meta row.

## The bar before it ships

- Every interactive element reaches by keyboard and shows the 3px accent focus ring. Nav and segments move with the arrow keys; the gallery takes arrows, swipe and Esc; the sheet traps focus and returns it.
- Text meets 4.5:1 on its ground in both themes; any icon or border that carries meaning meets 3:1.
- With `prefers-reduced-motion`, springs jump to rest and everything else is a fade of at most 150ms. Check it.
- Images: thumbnails around 800px wide, full images around 2000px, AVIF or WebP with `width` and `height` set and `loading="lazy"` below the fold. Screenshots stay uncropped where the detail matters.
- The page must work at 390px wide with no horizontal scroll, and read correctly with scripts blocked: everything is visible at rest, only motion is lost.
- No colour behind components, no glass on content, no second hero, one primary button per view.

## Do not

- Add effects that were deliberately left out (magnetic buttons, cursor-following highlights, tilt, parallax, scroll-linked squish, drifting backgrounds).
- Put the unreleased product's name, screenshots or characters on a public page.
- Redraw other companies' logos; monograms and line glyphs only.
- Invent numbers, dates or outcomes. If a figure is unknown, leave the sentence out.
