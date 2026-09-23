Lucent is a liquid-glass kit for Mahyar Jaberi's portfolio: warm black ink on paper white, glass only where controls float over real content, and quiet motion that gives under your finger and settles. The glass takes its cues from the material language of current Apple platforms, and the palette from the calm, premium monochrome of modern writing tools. Everything is built from scratch with web tech, with no third-party marks or assets.

## Principles

- **Ink and paper.** The UI is black and white with warm neutrals, a calm, modern tech look. `accent` is ink, so the primary button, the nav lens and the focus ring are black in light and white in dark. No colour ever sits behind components; the only colour on a page comes from real screenshots, drawings and the muted tag backgrounds.
- **Glass floats, content sits.** Navigation, captions and actions are glass layered above; long reading sits on solid `surface`.
- **Everything is soft.** Pills for controls (`radius-pill`), large continuous corners for surfaces (`radius-md` to `radius-xl`). Nested corners stay concentric: inner radius = outer radius minus the inset.
- **Quiet, then responsive.** At rest the page is still. Every control answers a press, and things that move show where they went. When in doubt, leave the effect out.
- **Pictures over labels.** Where a glyph says it better than a word (contact links, project status, a graph for graph research), use the glyph with the word as its label. Glyphs are drawn in `currentColor` line art, never hand-drawn copies of other companies' logos.

## Voice

- First person, plain and specific: "I build retrieval systems that people actually use." Not "Passionate innovator leveraging AI."
- Sentence case everywhere, including buttons and nav ("View my work", "Copy email").
- Buttons start with a verb, two or three words. Toasts are past tense ("Email copied"). No exclamation marks, no emoji.

## Colour

- Grounds: `bg` (paper white / soft black), `surface` for solid cards, `surface-raised` (the warm grey) for nested blocks.
- Text: `ink` for everything primary, `ink-secondary` for meta and descriptions. Both pass 4.5:1 on `bg`, `surface`, `surface-raised` and `glass-fill-strong` in both themes. On `glass-fill` use `ink` only.
- Action: `accent` (= ink) fills the one primary button per view, the nav lens, card arrows and the email contact tile; text on it is `on-accent`. Selected chips use `accent-tint`.
- Tags: `tag-gray` through `tag-red` are soft backgrounds for chips and project labels, always with `ink` text. They group; they never signal state.
- Canvas: `.lu-wall` is `bg` with a fine dot grid in `dot`, the only texture in the kit, for heroes and demo grounds. `fill-muted` is for placeholders and skeletons.
- `success` and `danger` always travel with a word.

## Glass material

Every glass element is five layers, bottom to top:

1. `backdrop-filter: blur(<blur-*>) saturate(glass-saturate)`
2. fill: `glass-fill-strong` (regular, carries text), `glass-fill` (clear, controls over imagery) or `accent-tint` (selected)
3. rim: 1px `glass-stroke` plus `shadow-rim`
4. refraction edge: a gradient ring from `glass-specular` (top-left) to `glass-shade` (bottom-right)
5. `shadow-glass` below; `shadow-lift` when hovered or raised

Plus a soft, fixed `glass-specular` sheen across the top. `blur-thin` on chips, `blur-regular` on nav and buttons, `blur-thick` on panels with paragraphs. Glass belongs to the navigation layer: the nav, captions over screenshots, toasts, sheets, the lightbox controls and the hero lens. Content (cards, experience, drawings, contact tiles) sits on solid `surface`. Never stack glass on glass. Browsers without backdrop-filter fall back to solid `surface`.

## Type

- The system font stack: San Francisco on Apple devices, Helvetica Neue or Arial elsewhere. No font files ship.
- `display` for the hero name only; `title-1` section heads; `title-2` card titles; `body` reading; `callout` descriptions; `caption` meta and chips; `label-mono` (uppercase) kickers and card status labels.

## Spacing and layout

- 4px base. Glass padding `space-4` or `space-5`; cards `space-6`.
- Page max width 1152px, side margin `space-8` desktop / `space-5` phone, `space-9` between sections.
- Project grid `.lu-grid`: two columns, `space-5` gutter, `.is-feature` spans both at 16:7; one column under 720px.

