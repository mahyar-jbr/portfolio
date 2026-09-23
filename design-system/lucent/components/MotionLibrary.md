# MotionLibrary

Every animation in Lucent, with the tokens behind it and a live demo. The rule behind the list: motion only answers something the person did, or tells them where something went. Nothing loops, follows the cursor, or plays for show.

| Motion | Where | How | Tokens |
| --- | --- | --- | --- |
| Soft press | every button, chip, nav and segment item | automatic; `data-jelly="0"` opts out | `spring-jelly` |
| Liquid lens | NavBar, SegmentedControl | automatic | `spring-lens`, `spring-lens-width` |
| Knob stretch | Switch | automatic | `spring-knob` |
| Card hover | ProjectCard, ContactTiles | CSS: rise 4px, shadow deepens, art drifts in 3% | `dur-jelly`, `shadow-lift` |
| FLIP reflow | filtered grids | `data-filter-group`, or `Lucent.filter()` | `dur-exit`, `dur-morph` |
| Entrance | first screen (hero) | `data-enter` + `Lucent.enter()` | `dur-enter`, 70ms stagger |
| Scroll reveal | sections below the fold | `data-reveal` | `dur-enter`, `dur-stagger` |
| Page swap | route or case-study change | `Lucent.transition(update)` | `dur-exit`, `dur-enter` |
| Theme change | theme switch | `Lucent.setTheme(theme)` | 320ms cross-fade |
| Toast | confirmations | `Lucent.toast()` / `data-toast` | `dur-morph`, `dur-toast` |
| Sheet morph | quick looks | `Lucent.sheet()` / `data-sheet` | `dur-morph` |
| Loading dots | async buttons | `Lucent.busy(btn, promise)` | `ease-settle` |
| Nav compact | scrolling | `data-compact` on `.lu-nav` | `dur-morph` |
| Lightbox morph | ArtGallery | a drawing grows out of its thumbnail; arrows cross-slide | `dur-morph`, `ease-settle` |
| Row expand | ExperienceList | height opens on `ease-settle`, chevron turns | `dur-morph` |
| Lens drag | HeroLens | slides in once, then moves only when dragged | `spring-lens` |
| Brand reveal | BrandMark | the sigma turns into the M, then the sigmoid draws; once per visit | spring easing |

Left out on purpose: cursor-following highlights, magnetic buttons, tilt, parallax, scroll-linked squish, pulsing dots, drifting or colourful backgrounds. With `prefers-reduced-motion`, springs jump to rest and everything else becomes a fade of at most 150ms.
