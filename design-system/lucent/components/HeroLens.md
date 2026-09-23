# HeroLens

The signature opening: your name set huge in ink on the dot canvas, with a single liquid-glass lens resting on it and magnifying the letters beneath. On load the lens slides in from the right and settles on the second letter; after that it only moves when someone drags it (or focuses it and uses the arrow keys). It is the one place the kit lets glass be the hero, because here the glass is the idea: a lens over your own work.

**Markup.** `<section class="lu-hero is-lens lu-wall"><div class="lu-hero-inner"><div class="lu-lens-stage"><h1 class="lu-lens-type">Name<br>Surname</h1><div class="lu-lens-glass" tabindex="0" role="img" aria-label="…"></div></div>…</div></section>`. `Lucent.auto()` builds the magnified copy inside the lens. `data-zoom` on the lens sets magnification (default 1.45); `--lens-size` sets its diameter (180px, 120px on phones).

**Do** keep the name to two lines and everything else quiet. **Don't** make the lens follow the cursor or add a second lens.
