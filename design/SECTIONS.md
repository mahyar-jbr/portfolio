# Section Lineup — mahyar-portfolio.dev v2

**Status:** LOCKED pending Mahyar's sign-off on §5 judgment calls.
Supersedes `STRUCTURE.md` § "Information Architecture".
**Date:** 2026-08-08. Graduation: April 2027.

Derived from a 6-lane research sweep (21+ acclaimed engineer portfolios and 3 peer
AI-engineer portfolios fetched and DOM-inspected, hiring-side evidence, anti-pattern
critique, student-specific patterns, 2026 trends), each lane adversarially verified.
**36 claims were killed in verification** — including every unsourced recruiter
statistic. Only surviving claims inform this doc.

---

## 1. The lineup

### Home `/` — one scroll, five sections

```
NAV        Work · Experience · About · Art          [Résumé →]

HERO       AI AGENT & FULL-STACK ENGINEER
           MAHYAR JABERI
           ONE mechanism sentence — leads with the deployment, not the stack
           Availability line (see §3.1)
           [View work] [Résumé] [Email — click to copy]  · GitHub · LinkedIn
           → static rendered agent trace (see §3.2)

01 WORK    BowlWise ───── one line + ≤6 chips + [Live ↗] [Case study →]
           Maridian ───── one line + ≤6 chips + [Live demo ↗] [Case study →]
           MoneyMind ──── one line + ≤6 chips + [GitHub ↗] [Case study →]
           WealthTrack ── one trailing sentence + [GitHub ↗]

02 EXPERIENCE
           Nova Ventures — SWE Intern, Summer 2025 — 2 lines + chips
           Sepantech — App Dev & DB Intern, Summer 2024 — 2 lines + chips
           View full résumé (PDF) ↗

03 ABOUT   4–5 sentences: Pet Valu → BowlWise origin · York / Apr 2027 ·
           what he wants to build next
           → 4 grouped text lines for stack vocabulary (no icons, no bars)

04 CONTACT One positioning line naming the exact ask
           email (copy + mailto) · LinkedIn · GitHub · Résumé
```

### Routes

| Route | Contains | Data status |
|---|---|---|
| `/work/bowlwise` | Problem → Approach → **Key Decisions** → Result · architecture diagram · in-store recording · 4 existing screenshots · private-repo explanation | **Missing from `caseStudies.js` — must be written** |
| `/work/maridian` | + war-story block (the outage) + 6-agent topology diagram + explicit contribution scoping | `decisions[]` + `warStory` exist |
| `/work/moneymind` | + streaming pipeline diagram + why-LangGraph / why-1024-dim | `decisions[]` exist |
| `/art` | 6 units, `Nightmare` first, 4 timelapses, one framing sentence | exists; needs Godfall credit fix (§6.5) |
| `/resume.pdf` | static, stable path, 4 entry points | exists |

**Mandatory on every case study: a named `Key Decisions` block.** Already specced in
`design/CASE_STUDY.md` §04; the content already exists in `caseStudies.js`. All three
independent proposals dropped it in favour of Problem/Approach/Result. Restored — see §6.7.

---

## 2. Settled — do not reopen

| Decision | Why |
|---|---|
| **Work first after the hero** | Best-evidenced verdict in the set. 3/3 peer AI portfolios by DOM. The acclaimed sites that skip projects all substitute a writing practice Mahyar cannot build this cycle. |
| **BowlWise leads Work** | Real users, real hardware, real business, solo, clickable. Beats Maridian's sophistication in a screen. |
| **Homepage stays ONE LINE per project** | Non-negotiable condition attached to having case-study routes at all. |
| **WealthTrack = one trailing line** | Four cards where three are strong reads as padding. |
| **Experience = exactly two rows** | NACE 2026 rates industry internship experience 4.3/5 — one of only two attributes clearing 4.0 of thirteen. Highest measured lever on the page. |
| **Résumé surfaced without hunting** | 3 of 4 among the job-seeking subset of sites. |
| **Availability line in the hero, not the footer** | delba.dev — job-seeking IC, closest situational analogue — puts it immediately after the heading. |
| **Metrics inside sentences, never a counter row** | "2 PetValu stores / 20 endpoints / 61 tests" attached to the thing that earned them. |

**CUT, unanimously:** skills/tech-icon grid · contact form · stats counter row ·
certifications section · testimonials · newsletter · blog · publications · speaking ·
OSS shelf · live "chat with my portfolio" RAG demo · Craft/Lab page · education section.
→ Delete `data/techIcons.js`.

---

