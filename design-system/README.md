# Design system

The site's look, motion and components come from **Lucent**, a liquid-glass kit
made for this portfolio in Claude Design:
<https://claude.ai/artifact/5mgJwHQjLnKR9Vj8pNaaYi>

| Path | What |
|---|---|
| `lucent/README.md` | The brand book: principles, voice, colour, glass, type, motion, states, imagery. Read first. |
| `lucent/guidelines/` | `handoff.md` (how to build from the kit, the bar before shipping) and `showcase.md` (why each section is shaped the way it is) |
| `lucent/components/*.md` | One guideline per component |
| `lucent/tokens.json` | Every token, light and dark. The source of `styles/tokens.css` |
| `lucent/bundle.css` | Every component class and layout primitive (`lu-*`) |
| `lucent/bundle.js` · `index.d.ts` | `window.Lucent`: the motion engine and component behaviour, and its types |
| `lucent/assets/brand/` | The mark, lockup, app icon and upright sigma |
| `archive/pre-lucent/` | The design docs of the pre-Lucent v2 build. History only; none of it applies now |

## The files in `lucent/` are the kit, verbatim

Don't edit them here. Change the kit in Claude Design, then copy the changed
files over the ones in `lucent/` and run `npm run tokens`. Keeping them untouched
is what makes that re-sync a file copy instead of a merge.

## How the site uses it

- **CSS:** `app/layout.tsx` imports `lucent/bundle.css`, then `styles/tokens.css`
  (generated from `lucent/tokens.json` by `scripts/build-tokens.mjs`, with dark
  mode that follows the OS), then `styles/site.css`, the only hand-written CSS.
  `site.css` holds what the kit leaves to the page (where the nav floats, the
  kit templates' page-level styles, first-paint motion), and every value in it is
  a Lucent token.
- **Markup:** `components/lucent/` has one React component per kit component.
  Each one renders the kit's markup and classes, and its guideline sits in
  `lucent/components/`. Sections (`components/sections/`) and the case study
  (`components/work/`) put them together with data from `content/`.
- **Motion:** `components/lucent/Runtime.tsx` loads `lucent/bundle.js` in the
  browser and calls `Lucent.auto()` after every route change, following the
  Handoff guide. Internal links go through `TransitionLink`, which plays the
  kit's page swap (`Lucent.transition`) and scrolls smoothly to in-page anchors.
  The hero entrance and the brand reveal are CSS, so they start with the first
  paint of the server-rendered page.
- **Without scripts:** everything rests visible; only motion is lost (Handoff bar).
