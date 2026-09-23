# BrandMark

Mahyar's mark: an upright sigma (Σ) turned a quarter clockwise becomes an M, and its angled feet are the sigma's own terminals, so the letter keeps its math. In the lockup a sigmoid curve (σ) trails after it, rising from the baseline to the cap line. Together they are a neuron, y = σ(Σ wᵢxᵢ + b): sum, then activate. It fits an AI engineer and reads as a clean M at 16px.

**Use.** Inline the SVG so it takes `currentColor` (`ink` on paper, `on-accent` inside an accent tile). The nav uses the mark at 22px beside the name; the page hero uses it as the page icon; the app icon is the mark at 62% inside an ink squircle (radius 22%). Files: `assets/Brand/` (mark and lockup in ink and paper, app icon, the upright sigma for the story).

**Motion.** Once, on first load, where the brand is introduced: the sigma turns into the M on the spring easing, then the sigmoid draws itself (`svg.lu-mark[data-animate]`, or `Lucent.drawMark(svg)` to replay). Nowhere else; the nav mark never moves.

**Don't** round the corners, outline it, add colour, or set the sigmoid without the M.