## 3. Adjudicated calls

### 3.1 Availability line
Two of three proposals wrote "Open to **Summer 2026** internships." It is **August 2026** —
that term is over. Staleness is the one failure mode with named-practitioner evidence that
it actively costs you. The third proposal's fix was also wrong (Summer 2027 is a new-grad
role, not a co-op term, because he graduates April 2027).

**Ship:**
> Open to Winter 2027 (Jan–Apr) co-op — and new-grad SWE / AI engineering roles from May 2027. Toronto or remote.

**Implementation:** one exported constant in `lib/`, consumed by hero and footer. No other
date-bearing copy anywhere on the site.

### 3.2 Hero signature — static agent trace, NOT the animated swarm
The rendered trace is *content*, not decoration: it demonstrates he knows what a typed agent
contract looks like. No backend, cannot break, cannot rot, ~0 KB of JS.

**Do not build the canvas swarm for v1.** Highest time cost, zero precedent in 21 sites,
against a closing recruiting cycle with nothing yet built. If ambient motion is added later
it must clear a hard gate: <15 KB, pauses off-screen, static frame under
`prefers-reduced-motion`, 60fps on mid-tier Android.

```
1  INTAKE      ingest_defect()  →  DefectReport
2  CLASSIFY    classify()       →  contract: DefectClass · schema: valid
3  RECOMMEND   recommend_action()
4  REVIEW      Reviewed by: Operator · Decision: approved
5  DISPATCH    [ state persisted ]
```

### 3.3 Nav
`Work · Experience · About · Art` + visually distinct **Résumé** → `/resume.pdf`.
No Contact item (hero carries email, footer is the scroll terminus). No wordmark, no theme
toggle, no scroll-progress bar. Experience keeps its nav slot — it maps to the
highest-measured hiring attribute on the page.

### 3.4 Art page size — 6 units, not 10
`artwork.js` is **5 titled standalone pieces + one 5-panel "Godfall" series**, not ten
independent works. The "ten pieces" framing was counting array length. Ship six units; the
series is one entry with five panels.

### 3.5 Video
Zero of three peer AI portfolios ship a `<video>`. BowlWise is the exception for a specific
reason: PetValu will never yield a public URL, so without a recording "live in 2 stores" is
an unbacked assertion. **One video, on `/work/bowlwise`.** Maridian has a live demo URL —
link it, don't film it.

### 3.6 Stack vocabulary
Chips-per-project cannot express what he knows but hasn't shipped *on this site*. Both
DOM-inspected peer AI sites carry grouped text lists with 0 `<img>` and 0 `<svg>`.
The research verdict was **cut the grid, not cut the vocabulary**.

**Ship:** four middot-separated text lines at the foot of About. No heading, no icons, no
bars, no percentages. Everything in it must be something he could be interviewed on.

### 3.7 Contact
A numbered section (`04 Contact`) that *is* the footer band: one written positioning line,
then four links. The written line separates strong instances from weak ones across both
research passes; a bare icon row loses it.

---

## 4. The six required resolutions

**Art gallery → KEEP, MOVE, HALVE.** Becomes `/art`, nav item ordered **last**, appears
**nowhere in the homepage scroll**. Across 18 directly-fetched acclaimed engineer sites,
*not one* puts a non-code creative practice in the homepage scroll; the three serious
engineers who showcase one (shud.in "Images", ped.ro "Shooting", lynnandtonic "Gifs") all
chose a sibling page ordered after the work. Same asset, two placements, opposite outcomes.
As a nav item it costs the proof path zero pixels — downside bounded to "someone clicked
Art"; upside is the only thing on the site another CS co-op applicant cannot replicate by
working harder this semester.
**Kill condition: the moment it becomes a homepage section, this reverses to CUT.**

**Skills section → DEAD as a section. Vocabulary survives** (§3.6). A grid *asserts*
breadth; chips *demonstrate* depth at the same pixel cost.

**About → SURVIVES**, after Experience, hard-capped at 4–5 sentences. It is the only place
two mandatory facts can live (student status, graduation date) and the only place the one
sentence no other applicant can write can live. Verified on brittanychiang, delba,
sarah.dev, elliott.mangham — and uniformly short.

**Contact form → CUT.** 1 of 22 acclaimed sites ships one. Decisive data point: Elliott
Mangham is actively soliciting clients, publishes an availability date, offers a discovery
call — and still ships no form. A form adds a dependency, a spam surface, and a
silent-failure mode in exchange for making a recruiter do *more* work than clicking a
mailto. Render the address in plain text so it survives a screenshot.
→ The Formspree endpoint (`xvgveyqw`) is retired.

