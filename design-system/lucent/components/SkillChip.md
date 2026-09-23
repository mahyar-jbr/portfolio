# SkillChip

Small glass capsule for skills, tags and filters. With `aria-pressed` it toggles; inside a `data-filter-group` it filters a grid with a FLIP animation.

**Markup.**
- Static tag: `<span class="lu-chip">Python</span>`
- Status: `<span class="lu-chip"><span class="lu-dot"></span>Available for work</span>` (always keep the words)
- Toggle: `<button class="lu-chip" aria-pressed="false" data-jelly="0.7">AI</button>`
- Filter row: `<div data-filter-group="#grid"><button class="lu-chip" data-filter="all" aria-pressed="true">All</button><button class="lu-chip" data-filter="ai" aria-pressed="false">AI</button></div>`; grid items carry `data-tags="ai product"`. Add `data-feature-odd` on the grid to let the first card span both columns when an odd number remain.

**Motion.** Cards filtered out fade and shrink 3% in `dur-exit`; the rest glide to their new places over `dur-morph`; cards coming back fade in with a short stagger.
**Do** use `caption` text, sentence case, one or two words, `space-2` gaps. **Don't** colour-code chips.
