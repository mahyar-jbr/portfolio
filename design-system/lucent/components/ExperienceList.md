# ExperienceList

Your roles as one list a recruiter can scan in seconds, newest first. Each row shows a monogram, the role in bold (with a green "Now" tag on the current one), the organisation, and the dates in mono on the right; the row opens to two or three lines on what you did and a few stack tags, and the chevron turns.

Why this shape: recruiters skim, and the layouts that hold their attention have clear headings, bold titles, short bulleted accomplishments and plenty of white space, while multiple columns and long sentences lose them. The collapsed list is the skim; the open row is the read.

**Markup.** `<ol class="lu-exp">` of `<li class="lu-exp-item">`, each with a `button.lu-exp-row[aria-expanded][aria-controls]` (`.lu-exp-mark`, `.lu-exp-main` with `b` and `span`, `.lu-exp-when`, `.lu-exp-chev`) and a `div.lu-exp-detail[hidden]` holding `.lu-exp-detail-inner` with a `ul` and `.lu-exp-stack` tags. `Lucent.auto()` wires the rows.

**Consumer provides** role, organisation, dates, one to three result-first bullets (verb first, a number where you have one), and up to four tags. **Don't** paste the whole resume; link the PDF from ContactTiles. Monograms are letters, not company logos.
