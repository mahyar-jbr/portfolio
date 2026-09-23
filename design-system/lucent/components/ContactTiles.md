# ContactTiles

Each way to reach you as a small glass tile with its own glyph instead of a plain text link: an envelope for email (its flap lifts on hover), a contribution grid for GitHub, a profile card for LinkedIn, a page for the resume.

**Markup.** `<div class="lu-contact">` holding `.lu-contact-tile` elements, each with `.lu-contact-glyph` (a 40px inline SVG in `currentColor`), `.lu-contact-label` and `.lu-contact-value`, plus `.lu-contact-go` (the small arrow) on links. The email tile is a button with `data-copy="address" data-toast="Email copied"`; make it `is-primary` (the one ink tile). Links to other sites open in the same tab unless the consumer adds `target`.

**Consumer provides** the address and the three URLs. **Do** keep labels to one word and values to three. **Don't** swap the glyphs for third-party logos drawn by hand; if you want official marks, upload the companies' own SVGs to an asset group and use those.
