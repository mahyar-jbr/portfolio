# Sheet

A glass panel that grows out of the button that opened it and shrinks back into it on close; the page behind dims and blurs. Use it for a project's quick look, a contact form, or an image.

**Call.** `Lucent.sheet({ from: buttonEl, title: 'BowlWise', content: node | htmlString })` returns `{ close }`. Declaratively: `<button data-sheet="#tpl-bowlwise">Quick look</button>` with `<template id="tpl-bowlwise">…</template>`.

**Behaviour.** Focus moves into the sheet and is trapped there; Esc, the close button or a click on the backdrop closes it; focus returns to the trigger, which wobbles as the panel lands back in it. Page scroll is locked while open.
**Do** give it a heading. **Don't** open a sheet from a sheet.
