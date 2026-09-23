# Showcase

How to present the four things this portfolio carries: the opening, projects, experience and drawings. Each rule below comes from how people actually review portfolios; sources are at the end.

## What reviewers do

- They decide in seconds. Users judge a page in its first 10 seconds and either leave or settle in; recruiters give a resume about 7.4 seconds on a first pass, and hold longer on simple layouts with clear headings, bold titles and short bullets, not multiple columns or long sentences.
- They skim, then read one thing. Very few read a portfolio word for word; they pick the one project that matches the job and go deep there.
- So every section has two layers: a skim layer that works in one glance, and a read layer one click away.

## The opening

- Use the page hero (Hero): name, then six properties (role, now, studying, based with local time, status tag, "I draw"), then two actions. It answers who, what, where and available in one glance, in the key and value form people read every day.
- The lens hero (HeroLens) is the alternative when you want one memorable object: the name huge, one glass lens resting on it. Pick one, never both.
- The brand mark sits in the page icon slot and in the nav; its reveal plays once, on first load.

## Projects

- Show three to five. Quality beats quantity; hiring managers report looking for two or three strong case studies. One featured card (`is-feature`) and two beside it.
- The card is the skim layer: a real screenshot, a status label with a glyph, the name, one line on the outcome. Unreleased work uses the stealth card, never a blurred real screenshot.
- The case study is the read layer. Open with a summary block (role, timeline, stack, status, the live link and the repo), then: the problem; your role and who you worked with; the approach and the decisions you made, with the trade-offs; the result, in numbers where you have them; what you would change. Hiring managers now look specifically for why you chose a stack and what you traded off, and for the value created.
- Show the product working: real screenshots in shot frames with one-line captions, and a short silent screen recording where motion explains it better than a still.

## Experience

- Use ExperienceList: one row per role, newest first; the current role carries a "Now" tag. The collapsed list is the skim: role in bold, organisation, dates in mono.
- The open row is the read: two or three bullets, each starting with a verb and ending in a result, plus up to four tags. No paragraphs.
- Don't rebuild the resume on the page; the Resume tile links the PDF.

## Drawings

- Artwork is content. Glass is for the controls floating above content, never for the content itself, so drawings sit on paper mats at their own aspect ratio and are never cropped or tinted.
- Curate 10 to 15 pieces to start, the work you want to be known for; the set is only as strong as its weakest piece. Keep one voice across them; group by series once you have more.
- Every piece gets a title and a one-line note (medium, year, one sentence). Where you have them, add process steps (sketch, line work, final): the lightbox shows them as small steps, because process is what makes a viewer trust the finished piece.
- Serve thumbnails around 800px wide in AVIF or WebP with width and height set, and a large image around 2000px for the lightbox. The gallery keeps left-to-right order by spanning grid rows; native CSS masonry (`display: grid-lanes`) is still rolling out across browsers, so don't depend on it yet.
- The lightbox grows each drawing out of its thumbnail; same-document View Transitions are Baseline since Firefox 144 (October 2025) if you prefer to build that step with them.

## Sources

- [NN/g, How long do users stay on web pages](https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/)
- [HR Dive, Eye-tracking study: recruiters look at resumes for 7 seconds (Ladders, 2018)](https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/)
- [NN/g, 5 steps to creating a UX design portfolio](https://www.nngroup.com/articles/ux-design-portfolios/)
- [UX Design Institute, What hiring managers look for in a UX portfolio](https://www.uxdesigninstitute.com/blog/hiring-managers-ux-portfolio/)
- [SOLTECH, What hiring managers actually look for in a GitHub portfolio](https://soltech.net/what-do-hiring-managers-actually-look-for-in-a-github-portfolio/)
- [Apple, Meet Liquid Glass (WWDC25)](https://developer.apple.com/videos/play/wwdc2025/219/)
- [Rebecca Green, Building an illustration portfolio](https://www.myblankpaper.com/blog/2022/4/28/ntyr5x27r3iz3h667yhow6ev365epc)
- [Format, Illustration portfolio tips](https://www.format.com/magazine/resources/photography/illustration-portoflio-tips)
- [CSS-Tricks, Masonry layout is now grid-lanes](https://css-tricks.com/masonry-layout-is-now-grid-lanes/)
- [web.dev, Same-document view transitions are Baseline](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available)
