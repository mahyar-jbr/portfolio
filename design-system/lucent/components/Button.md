# Button

Pill button with the Lucent press: it gives slightly under your finger and settles back with one soft overshoot on release. Hover only changes the fill.

**Markup.** `<button class="lu-btn is-filled">View my work</button>` and `Lucent.auto()` once. Every `.lu-btn` gets the jelly press automatically (small and icon buttons get a gentler one); `data-jelly="0"` opts out.

**Variants.** `is-filled` (the primary: `accent` ink fill with a soft top gloss), `is-glass` (secondary, over imagery), `is-quiet` (tertiary, text only). Sizes: default, `is-small`, `is-icon` (44px circle, needs `aria-label`).

**States.** Hover: fill darkens (filled) or tints (glass, quiet). Pressed: the soft squash. Loading: `Lucent.busy(btn, promise)` keeps the width and shows three softly pulsing dots. Disabled: 45% opacity, no motion. Focus: 3px `accent` ring.

**Do** start labels with a verb, sentence case. **Don't** put two filled buttons side by side.
