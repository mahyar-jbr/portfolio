# GlassPanel

The Lucent material: a translucent lens that blurs and saturates whatever sits behind it, with a refraction rim (bright top-left, shaded bottom-right) and a soft fixed sheen at the top. It does not move on its own.

**Markup.** `<div class="lu-glass">…</div>`. Consumer provides the content and something with colour behind it (`.lu-wall`, a photo, project art). Radius comes from `--lu-r` (default `radius-md`).

**Variants.**
- default (regular): `glass-fill-strong` + `blur-thick`. Anything with paragraphs or `ink-secondary`.
- `is-clear`: `glass-fill` + `blur-regular`. Controls over imagery only; `ink` text only.
- `is-tinted`: `accent-tint`. Selected or featured.

**Do** pad with `space-4` or `space-5`; keep nested corners concentric (inner radius = outer minus padding).
**Don't** put glass on flat `bg`: with nothing to refract it just looks grey.