## Motion

Restraint first: simple is premium enough. Motion only answers something the person did, or shows where something went. Nothing loops, follows the cursor, tilts, or plays for show. `Lucent.auto()` wires a page; springs are tuned by the `spring-*` tokens and kept well damped (one soft overshoot, no wobbling).

- **Soft press** on every `.lu-btn`, button chip, nav item and segment: gives about 4% under the finger and settles back (`spring-jelly`). `data-jelly="0"` opts out. Hover changes the fill only.
- **Liquid lens** (NavBar, SegmentedControl): the selection pill travels on `spring-lens` and stretches slightly with speed. The nav lens follows the section in view.
- **Knob stretch** (Switch): the knob stretches as it travels and swells while held.
- **Card hover** (ProjectCard, ContactTiles): rise 4px, shadow deepens to `shadow-lift`, art drifts in 3%, arrow nudges 3px.
- **Grid reflow** (filter chips): leavers fade in `dur-exit`, the rest glide over `dur-morph`, returners fade in.
- **Entrance** (`data-enter`, hero only): fade and rise 12px, 70ms apart. **Reveal** (`data-reveal`): sections below the fold do the same as they arrive; content already on screen never hides.
- **Nav compact** (`data-compact`): the capsule tightens on the way down and opens on the way up.
- **Page swap** (`Lucent.transition`): the old view fades out in `dur-exit`, the new one fades up 8px. **Theme change** (`Lucent.setTheme`): a 320ms cross-fade.
- **Toast**, **sheet morph** and **loading dots** for feedback (see those components).
- **Lightbox morph** (ArtGallery): a drawing grows out of its thumbnail. **Row expand** (ExperienceList). **Lens drag** (HeroLens): slides in once, then moves only when dragged. **Brand reveal** (BrandMark): the sigma turns into the M and the sigmoid draws, once per visit.

Left out on purpose: magnetic buttons, cursor-following highlights, tilt, parallax, scroll-linked squish, pulsing status dots, drifting or colourful backgrounds. With `prefers-reduced-motion`, springs jump to rest and everything else becomes a fade of at most 150ms.

## States

- Hover: fills darken or tint; cards and tiles rise 4px.
- Pressed: the soft press; cards dip 1%.
- Selected: `accent-tint` fill with a 1.5px `accent` rim (chips), `accent` lens (nav), `surface` lens (segments).
- Loading: three softly pulsing dots, width held. Disabled: 45% opacity, no motion.
- Focus: a solid 3px `accent` outline, offset 3px, on every interactive element. Ink on paper and paper on ink hold well over 3:1.

## Brand

- The mark is an upright sigma turned a quarter clockwise into an M; its angled feet are the sigma's terminals. The lockup adds a sigmoid trail. Together: a neuron, y = σ(Σ wᵢxᵢ + b). See BrandMark and `assets/Brand/`.
- Inline it in `currentColor`: `ink` on paper, `on-accent` in an ink tile. Nav: 22px beside the name. Page hero: the page icon. App icon: the mark at 62% in an ink squircle.

## Imagery and iconography

- Project art: real screenshots, full-bleed in `.lu-card-art`, cropped from the top. BowlWise uses its own screenshots from the `Bowlwise` asset group; its blue lives only inside those images, never in the UI.
- Unreleased work goes behind the stealth card (`.lu-card.is-stealth`): abstract shapes under frosted glass, a working description, no product name, no screenshots. The `MoneyMind` asset group is private reference and never appears on a public page.
- Drawings hang on white mats at their own aspect ratio (ArtGallery), never cropped, tinted or put under glass.
- Research gets a diagram of the idea (a small node graph for graph retrieval) rather than a stock picture.
- Icons: 16 to 24px line icons, 2px stroke, round caps and joins, `currentColor`: 16px in hero properties, 13px in card status labels (store, lock, flask), 40px in ContactTiles (envelope, contribution grid, profile card, page). SF Symbols on Apple devices, an open set with the same geometry (Lucide) on the web. No emoji as icons, no hand-drawn copies of other companies' logos.

How each section is presented, and why, is in the Showcase section. How to build the site from this kit, what still needs real content, and the bar before it ships are in the Handoff section.
