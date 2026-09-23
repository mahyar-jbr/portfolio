# NavBar

A floating glass capsule whose current item sits in a liquid lens. The lens stretches in the direction of travel and squeezes vertically as it flows to the next item, then settles with a small wobble. With `data-compact` the capsule tightens as you scroll down and opens again when you scroll up.

**Markup.** `<nav class="lu-nav" data-compact aria-label="Main"><a class="lu-nav-brand" href="#top">Name</a><a class="lu-nav-item" aria-current="page" href="#work" data-jelly="0.5">Work</a>…</nav>`. `Lucent.auto()` adds the lens. `Lucent.liquidNav(nav)` returns `{ select(item), clear() }` for syncing with scroll position or routes.

**Placement.** `position: fixed`, centred, `top: space-5` plus the safe-area inset, `z-index: layer-nav`.
**Do** keep 3 to 5 items and exactly one `aria-current="page"`. Call `clear()` on pages that have no matching item (the lens fades out).
**Don't** mix icons and labels at desktop sizes.
