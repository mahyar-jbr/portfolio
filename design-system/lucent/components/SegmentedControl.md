# SegmentedControl

Two to five mutually exclusive options in a glass track, with the same liquid lens as the NavBar in a quiet `surface` colour.

**Markup.** `<div class="lu-seg" role="radiogroup" aria-label="View"><button class="lu-seg-item" role="radio" aria-checked="true" data-value="grid">Grid</button>…</div>`. Arrow keys move between options. Listen for the `change` event (`detail.value`).

**Use for** switching views of the same content (grid / list, case study / code). **Don't** use it for navigation between pages; that is the NavBar.
