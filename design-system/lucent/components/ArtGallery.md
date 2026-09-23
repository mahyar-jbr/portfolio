# ArtGallery

Your drawings hung on paper: each sits on a white mat with a soft shadow, at its own aspect ratio (never cropped), with a one-line caption under it. The grid packs pieces of different heights while keeping left-to-right order. Opening a drawing grows it out of its thumbnail into a quiet paper room; glass controls float at the top (previous, count, next, close), the caption sits below, and if the piece has process shots they appear as small steps you can flip through. Arrow keys, swipe and Esc work; focus returns to the thumbnail.

Why: artwork is content, and on Apple's own terms glass belongs to the controls floating above content, never on the content itself. The drawing gets a neutral paper ground so its own marks and colours read true, in light or dark.

**Markup.** `<div class="lu-gallery">` of `<figure class="lu-art" data-title="…" data-note="medium, year, one sentence" data-full="large.jpg" data-process='[{"src":"sketch.jpg","label":"Sketch"}]'><button class="lu-art-open" aria-label="Open …"><img src="thumb.jpg" width="…" height="…" alt="…" loading="lazy"></button><figcaption><b>Title</b><span>Ink · 2026</span></figcaption></figure>`. Always give `width` and `height` so the layout holds while images load. `Lucent.auto()` lays it out and wires the lightbox.

**Curate.** Start with 10 to 15 pieces that are the work you want to be known for; the set is only as strong as its weakest drawing. Group by series if you have more. Serve AVIF or WebP thumbnails around 800px wide and a 2000px full image.
