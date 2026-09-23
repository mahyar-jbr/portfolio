# Hero

The page hero, the default opening: it reads like a well-kept doc page. A cover band (the dot canvas with one hairline sigmoid, or one of your drawings), the brand mark as the page icon overlapping it, your name, then a short list of properties with glyphs: role, what you are doing now, where you study, where you are with a live local time, status as a tag, and a link to your drawings.

Why this works: a reviewer decides in about ten seconds whether to stay, and this answers who, what, where and whether you are available in one glance, in the same scannable key and value form people already read every day.

**Markup.** `<section class="lu-hero is-page">` with `.lu-hero-cover` (add `lu-wall` for the dot canvas, or an `<img>`), `.lu-hero-inner` holding `.lu-hero-icon` (the BrandMark), `h1`, `dl.lu-props` (rows of `dt` with a 16px glyph and `dd`), and `.lu-hero-actions`. Put `data-enter` on the icon, title, properties and actions and call `Lucent.enter(hero)` once. `<time data-live data-tz="America/Toronto">` keeps a quiet local clock.

**Consumer provides** the properties (keep to six, one line each), a status tag (`lu-tag is-green` for available), two actions. **Don't** add a paragraph pitch as well; the properties are the pitch.

For a louder, one-object opening use HeroLens.