**Single-page vs routes → HYBRID, split point moved.** Homepage is one scroll of five
sections; depth lives on four routes. **BowlWise is promoted from card+modal to a full
route** — his strongest asset must not be the one thing with no URL, that cannot be pasted
into an ATS note, forwarded by a recruiter, or indexed. This is a *labeled departure* from
acclaimed practice (paco.me's project blurbs run 6, 9, and 6 words) and is legitimate only
because he has no name recognition. Compensating condition is absolute: **homepage stays
one line per project.**

**Education / Certs / Pet Valu:**
- **Education → one clause in About.** "Honours BA Computer Science (Co-op), York
  University — expected April 2027." No section. **No GPA** — NACE 2026 rates GPA 3.0+ at
  2.9/5, below general work experience, leadership, and extracurriculars. A line spent on
  it is worse than silence.
- **Certifications → résumé PDF only.** Absent from all 22 acclaimed and all 3 peer sites.
  "In progress" on a homepage is a promise, not proof — and placing it beside a live
  production deployment lowers the average.
- **Pet Valu → About + inside `/work/bowlwise`. Never an Experience row.** A retail row
  beside two engineering internships dilutes the strongest measured signal (general work
  experience 3.6 vs industry internship 4.3). But it is not hidden — it is the *lede* of
  About. See §6.9.

---

## 5. Judgment calls — Mahyar's, not the evidence's

1. **Does `/art` ship at all?** Evidence supports *placement*, cannot validate *existence*.
   The only unreplicable thing on the site and a reliable interview opener, versus a bounded
   risk of reading as a creative generalist — bounded because Work and Experience have
   already classified him before anyone clicks. **Recommendation: ship it.** If asked in a
   screen whether he's applying for design roles, demote the nav label; don't redesign.
2. **A photo of himself in About?** The AI-portfolio lane is image-poor, but that's
   survivorship from people already recognizable. **Weak recommendation: one small
   portrait.** Low stakes; don't spend a day on it.
3. **Hero mechanism sentence.** `design/HERO.md` has four drafts; A/D are strongest because
   they carry the deployment. Copywriting judgment — no evidence adjudicates. Pick in one
   sitting.
4. **Publish the Maridian repo?** Hackathon project, four other contributors. Their consent
   is required and only he can get it. High value — see §6.3.
5. **Name the two PetValu stores?** "Live in 2 PetValu stores" is safe. Naming locations is
   more verifiable *and* more falsifiable, and likely needs manager sign-off.
6. **One accent colour in the monochrome system?** Deferred from `STRUCTURE.md`. Taste. If
   used: one hue, one job (links/active state), nowhere else.

---

## 6. Completeness critique — what all three proposals missed

**6.1 Nobody scoped this against a deadline, and the deadline is now.** Winter 2027 co-op
postings open and close roughly August–October 2026. It is August 8. The lineup is 5
surfaces, 3 hand-authored diagrams, 1 video, and 1 unwritten case study — against a tree
containing a 10-line placeholder.
**Ship in two phases.** Phase 1 (~10 days): nav + hero + Work + Experience + About +
Contact + `/work/bowlwise` + résumé + OG card. Phase 2: `/work/maridian`,
`/work/moneymind`, `/art`. A live three-surface site beats a perfect unshipped one, and a
smaller site with no dead links is not a "poor site."

**6.2 Nobody mentioned the OG / link-preview card.** The site's actual distribution channel
is a *pasted URL* — an application form's portfolio field, a LinkedIn DM, a referral Slack
message. In Slack, LinkedIn, and iMessage the first impression is the **unfurl**, not the
page. Zero proposals specified `og:image`. This is an hour of work sitting in front of every
single visit. The OG image must carry the name, the role line, and "Live on customer tablets
in 2 PetValu stores."

**6.3 The verifiability hole: 2 of 4 projects have no readable code.** BowlWise
`github: null`, Maridian `github: null` / `links.code: null`. The most consistently
evidenced reviewer behaviour in the entire research set is *reading the code*
(CharlieDigital, verbatim: "one of my favorite things to do is to look through a candidate's
GH and ask them questions about projects"). He is shipping a portfolio where his two
strongest projects are unreadable. Ranked fixes:
  1. Publish Maridian, with teammate consent.
  2. **Extract BowlWise's AAFCO/NRC/WSAVA scoring engine into a small standalone public repo**
     with a real README and a slice of the 61 tests. Highest-ROI artifact he does not
     currently have — it converts "61 automated tests" from a claim into a clickable fact.
  3. If neither: one explicit line on the case study explaining why the repo is private.
     **Do not ship 3 alone.**

**6.4 The single strongest missing asset is a photograph, not a screen recording.** All three
proposals asked for a screen capture of the tablet flow. A screen recording could be
localhost. **A photo of BowlWise running on the actual customer tablet, in the aisle, in the
store,** cannot be. One shift, one phone, manager's OK. The photo is the proof; the
recording is the walkthrough. Get both; lead the case study with the photo.

**6.5 Godfall's credit line is a self-inflicted downgrade.** `data/artwork.js:106` reads
`exhibition: 'Grade 12 CPT Project'`. Shipping "Grade 12" anywhere on a 2027-grad's
portfolio lowers the read. Drop the credit; keep the work: *"Marker on paper, 2022 —
five-panel series."*

**6.6 The art page has an internal collision.** "Lead with the exhibited piece" and "lead
with a timelapse, because in 2026 static digital art invites *did he actually make this*"
point at different files: `Nightmare` has the Aurora Art Gallery credit and
`hasTimelapse: false`; the four timelapsed pieces have no exhibition.
**Resolution:** `Nightmare` leads with its credit (institutional proof is scarcer), and the
four timelapse pieces carry a visible process-video affordance one row down, so authorship
proof is never more than one scroll away.

**6.7 Every lineup serves the recruiter; none serves the interviewer.** The strongest
qualitative finding in the research is that recruiters largely don't click links —
*hiring managers and interviewers do*, and they use projects as the interview's opening
conversation. That reader needs the **Key Decisions** block, not Problem/Approach/Result.
All three proposals dropped it, though it's already specced and the content already exists
("A multi-agent split instead of one large prompt", "An operator-in-the-loop portal, not
full automation", "1024-dim vector index", "token-by-token streaming end to end").
**That block is the best writing on this entire site and it was about to be cut.**

**6.8 Nova Ventures is the highest-leverage line on the site and the vaguest.** "FastAPI +
React heatmaps" is the least specific sentence in any proposal, attached to the attribute
NACE rates 4.3/5. Needs one concrete artifact or number — what the heatmap displayed, for
whom, at what scale. If nothing is quotable, say what the system was *for*. Do not ship
"built FastAPI services and React heatmaps."

**6.9 Pet Valu is under-used: he is an Assistant Manager.** Every proposal frames Pet Valu as
*problem discovery* ("watched owners fail to pick food"). That's half. The rarer half:
**he had enough standing inside the business to get his own software onto the company's
customer-facing hardware.** That is a leadership fact (NACE 3.5/5) *and* the mechanism that
makes the deployment credible. The About lede should carry both — worked the floor, then
managed it, then built the thing that answers the question he'd been answering by hand, and
it now runs on the store's tablets.

**6.10 Is the lineup leading with the strongest thing? Yes — but sharpen the claim.** The
strongest thing here is not "BowlWise exists" or "he built a multi-agent system." It is that
**he shipped software into a business he worked in, and it is in production use by customers
who have never met him.** Most students' best project is a hackathon demo watched by judges
paid to be there. His has non-consenting real users on real hardware in a real business. The
hero sentence and the BowlWise line should both lead with *the deployment*, not the stack.
Six agents, LangGraph, 1024 dims, a fixed prod outage — all of it is support for the
proposition that this is a person who finishes things and puts them in front of people.

**6.11 Two small gaps.**
(a) `@vercel/analytics` is already a dependency — instrument the routes at launch so he
knows within three weeks whether anyone clicks `/art`, and can cut on data rather than
argument.
(b) The résumé PDF and the site must not contradict each other on dates, titles, or metrics.
Recruiters cross-check; a mismatch is the cheapest possible way to look careless. One diff
pass before launch.

---

## 7. Ownership boundary

| Owner | Files |
|---|---|
| **Design + build (this tab)** | `app/`, `components/`, `lib/`, `design/`, styling, motion, performance |
| **Content (other tab)** | `content/` (typed data files), `CONTENT_DRAFT.md` |

The handoff is a set of TypeScript types defined here and populated there. Contract
violations surface as `npm run typecheck` failures rather than broken layouts.
The content tab does not edit `app/` or `components/`.

**Flag for the content tab:** `data/caseStudies.js` carries `VERIFY` markers — the six-agent
breakdown for Maridian was *inferred by a previous session, not confirmed by Mahyar*. Those
must be verified against the real system before publishing. An unverifiable claim on a case
study is worse than no case study, because it fails in the interview.
