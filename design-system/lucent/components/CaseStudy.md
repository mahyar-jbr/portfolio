# CaseStudy

The page behind a project card, built from the layout primitives. It opens with a summary block a skimmer can read in ten seconds (back link, the product's own mark, the name, one sentence, then a meta row of role, status, where it runs, year), then the story in sections whose labels stick to the left while you read, then the next project.

**Structure.** `<section class="case-hero lu-wall">` with `.lu-page` inside, then `<div class="lu-page lu-case">` holding one `<section>` per beat, each `<h2 class="lu-title-sm">` plus its content. The beats, in order: Problem, How it works (`.lu-steps`, three numbered cards), The product (`.lu-shots` with `.lu-shot` figures and one-line captions; `.is-two` for a pair), Decisions (what you chose and what you traded off), Where it is now (`.lu-points`, result first), Milestones (`.lu-timeline`) where dates matter. Close with the next project card.

**Consumer provides** the copy, real screenshots (never mockups of mockups), the live link and the repo link in the meta row. For an unreleased project, swap the screenshots for the stealth card treatment and keep the page short.

**Do** put a number in a point whenever you have one. **Don't** run past six sections, or open with the solution before the problem.
