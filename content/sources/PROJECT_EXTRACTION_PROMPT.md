# Project Extraction Prompt

Paste the block below into Claude Code **from inside that project's repo folder**, one project at a time.
It writes a single file, `PORTFOLIO_EXTRACT.md`, at the repo root. Send me that file and I'll turn it into portfolio content.

Run it for: BowlWise · MoneyMind · FGF Sentinel · Tactical DNA.

**Why it's shaped this way:** the June draft of this portfolio invented a plausible-sounding six-agent breakdown that nobody had verified. It read fine and it was fiction. This prompt is built to make that failure mode impossible — every claim is either evidenced by a file path or explicitly labeled as unverified.

---

```
You are doing a factual extraction pass on THIS repository. The output feeds a
portfolio case study that will be published publicly, so accuracy matters more
than completeness, and completeness matters more than polish.

Read the actual code before answering anything. Do not answer from the README
alone — READMEs are aspirational and frequently describe features that were never
finished. Verify against source.

## Absolute rules

1. EVERY factual claim must cite the file path (and line, where it helps) that
   proves it. Format: `claim [src/api/routes.py:40]`.
2. If you cannot verify something from the code, do NOT guess, infer, smooth over,
   or write the plausible version. Write `UNVERIFIED:` and state exactly what you
   could not confirm and where you looked.
3. Count things by counting them, not by estimating. Endpoints, tables, tests,
   collections, models, agents — grep and count, then cite the command or the files.
4. Never round a number up. Never describe something as "production-ready",
   "scalable", "robust", or "optimized" unless there is code that specifically
   demonstrates it — and then cite that code instead of using the adjective.
5. If the repo contradicts itself (README says X, code does Y), report BOTH and
   flag the contradiction. Do not silently pick one.

## Write `PORTFOLIO_EXTRACT.md` at the repo root with these sections

### 1. Identity
- Canonical project name as it appears in the code/package manifest. Note any
  other names used anywhere in the repo (old names, internal codenames, route
  names, deploy names) and where each appears.
- One sentence: what it does, for whom. No marketing language.
- Current status: live / dead / archived / in-development. Cite the evidence
  (deploy config, last commit date, env files, CI status).

### 2. The problem
- What real-world problem does this solve, and for which specific user?
- What did those people do before this existed?
- Where in the repo is this stated (README, docs, comments, issue titles)? If the
  problem is nowhere stated in the repo and you are reconstructing it from what
  the code does, say so explicitly.

### 3. Architecture
- The layers/services and how a request actually flows through them, end to end.
  Trace one real path through the code and cite each hop.
- Every external dependency: databases, APIs, LLM providers, auth providers,
  queues, third-party services. Cite where each is configured/called.
- If there is a data model, list the tables/collections and their purpose.
- If there are AI agents: list EACH ONE by its real name in the code, what it
  does, what tools it can call, and how they are coordinated. This is the section
  most likely to be faked — cite a file for every single agent. If the code has
  fewer agents than the project claims, say that plainly.

### 4. Technical decisions and their rationale
The most valuable section. For each significant choice — architecture, model,
database, framework, retrieval strategy, streaming approach, auth method:
- What was chosen
- What the alternatives were, IF the repo shows evidence of alternatives being
  tried or discussed (commit history, reverted code, comments, ADRs, dead
  branches). Search the git log for this — it is often the only record.
- Why it was chosen, ONLY if the repo actually says why. If the rationale is not
  recorded anywhere, write `RATIONALE NOT IN REPO — ask Mahyar` and move on.
  Do not construct a reasonable-sounding justification. That is exactly the
  failure this document exists to prevent.

### 5. Implementation facts (verifiable numbers only)
Count and cite each: API endpoints (list them by method + path) · database
tables/collections + notable indexes · automated tests (and the command that runs
them) · significant screens/pages/routes · anything else countable and real.
For anything performance-related (latency, cache hit rate, query time, bundle
size, Lighthouse), report the number ONLY if the repo contains the measurement —
a benchmark, a test, a logged result, a committed report. Otherwise:
`NO MEASUREMENT IN REPO`.

### 6. Results and evidence
- What actually shipped and to whom. Real users? Real deployment? Cite the
  deploy config, analytics integration, or anything showing real usage.
- Any measured outcome, with its source.
- Awards, placements, demos, presentations, if recorded in the repo.

### 7. Contribution
- If this was a team project: who did what, based on git history. Run
  `git shortlog -sne` and `git log --author` analysis. Report Mahyar's actual
  commit footprint — which subsystems, roughly what share, which files he owned.
- Be honest. If the history shows he wrote less of something than a "lead" title
  implies, say so. It is better to find that here than in an interview.

### 8. War stories
Search git history for incidents worth telling: production bugs, outages, painful
debugging, significant refactors, reverted approaches. Look for commit messages
with fix/hotfix/urgent/revert/broken/finally, and for unusually large or
unusually late-night commits. For each: what broke, how it was diagnosed, what
the fix was, and the commits that prove it.

### 9. Publishable assets
Inventory what exists for a case-study page: screenshots · recordings/GIFs ·
architecture diagrams · sample data or example outputs · logos/branding.
Give file paths. Note anything that LOOKS presentable but shows placeholder,
dummy, or test data — flag it, since it can't be published as-is.

### 10. Do-not-publish list
Flag anything that must NOT appear publicly: secrets, API keys, credentials,
internal URLs, customer names, employer-confidential material, personal data,
real user records, anything under an NDA, unlicensed third-party assets.
Also flag anything embarrassing that a visitor could find by following a link
you'd otherwise recommend publishing — dead deploys, broken demos, stale data.

### 11. Open questions for Mahyar
List every `UNVERIFIED:` and `RATIONALE NOT IN REPO` from above as a numbered
list of direct questions. This becomes his to-do list, so make each one specific
and answerable in a sentence.

Do not write the case study itself. Do not write marketing copy. Do not fill
gaps with reasonable assumptions. Gaps are the most useful output of this pass.
```

---

## Notes per project

- **BowlWise** — the only live one, so §6 matters most. Verify the June claims before I reuse any: 20 endpoints, 4 collections, 61 tests, 2 PetValu stores, and the older unverified set (100-point scoring algorithm, 150 products / 6 brands, 95 Lighthouse, PIPEDA/CASL, CI/CD).
- **MoneyMind** — §3 agent list and §5 are the priority. Verify the 1024-dim vector index and the streaming path. Note this was the **Google + MongoDB** hackathon (June's draft said "Google Cloud Agent Hackathon" — needs correcting). Run this on the hackathon repo; run it again on the production version with Kasra when that's closer.
- **FGF Sentinel** — §1 (the name), §3 (the *real* agents — the six-agent breakdown currently on file is invented), §9 (assets, since the demo is dead), and §10 (this is now your employer — check what's publishable).
- **Tactical DNA** — different shape: §2 becomes the research question, §4 becomes methodology, and §6 becomes **what you actually found**. The finding is the headline, not the tech stack.
