# Portfolio brief: Graph-Native Retrieval for Clinical LLM Agents (update, 2026-11-02)

A copy of the project's own brief (its private repo's `portfolio-assets/PORTFOLIO_BRIEF.md`), built from that repo
at commit `e7f8405` (2026-11-02). It keeps what the site shows and where each fact comes from, under the brief's own
section numbers; sources in brackets are paths in the private repo. The results, their figures, the method's
details and everything private stay there, unpublished until Mahyar clears them.

**Mahyar's direction (2026-11-02):** "lets keep it lowkey and suspicious but market it well as of something very
cool." Read as: a teaser page. It tells the story and hides the specifics. Role: "Student researcher (solo)",
naming only Mahyar (his decision, 2026-11-02).

## 0. Since the site

| On the site in September | Now | Source |
|---|---|---|
| Name: Graph-Native Retrieval for Clinical LLM Agents | Same | [README.md:1] |
| Kind: research; Status: In progress | Still in progress: last commit Nov 2 | [`git log -1`: e7f8405 2026-11-02] |
| Role: Student researcher (solo) | Keep as is. The page names only Mahyar (his decision, 2026-11-02). All 79 commits are his | [`git shortlog -sne --no-merges`: 79, one author] |
| Course, lab, supervisor, timeline | Same: EECS 4070, York Data Mining Lab, Prof. Manos Papagelis, Fall 2026 | [README.md:3-4] |
| Stack: Python, FHIR, LiteLLM, pandas | All four used; also BLAZE (the FHIR server, in Docker), the OpenAI API (through LiteLLM), requests, tiktoken | [a 2026-10-17 run's manifest.json; code/requirements-lock.txt:37,45,62,72; code/src/responses_tools_adapter.py:39] |
| Building: a tool that follows links in one call | Built Oct 15 | [roadmap/ROADMAP.md:186; code/src/expand_tool.py] |
| Building: a test with and without the tool | Done Oct 17, under a plan committed Oct 15 | [commit f1c2e91 (2026-10-15)] |
| 928,935 FHIR records for 100 patients | Same | [results/summaries/2026-10-15_reference_graph.json; notes/findings/2026-10-15_reference_graph.md:22] |
| "No results yet" | Results exist [withheld] | [results/summaries/] |
| 1,489 agent runs | Right, and every one ran under a plan fixed before it ran: the plan, then a dated amendment written before the last runs | [sum over results/2026-10-17_*/manifest.json; notes/preregistration/] |

## Page copy, teaser version (for the live page)

- **Card line:** Why AI agents get lost in health records
- **Status label:** Results under wraps
- **Lede:** Research into why AI agents get lost in linked health records, and the surprisingly small change that
  helped most.
- **Body:**
  > AI agents that answer clinical questions stumble when one health record only points to another, like a
  > prescription pointing to its drug. I built a tool that follows those links for the agent. Then I tested it the
  > strict way: a plan fixed before the main runs, and 1,489 agent runs on a public benchmark. On its own, the tool
  > made no measurable difference. The change that did fits in one sentence. I'm keeping it under wraps until it's
  > confirmed.
- **Facts strip (no results in it):** 1,489 agent runs · 928,935 health records for 100 patients · 2,931 benchmark
  questions · test plan fixed before the main runs
- **Visual:** `card_teaser.png` as the card (section 10).
- **Credits (required, at the foot of the page):** "Contains information from the
  [MIMIC-IV Clinical Database Demo on FHIR (v2.1.0)](https://physionet.org/content/mimic-iv-fhir-demo/2.1.0/), which
  is made available here under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/1-0/).
  Benchmark: [FHIR-AgentBench](https://github.com/glee4810/FHIR-AgentBench) (Lee et al., ML4H 2025)." The licence
  requires this notice when anything made from the data is shown publicly, and the page shows record counts
  [data/mimic-iv-fhir-demo-2.1.0/LICENSE.txt:262-275]. All three links returned HTTP 200 on 2026-11-02.

Every line, against the repo:

| Line | Source |
|---|---|
| Agents stumble when one record only points to another | The benchmark paper's results by question type (Lee et al., ML4H 2025), and the project's count of how prescriptions name their drug [withheld: the figures] |
| I built a tool that follows those links | Built Oct 15 [code/src/expand_tool.py; roadmap/ROADMAP.md:186] |
| A plan fixed before the main runs | Committed Oct 15, and its amendment, each before the runs it covers. Not "before any results": earlier runs came first [commit f1c2e91; notes/preregistration/] |
| 1,489 agent runs on a public benchmark | FHIR-AgentBench is public [sum over results/2026-10-17_*/manifest.json; papers/README.md] |
| On its own, the tool made no measurable difference | The pre-registered test [results/summaries/; withheld: its figures] |
| The change that did fits in one sentence; the surprisingly small change that helped most | An exploratory run [results/summaries/; withheld: what the change is, and its figures] |
| Under wraps until it's confirmed | Unpublished; that run was exploratory |
| 928,935 records for 100 patients; 2,931 questions | Counted from the data and the benchmark's question file [results/summaries/2026-10-15_reference_graph.json] |

Kept true on purpose: "no measurable difference" (not "it failed"), "helped most" (not "fixed it"), "a plan fixed
before the main runs" (not "before any results"), and "until it's confirmed" (that run is exploratory).

## 1. Card

- Name: Graph-Native Retrieval for Clinical LLM Agents [README.md:1]
- Kind: research
- Status: Results under wraps
- Card line: "Why AI agents get lost in health records" (40 characters)
- Year: 2026

## 3. Status and links

In progress: last commit 2026-11-02 [e7f8405]. No deploy. Public links: none; the repo is private.

## 4. Dates and team

First commit 2026-09-23 (ee2d8f3), last 2026-11-02 (e7f8405). 79 commits, all by Mahyar; no merges. Solo project:
the page names only Mahyar (his decision, 2026-11-02).

## 7. Stack

1. Python 3.11 [manifest `python`: 3.11.16]
2. FHIR R4 on BLAZE 1.4.1, in Docker [manifest `fhir_server`, `fhir_version`]
3. FHIR-AgentBench (pinned) [`git submodule status`]
4. LiteLLM 1.75.9 with OpenAI's API [code/requirements-lock.txt:37; code/src/responses_tools_adapter.py:39]
5. requests 2.32.5 [requirements-lock.txt:62]
6. pandas 2.3.2 [requirements-lock.txt:45; code/src/select_questions.py:38]
7. tiktoken 0.8.0 [requirements-lock.txt:72]

## 10. Visuals

No screenshots: research code with no UI. No logo exists in the repo, so none was drawn. `card_teaser.png`
(1600 x 1000) shows the question and the real link from a prescription to its drug: `MedicationRequest` points to
`Patient` through `subject` and to `Medication` through `medicationReference`, FHIR's own field names
[code/src/expand_tool.py:131; notes/findings/2026-10-15_reference_graph.md]. Its alt text begins "A prescription
record points to the patient and to a separate drug record." The site draws that link in ink, for the card and the
page (components/work/RecordLinks.tsx), with that sentence as the page figure's caption.

[withheld: the results and their figures, the method's details, and private material, kept in the private repo until
Mahyar clears them]
