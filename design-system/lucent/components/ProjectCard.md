# ProjectCard

Portfolio tile: full-bleed project art with a glass caption floating on its bottom edge. On hover it rises 4px, its shadow deepens, the art drifts in by 3% and the arrow nudges forward; pressing dips it slightly. Nothing tilts or glows.

**Markup.** `<a class="lu-card" href="…"><div class="lu-card-art"><img src="…" alt=""></div><span class="lu-card-label has-icon">svg Live in stores</span><div class="lu-card-caption lu-glass"><div><h3 class="lu-card-title">Name</h3><p class="lu-card-meta">One line</p></div><span class="lu-card-go" aria-hidden="true">→ svg</span></div></a>`. Consumer provides a real screenshot (it is cropped from the top: `object-position: top`), title, one meta line, a status label with a 13px glyph, and the link.

**Stealth variant.** For work that is not released: `is-stealth`, put abstract shapes in `.lu-card-art` and add `<div class="lu-card-frost"></div>` after it. The frost blurs whatever is underneath, the label reads "In stealth" with a lock glyph, and the caption uses a working description instead of the product name. Never put a real screenshot under the frost; blur can be undone by eye.

**Layout.** `.lu-grid` (two columns, `space-5` gutter, one under 720px); `.is-feature` spans both columns at 16:7.
