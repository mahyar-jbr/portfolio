# PORTFOLIO_EXTRACT.md

Factual extraction pass over this repository. Every claim below is cited to the file
that proves it. Anything I could not verify from the code is marked `UNVERIFIED:`.
Rationale that is not recorded anywhere in the repo is marked
`RATIONALE NOT IN REPO — ask Mahyar` rather than reconstructed.

Extraction date: 2026-08-08. Repo state: `main` @ `b300747`, working tree clean.

---

## 1. Identity

**Canonical name: "Tactical DNA".**
- There is **no package manifest** — no `setup.py`, `pyproject.toml`, `package.json`, or
  any file carrying a project `name` field. The only dependency file is
  `requirements.txt`, which lists 9 pinned packages and no project metadata
  [requirements.txt].
- The name appears as the report/README title: "Tactical DNA — Coaches, Styles, and
  Player Roles from Football Passing Networks" [README.md:1], and as the paper title
  "Tactical DNA: Coaches, Styles, and Player Roles from Football Passing Networks"
  [final-report.pdf, page 1].
- Git remote slug: `tactical-dna` — `https://github.com/mahyar-jbr/tactical-dna.git`
  [`git remote -v`], also hardcoded as a link on the closing slide
  [src/deck_template.py:582-584].

**Other names / internal codenames used in the repo:**

| Name | Where it appears | What it refers to |
|---|---|---|
| `EECS 4414 Information Networks — Final Project` | [README.md:3] | Course framing |
| `Phase 0 / Phase 1 / Phase 2 / Phase 3` | [src/phase0_scope.py:1], [src/build_networks.py:1], [src/features.py:1], [src/phase3_p1.py:1] | Original build stages |
| `P1 / P2 / P3` | [README.md:15-27], [src/problem2_cluster.py:1], [src/problem3_roles.py:1] | The three research problems |
| `SYNC 1`, `SYNC 2` | [src/phase0_scope.py:31], [src/phase3_p1.py:20] | Undocumented decision-checkpoint markers referencing scope decisions |
| `Saturday` | [src/download_worldcups.py:2], `outputs/saturday_pipeline.log` | A work session, used as a filename |

**Naming drift worth knowing:** the Problem-1 modelling code lives in a file named for
the *phase*, not the problem — `src/phase3_p1.py` contains the P1 coach classifiers
[src/phase3_p1.py:1-10]. `src/transfer_test.py` and `src/transfer_test_multi.py` are
*experiments*, not automated tests [src/transfer_test_multi.py:1-20].

**One sentence:** It builds directed weighted passing networks from StatsBomb open
football event data and uses their structural features for three inference tasks —
predicting a team's head coach, clustering matches into tactical archetypes, and
embedding players into a structural role space [README.md:6-13].

**For whom:** No user, customer, or audience is named anywhere in the repo other than
the course. The report frames applications as "opponent scouting, recruitment (finding
players who fill a structural role)" [final-report.pdf §1], but no user of the system
exists in code.

**Current status: complete academic coursework, archived, not deployed.**
- 2 commits total, both by Mahyar Jaberi, dated 2026-06-09 [`git log`]. Working tree
  clean; `main` is in sync with `origin/main` [`git status -sb`].
- No CI config (no `.github/`, no workflow files), no Dockerfile, no deploy config, no
  `.env` / env-var configuration of any kind — verified by full file listing and by
  `git ls-files` (69 tracked files, all source/outputs/PDFs).
- Nothing runs as a service. Every entry point is a `python src/<script>.py` batch job
  [README.md §4].
- The only "shipped" artifact is a self-contained HTML slide deck,
  `outputs/viz/presentation.html`.

---

## 2. The problem

**Stated in the repo, explicitly.** This is not reconstructed.

- **Problem:** football tactical language ("possession football", "gegenpressing", "a
  coach's style") is debated qualitatively but almost never measured
  [final-report.pdf §1 Introduction and Motivation; README.md:6-9].
- **Gap claimed:** prior passing-network work is *descriptive* — it characterises one
  team or a few matches rather than using network signatures as features for
  higher-level inference [final-report.pdf §1].
- **Central hypothesis under test:** "a coach imposes a reproducible structural
  signature on a team's passing, one strong enough to be recovered by a classifier and,
  potentially, to persist when the coach changes clubs" [final-report.pdf §1].
- **Specific user:** none named. The nearest thing is the speaker-facing framing in
  [outputs/viz/PRESENTATION_NOTES.md §1], which is aimed at a course audience.

**What people did before:** `UNVERIFIED:` The repo states that prior work is descriptive
and cites references [2,4,5,6,9] in [final-report.pdf §1], but I cannot read the
bibliography reliably from the PDF text layer with the tooling available here (no
`pdftotext`/`poppler` on this machine — PDF text was recovered by decompressing raw
streams, which loses the reference list formatting). No baseline tool, workflow, or
competitor product is described anywhere in the repo.

---

## 3. Architecture

**There are no services, no server, no request path.** This is a batch pipeline of
standalone Python scripts writing files to disk. Tracing the one real end-to-end path:

1. **Scope lock.** `phase0_scope.py` calls `competitions()` and `matches()`, filters
   La Liga (`competition_id == 11`) seasons with ≥ 10 Barça matches, and writes
   `outputs/phase0_scope.json` [src/phase0_scope.py:34, 175-200]. Result: 16 seasons,
   517 Barça matches; 1973/1974 (1 match) and 2004/2005 (7 matches) dropped
   [outputs/phase0_scope.json].
2. **Fetch + cache.** Every StatsBomb call goes through `sb_cache.py`, which writes the
   downloaded JSON under `cache/` and reads from disk on every later run
   [src/sb_cache.py:1-12, 60-102]. Four cached resource types: competitions, matches,
   events, lineups [src/sb_cache.py:29-36].
3. **Network build.** `build_networks.build_network()` reads the 11 starters, cuts the
   event stream at the **first substitution by either team**, keeps only completed
   open-play Barcelona passes between starters, and emits an 11-node directed weighted
   `nx.DiGraph` [src/build_networks.py:118-232]. Written to
   `cache/networks/match<ID>.json` [src/build_networks.py:235-249].
4. **Feature extraction.** `features.extract(G)` computes 8 global metrics, 20
   centrality summary statistics (mean/var/skew/Gini over 5 centrality distributions),
   and 16 normalised triadic-census motif fractions → `outputs/features.csv`
   [src/features.py:118-215, 218-240].
5. **Corpus merge.** `merge_corpus.py` concatenates Barça + Bayern + World Cup feature
   matrices and adds `team`/`competition`/`coach`/`source` columns →
   `outputs/features_all.csv` [src/merge_corpus.py:30-72].
6. **Analysis.** Three consumers read those CSVs: `phase3_p1.py` (P1 supervised),
   `problem2_cluster.py` (P2 clustering), `problem3_roles.py` (P3 player embedding).
7. **Presentation.** `build_viz.py` re-uses the *already-exported* embedding coordinates
   (`p2_embedding_coords.csv`, `p3_embedding_coords.csv`) to build Plotly HTML without
   recomputing any embedding [src/build_viz.py:5-20]; `build_deck.py` inlines
   `plotly.min.js` and `deck_data.json` into `outputs/viz/presentation.html`
   [src/build_deck.py:23-40].

**External dependencies (complete list):**

| Dependency | What it is | Where configured/called |
|---|---|---|
| StatsBomb Open Data (free tier) | The only data source; public GitHub mirror | [src/sb_cache.py:19-26, 60-102] via `statsbombpy==1.18.0` [requirements.txt:1] |
| `networkx` 3.6.1 | Graph construction + all network metrics | [src/features.py], [src/build_networks.py] |
| `scikit-learn` 1.8.0 | LR, RF, CV, k-means, Ward, PCA, kNN, scaling | [src/phase3_p1.py:44-51], [src/problem2_cluster.py:33-36] |
| `xgboost` 3.2.0 | Third classifier, optional | [src/phase3_p1.py:53-63] — wrapped in try/except, skipped if import fails |
| `umap-learn` 0.5.12 | 2-D projection for P2 and P3 | [src/problem2_cluster.py:305], [src/problem3_roles.py:334] — both inside try/except |
| `matplotlib` 3.10.9 | All static PNGs, forced `Agg` backend | [src/phase3_p1.py:40-42] |
| `plotly` | Interactive HTML + inlined JS in the deck | [src/build_viz.py:29], [src/build_deck.py:20-21] |

**No databases. No LLM providers. No auth providers. No queues. No third-party APIs
beyond StatsBomb.** Verified by scanning all imports across `src/*.py` and by a secret
scan for `api_key|secret|password|token|Bearer|AKIA|PRIVATE KEY` — zero hits in
`src/`, `README.md`, or the presentation notes.

**⚠️ `plotly` is imported by [src/build_viz.py:29] and [src/build_deck.py] but is NOT
in [requirements.txt].** A fresh install per the README instructions cannot run the
visualisation scripts. `kaleido` (the plotly static-image writer whose binaries are
present in `.venv/bin/`) is also absent from requirements.

**Data model (filesystem, not a database):**

| Store | Count | Purpose |
|---|---|---|
| `cache/competitions/` | 1 file | StatsBomb competition list [src/sb_cache.py:60-67] |
| `cache/matches/` | 23 files | Per (competition, season) match lists [src/sb_cache.py:69-77] |
| `cache/events/` | 647 files | Raw per-match event JSON [src/sb_cache.py:79-88] |
| `cache/lineups/` | 647 files | Per-match lineups [src/sb_cache.py:90-102] |
| `cache/networks/` | 517 files | Built Barça networks |
| `cache/networks_wc/` | 256 files | Built World Cup networks (both teams per match) [src/build_worldcup.py:96] |
| `cache/networks_bayern/` | 2 files | Built Bayern 2015/16 networks [src/build_bayern.py:36] |

(Counts from `ls | wc -l` per directory. `cache/` is gitignored [.gitignore:5] and is
**not** in the published repo.)

**AI agents: there are none.** No LLM call, no agent framework, no tool-calling loop,
no prompt anywhere in the repo. The project makes no such claim. Verified by import
scan across all 17 `src/*.py` files and a grep for `openai|anthropic|langchain|llm|
prompt|agent` — no hits.

---

## 4. Technical decisions and their rationale

The git history is **2 commits**, so it records essentially nothing about alternatives.
Where rationale exists it is in module docstrings and inline comments, which this
project uses heavily and specifically labels "documented for the report".

| Decision | What was chosen | Alternatives evidenced in repo | Recorded rationale |
|---|---|---|---|
| Network unit | One directed weighted graph per **team-match**, fixed at **exactly 11 nodes**, built from events strictly before the **first substitution by either team** [src/build_networks.py:129-232] | The docstring notes it considered the *team's own* first sub and rejected it as less conservative [src/build_networks.py:36-40] | **Recorded.** "the most conservative window where all 22 starters are on the pitch" [src/build_networks.py:38-39]; and motif/centrality statistics are size-sensitive, "which we neutralize by fixing \|V\| = 11" [final-report.pdf §4.4] |
| Edge distance | `distance = 1/weight` for betweenness and weighted ASPL [src/features.py:104-110] | — | **Recorded.** "in a passing network more passes = stronger tie = shorter path. Using the raw weight as distance would be semantically backwards" [src/features.py:33-35] |
| ASPL scope | Computed on the largest strongly-connected component, with `scc_size` recorded [src/features.py:113-127] | — | **Recorded.** 13 of 517 networks are not strongly connected (verified by counting `strongly_connected == 0` in `outputs/features.csv`); computing on the LSCC keeps those auditable [src/features.py:36-39] |
| Eigenvector centrality | Computed on the **undirected** weighted graph via the numpy solver [src/features.py:176-197] | The power-iteration variant and the directed solver were both tried and rejected | **Recorded.** "for directed graphs that are not strongly connected (13 sparse networks here) the numpy solver returns a non-real / NaN dominant eigenvector… this is the convention used in most passing-network studies" [src/features.py:176-183] |
| Coach ground truth | Per-**match** date-aware labels; 2019/20 split at 2020-01-13 [src/phase3_p1.py:66-93, 107-119] | A per-season label was considered and rejected | **Recorded.** "a per-season label would mis-assign 19 Setien matches, so we label per match instead → a cleaner, more correct ground truth" [src/phase3_p1.py:32-34] |
| Evaluation | Both stratified-random 5-fold **and** season-grouped `StratifiedGroupKFold` [src/phase3_p1.py:288-303] | — | **Recorded.** "random folds let same-season matches leak across train/test, partly measuring 'which season' instead of 'which coach'… a leakage-free lower bound" [src/phase3_p1.py:289-293] |
| Models | LR + RF, both `class_weight="balanced"`; XGBoost with inverse-frequency sample weights [src/phase3_p1.py:158-190] | — | **Partially recorded.** The imbalance handling is explained [src/phase3_p1.py:139-145]. **RATIONALE NOT IN REPO — ask Mahyar** why these three model families and not, e.g., an SVM or a GNN |
| XGBoost threading | `n_jobs=1, nthread=1`, and `OMP_NUM_THREADS=4` set before numpy import [src/phase3_p1.py:36-38, 176-180] | — | **Recorded.** "On macOS, XGBoost's OpenMP pool combined with already-initialised numpy/BLAS threads can deadlock under repeated CV fits" [src/phase3_p1.py:176-179] |
| k selection (P2) | k = argmax of the **mean** silhouette across k-means and Ward, over k = 2..10 [src/problem2_cluster.py:66-88, 158-163] | Ward was run alongside k-means at every k; k-means won on silhouette at the chosen k [src/problem2_cluster.py:166-175] | **Partially recorded.** The elbow + silhouette procedure is documented [src/problem2_cluster.py:14-18]; **RATIONALE NOT IN REPO — ask Mahyar** why the *mean across two methods* rather than picking one method's curve |
| Projection | Both PCA and UMAP reported, never just one [src/problem3_roles.py:322-340] | — | **Recorded** in the report: "UMAP preserves local structure better than PCA but is harder to interpret, so we report both throughout" [final-report.pdf §5.7] |
| P3 resumability | Append-only `outputs/p3_appearances.jsonl` checkpoint; heavy libs imported lazily; slim hand-rolled JSON readers instead of statsbombpy DataFrames [src/problem3_roles.py:47-50, 155-160, 236-262] | The statsbombpy DataFrame path was the original and was replaced | **Recorded.** "Avoids building the full ~80-column statsbombpy DataFrame (which causes swapping on this low-memory machine)" [src/problem3_roles.py:155-158] |
| Own cache layer | Custom JSON cache rather than statsbombpy's built-in caching [src/sb_cache.py:8-11] | statsbombpy's own optional caching, explicitly bypassed | **Recorded.** "because the progress report needs the raw event JSON to be auditable and because we want exact control over what is on disk" [src/sb_cache.py:8-11] |
| Atomic cache writes | Per-PID temp filename then `replace()` [src/sb_cache.py:44-57] | A shared `.tmp` name (the bug this fixes) | **Recorded.** "so concurrent writers (e.g. a background download running while another script reads/writes the cache) cannot consume each other's .tmp file" [src/sb_cache.py:44-46] |
| Reproducibility | `RANDOM_STATE = 42` across CV, k-means `n_init=10`, RF, XGBoost, PCA, UMAP [src/phase3_p1.py:66], [src/problem2_cluster.py:31], [src/problem3_roles.py:60] | — | **Recorded** [README.md §6] |

**Not recorded anywhere — `RATIONALE NOT IN REPO — ask Mahyar`:**
1. Why FC Barcelona specifically as the training club (the report says the open data
   makes it the only viable choice [final-report.pdf §4.4(iii)], but the *decision* is
   not discussed).
2. Why `MIN_APPEARANCES = 5` for P3 player inclusion [src/problem3_roles.py:61].
3. Why `MIN_MATCHES_PER_SEASON = 10` for the season filter [src/phase0_scope.py:34].
4. Why `n_neighbors=15` for the modularity kNN graph [src/problem2_cluster.py:104] and
   `n_neighbors=20` (P2) vs `15` (P3) for UMAP.
5. Why Plotly for the deck rather than reveal.js / PDF slides.

---

## 5. Implementation facts (verifiable numbers only)

**API endpoints: 0.** There is no web server, no route table, no HTTP handler anywhere
in the repo.

**Database tables / collections: 0.** All persistence is JSON and CSV files on disk
(inventory in §3).

**Automated tests: 0.** There is no test framework — `pytest` and `unittest` do not
appear in `src/` or `requirements.txt`, and no `test_*.py` file exists. There is **no
command that runs tests**. The two files with "test" in the name
(`src/transfer_test.py`, `src/transfer_test_multi.py`) are cross-context transfer
*experiments* [src/transfer_test_multi.py:1-20]. The only in-code verification is **8
`assert` statements** across `src/*.py` (`grep -c "assert "`), e.g. the triad census
summing to C(11,3)=165 [src/features.py:213] and the 11-node invariant
[src/build_networks.py:228], [src/build_worldcup.py:81], [src/build_bayern.py:73].

**Source size:** 17 Python files in `src/`, **4,196 total lines** (`wc -l src/*.py`).
69 files tracked by git (`git ls-files | wc -l`).

**⚠️ Contradiction:** [README.md:35] says `src/` contains **14 Python files**; there are
**17**. The three missing from the README's tree are `build_viz.py`, `build_deck.py`,
and `deck_template.py` — i.e. the entire presentation layer is undocumented in the
README structure section.

**Corpus counts (all verified by counting):**

| Thing | Count | Verification |
|---|---|---|
| Barça networks | 517 | 517 files in `cache/networks/`; 517 data rows in `outputs/features.csv` |
| World Cup networks | 256 | 256 files in `cache/networks_wc/`; [outputs/wc_build.log] |
| Bayern networks | 2 | 2 files in `cache/networks_bayern/` |
| **Full corpus** | **775** | 775 rows × 54 cols in `outputs/features_all.csv`; [outputs/merge.log] |
| Distinct teams | 42 | [outputs/merge.log]: 40 national teams + Barcelona + Bayern |
| Distinct national teams | 40 | [outputs/wc_build.log] (32 per World Cup, 40 unique) |
| La Liga seasons | 16 | [outputs/phase0_scope.json] |
| Coach classes | 8 | [src/phase3_p1.py:95-96] `COACH_ORDER` |
| Players embedded (≥5 starts) | 271 | 271 data rows in `outputs/player_roles.csv` |
| P3 appearance records | 775 lines | `outputs/p3_appearances.jsonl` (one per network) |
| Feature CSV columns | 50 | `head -1 outputs/features.csv` |
| **Modelling features** | **44** | 20 centrality + 16 motif + 8 global [src/phase3_p1.py:121-133] — the other 6 columns are ids/metadata (`match_id`, `season`, `date`, `n_nodes`, `scc_size`, `strongly_connected`) |

**⚠️ Contradiction:** the presentation says "a 50-dimensional fingerprint in three
families: 20 centrality… 16 motif… and 8 global" [outputs/viz/PRESENTATION_NOTES.md,
Slide 6]. 20 + 16 + 8 = **44**, not 50. The 50 is the CSV's column count including
metadata. [src/problem2_cluster.py:5-6] correctly states 44.

**Screens / pages / routes:** 1 HTML deck of **14 slides**
(`grep -c '<section class="slide' src/deck_template.py` → 14; corroborated by
[outputs/viz/PRESENTATION_NOTES.md:3] "14 slides · target 8:00"), plus 3 standalone
interactive HTML pages: `p2_umap_interactive.html`, `p3_umap_interactive.html`,
`clasico_network.html` [src/build_viz.py:19].

**Measured results committed to the repo** (these are model-quality measurements, not
performance measurements):

| Metric | Value | Source |
|---|---|---|
| P1 majority baseline accuracy | 0.26305609 | [outputs/phase3_p1_results.csv] |
| P1 random-CV accuracy | RF **0.35780**, XGB 0.29785, LR 0.24374 | [outputs/phase3_p1_results.csv] |
| P1 season-grouped accuracy | XGB 0.25569, RF **0.24984**, LR 0.18688 | [outputs/phase3_p1_results.csv] |
| P1 ablation (RF) | centrality 0.32115, motifs 0.24184, combined 0.35780 | [outputs/phase3_p1_results.csv] |
| Transfer recovery (mean of 3 models) | Guardiola@Bayern 0.000 (n=2), L.Enrique@Spain 0.4167 (n=4), Martino@Mexico 0.1111 (n=3) | [outputs/transfer_multi.csv] |
| P2 partition | k=2, k-means, sizes 227 / 547 over 774 networks | [outputs/p2_cluster_quality.csv], [outputs/p2_cluster_samples.txt] |
| P2 quality | silhouette 0.24472, modularity 0.31194, intra 5.7248 / inter 6.8310 (ratio 1.1932) | [outputs/p2_cluster_quality.csv] |
| P3 position purity (k=5) | raw 0.88266, UMAP-2D 0.86494, PCA-2D 0.68044, random baseline 0.29497 | [outputs/p3_position_purity.csv] |
| P3 PCA 2-D explained variance | 63% | [outputs/p3_run.log] |
| Median first-sub minute (window length) | 50' | [outputs/phase1_run.log] |
| Median completed open-play passes / network | 309 | [outputs/phase1_run.log] |
| Mean network density (all 517) | 0.71382 | [outputs/summary_stats.csv] |
| Low-sample networks | 16 of 517 with <100 passes; 5 with <50 | verified by counting `outputs/features.csv`; matches [final-report.pdf §4.4(iv)] |

**Note on the P2 count:** 775 networks were built, but **774** were clustered — one
degenerate World Cup network with an undefined (NaN) ASPL is dropped
[src/problem2_cluster.py:120-133]. `outputs/p2_embedding_coords.csv` has 774 data rows,
confirming this.

**Note on rounding:** README reports RF random-CV as `0.358`; the committed value is
`0.35780`. README reports season-grouped RF as `0.250`; committed value `0.24984`.
Both are ordinary rounding, but the exact values are above.

**Performance (latency, throughput, memory, bundle size, Lighthouse):
`NO MEASUREMENT IN REPO`.** [README.md §6] gives wall-clock *estimates* ("~1 min",
"~1–2 min", "~10–15 min") with no benchmark, timing harness, or logged timing output
backing them. `outputs/*.log` contain no timings. The only measured size is the deck
itself, printed at build time [src/build_deck.py:37-38]; on disk
`outputs/viz/presentation.html` is 4,968,480 bytes.

---

## 6. Results and evidence

**What shipped, and to whom:** a course submission. Concretely, the repo contains:
- `final-report.pdf` (1.34 MB), `midterm-report.pdf` (0.99 MB), `proposal.pdf`
  (0.42 MB) — all tracked in git.
- `outputs/viz/presentation.html` — a 14-slide offline deck with live interactive
  charts and a built-in speaker timer [src/build_deck.py:5-9].
- A public GitHub repository at `github.com/mahyar-jbr/tactical-dna`
  [`git remote -v`], linked from the closing slide [src/deck_template.py:582].

**Real users / deployment / analytics: none.** No hosting config, no analytics
integration, no telemetry, no usage logging exists in the repo. `UNVERIFIED:` whether
the presentation was actually delivered to an audience — [outputs/viz/PRESENTATION_NOTES.md]
is written as *preparation* ("Test before you present"), which is evidence of intent,
not of delivery.

**Measured outcomes** — the headline findings, all sourced above in §5:
1. Coach identity is only modestly recoverable (RF 0.3578 vs 0.2631 baseline), and the
   gain largely disappears under leakage-free season-grouped CV (0.2498)
   [outputs/phase3_p1_results.csv].
2. The cross-context transfer test points the same way: Guardiola's Bayern networks are
   recovered 0/2 by all three models [outputs/transfer_multi.csv]. The report's
   conclusion is that the signature is "largely bound to the club and its roster rather
   than to the coach" [final-report.pdf, Abstract].
3. Unsupervised clustering finds a single dominant possession-vs-direct axis at k=2
   [outputs/p2_cluster_quality.csv].
4. The player-role embedding recovers on-pitch position at 0.883 purity among 5 nearest
   neighbours vs a 0.295 random baseline [outputs/p3_position_purity.csv].

This is a **negative-result-forward project** — the honesty is the finding, and both the
report abstract and the speaker notes lead with it
[outputs/viz/PRESENTATION_NOTES.md §1].

**Awards, placements, grades, demos: nothing recorded in the repo.** `UNVERIFIED:` no
grade, mark, feedback, or award appears in any tracked file.

---

## 7. Contribution

**This is a solo project.** `git shortlog -sne --all`:

```
     2	Mahyar Jaberi <jaberi.mahyar@gmail.com>
```

One author, two commits, 100% of the 69 tracked files. There is no team, no
co-authorship, no "lead" title to check against reality.

**Caveat on the git history as evidence:** the history is *not* a development record.
Both commits land on 2026-06-09 — commit `3daf493` ("Tactical DNA: passing-network
analysis, code, report, and interactive presentation") imports the entire finished
project at once, and `b300747` adds a single link to the closing slide. All actual
development happened before git initialisation (`.git/HEAD` dated 2026-06-09, while
source files are dated from 2026-05-13 through 2026-06-09 on disk, and
`outputs/phase1_run.log` is dated 2026-05-29). **Git history cannot substantiate what
was built when.** The run logs in `outputs/*.log` are the better chronological record.

---

## 8. War stories

With only 2 commits, no incident is recoverable from commit messages — there is no
`fix`, `hotfix`, `revert`, or `broken` commit to find. Every incident below is instead
proved by a **run log plus the code comment that fixed it**, which in this repo is a
reliable pairing.

**1. One match silently lost to a StatsBomb lineup mis-tag.**
`outputs/phase1_run.log` records `Built 516/517 networks (1 failed/skipped)` with
`match 70294 (2012/2013): lineups gave 2 starters, expected 11`. The diagnosis is in the
code: that match's lineups mis-tag starters as "Tactical Shift"
[src/build_networks.py:97-104]. The fix falls back to the `Starting XI` event's
`tactics.lineup`, which "is authoritative and always has exactly 11"
[src/build_networks.py:80-88, 105-113]. **Proof it worked:** `outputs/phase1_build_log.csv`
now shows 517/517 built, with the `starter_source` column reading `lineups` for 516
networks and `starting_xi_event` for exactly 1.

**2. Eigenvector centrality returned NaN / non-real values.**
The numpy solver produces a non-real dominant eigenvector on directed graphs that aren't
strongly connected — 13 of the 517 networks [src/features.py:176-183], a count I
confirmed by counting `strongly_connected == 0` rows in `outputs/features.csv`. Fixed by
computing eigenvector centrality on the undirected weighted graph, with a per-component
fallback behind a try/except [src/features.py:184-197]. A related warning survives in the
World Cup build: `RuntimeWarning: k >= N - 1 for N * N square matrix` from networkx
[outputs/wc_build.log].

**3. macOS thread-pool deadlock under repeated CV fits.**
XGBoost's OpenMP pool colliding with already-initialised numpy/BLAS threads deadlocked
sequential CV runs [src/phase3_p1.py:176-179]. Two-part fix: `OMP_NUM_THREADS` and
`OPENBLAS_NUM_THREADS` pinned to 4 **before** numpy/sklearn/xgboost import
[src/phase3_p1.py:31-38], and XGBoost forced single-threaded with `n_jobs=1, nthread=1`
[src/phase3_p1.py:180-186].

**4. Memory pressure forced a rewrite of the P3 data path.**
The P3 walk over 775 networks originally built full statsbombpy DataFrames and caused
swapping [src/problem3_roles.py:155-158]. Three changes: hand-rolled slim JSON readers
that pull only pass coordinates and starting positions
[src/problem3_roles.py:160-185, 191-213]; matplotlib/sklearn/umap imported lazily inside
the functions that need them, so the accumulation loop runs with a minimal footprint
[src/problem3_roles.py:47-50]; and an append-and-flush `p3_appearances.jsonl` checkpoint
so an interrupted run resumes [src/problem3_roles.py:236-262]. The checkpoint is
committed and holds all 775 networks, which is why P3 reproduces without raw events
[README.md §4 Path A].

**5. Two processes racing on the same cache temp file.**
`sb_cache._write_json` uses a per-PID temp filename before the atomic rename,
specifically so "a background download running while another script reads/writes the
cache" cannot consume the other's `.tmp` file [src/sb_cache.py:44-57]. That background
download is real — `download_worldcups.py` is documented as a background pre-download
[src/download_worldcups.py:1-8].

**6. Degenerate networks with undefined features.**
Very early substitutions leave windows so short that the graph is disconnected and ASPL
is undefined — the example named in code is "Iran WC2022 with 2 passes"
[src/problem2_cluster.py:120-127]. Handled by dropping non-finite rows before clustering
and reporting the count, which is why P2 runs on 774 of 775 networks.

**7. A stale contradiction left in the scope script.**
`phase0_scope.py` prints "No Bayern Munich season in the FREE StatsBomb data ⇒ Guardiola
Barça→Bayern transfer experiment is NOT supported by free data (final-report caveat)" if
its Bundesliga scan comes up empty [src/phase0_scope.py:114-118] — while the same
function hardcodes `"bayern_bundesliga_2015_16": True` with the comment "verified above"
[src/phase0_scope.py:196]. The committed `outputs/phase0_scope.json` has `True`, and the
Bayern networks exist, so the experiment *was* supported. The pessimistic branch is dead
code that would print a false statement if it ever fired.

---

## 9. Publishable assets

**Figures generated from real data — safe to publish:**

| File | What it shows |
|---|---|
| `outputs/example_network.png` | The 2010-11-29 Barça 5–0 Real Madrid passing network, nodes sized by PageRank [src/summarize_phase2.py:6-9] |
| `outputs/confusion_matrix.png` | P1 out-of-fold confusion matrix, 8 coaches [src/phase3_p1.py:352-378] |
| `outputs/p2_umap.png`, `outputs/p2_umap_hires.png` | P2 cluster UMAP with landmark annotations |
| `outputs/p2_elbow_silhouette.png` | Elbow + silhouette curves for k selection |
| `outputs/p3_umap.png`, `outputs/p3_umap_hires.png`, `outputs/p3_pca.png` | P3 player-role embedding, coloured by position line |
| `outputs/transfer_multi.png`, `outputs/transfer_test.png` | Cross-context recovery bar charts |

**Interactive HTML (offline, no CDN for the charts):**
`outputs/viz/p2_umap_interactive.html` (4.9 MB), `outputs/viz/p3_umap_interactive.html`
(4.9 MB), `outputs/viz/clasico_network.html` (4.9 MB), `outputs/viz/presentation.html`
(4.97 MB). Plotly JS is inlined into each [src/build_viz.py:16-17].

**⚠️ `presentation.html` is not fully self-contained.** [src/build_deck.py:5-7] describes
it as "A single self-contained HTML file", but the deck references 7 image files by
**relative path** (`Xavi_slide3.jpg`, `Slide1_YorkuBuilding.jpeg`,
`AlianzArenaOutside_Slide2.jpg`, `YorkuLogo.png`, and 3 club-crest SVGs) — verified by
extracting `src="…"` attributes from the built HTML. Publishing it means publishing
those siblings too, or the deck renders with broken images.

**Sample data / example outputs (all real, no placeholders found):**
`outputs/p3_neighbors.txt` (nearest-neighbour queries for Xavi, Iniesta, Busquets,
Modrić, Kroos), `outputs/p2_cluster_samples.txt` (per-cluster composition + sampled
matches), `outputs/corpus_table.csv`, `outputs/summary_stats.csv`,
`outputs/p3_position_purity.csv`, `outputs/phase3_p1_results.csv`.

**Architecture diagram: none exists.** No diagram file, no mermaid, no `.drawio`,
no SVG schematic anywhere in the repo.

**Screen recordings / GIFs: none.**

**Placeholder / dummy data check:** I found **no** placeholder or lorem-ipsum content in
any output. Every figure and table traces to a real committed CSV. One exception to
flag: [.gitignore:26-27] describes `code.zip` as an "empty placeholder", but the file is
a real 3.5 MB archive containing 849 files / 12.6 MB uncompressed (`unzip -l code.zip`).
It is gitignored and therefore not in the published repo — the comment is simply wrong.

**Branding:** `outputs/viz/YorkuLogo.png` is York University's logo, and the deck's
design system hardcodes "York University official brand red (Pantone 200 C)"
[src/deck_template.py:31].

---

## 10. Do-not-publish list

**No secrets found.** A scan of `src/`, `README.md`, and the presentation notes for
`api_key|secret|password|token|Bearer|AKIA|BEGIN … PRIVATE KEY` returned zero hits. The
StatsBomb free tier needs no credentials [src/sb_cache.py:19-26]. No `.env` file exists.

**Must not appear publicly / needs a decision:**

1. **Third-party imagery with no licence record.** `outputs/viz/Xavi_slide3.jpg` (a
   photograph of a person), `outputs/viz/AlianzArenaOutside_Slide2.jpg`,
   `outputs/viz/Slide1_YorkuBuilding.jpeg`. No attribution, source URL, or licence file
   exists anywhere in the repo. All three are currently **tracked in git**
   (`git ls-files`) and are therefore already public on GitHub. A photo of a named
   footballer used on a public portfolio page is a different risk from classroom use.
2. **Club crests and a university logo — trademarked.**
   `FcBarcelona_Logo_Slide5.cc.svg`, `Bayern_Logo_Slide5.cc.svg`,
   `Spain_Logo_Slide5.cc.svg`, `Argentina_Logo_Slide5.cc.svg`, `YorkuLogo.png`. All
   tracked. The `.cc.` in the SVG filenames may indicate a Creative Commons source but
   nothing in the repo confirms it — **`UNVERIFIED:` licence.**
3. **University email address, in three tracked places.** `mhyrjbr@my.yorku.ca` appears
   at [README.md:4], [src/deck_template.py:295], and [src/deck_template.py:587] — so it
   is rendered onto the title slide and closing slide of the published deck. Also in the
   report PDF. Decide deliberately whether that goes on a portfolio page.
4. **StatsBomb attribution is required, not optional.** [README.md §3] states the user
   agreement requires it and that the project is "a non-commercial academic submission".
   A portfolio page is a different context — re-check the StatsBomb user agreement
   before republishing figures derived from their data commercially.
5. **A stale absolute path from a different machine leaks in a run log.**
   `outputs/wc_build.log` contains
   `/Users/mahyar/Desktop/4414 Information Networks/Project/Tactical DNA/.venv/...`.
   This is *currently safe* — `outputs/*.log` is gitignored [.gitignore:30] and no `.log`
   file appears in `git ls-files`. Do not remove that ignore rule.
6. **`code.zip` (3.5 MB, 849 files) is gitignored** [.gitignore:33] — keep it that way;
   its contents have not been audited here.

**Things a visitor could find that would look bad:**

- **The GitHub link on the closing slide is a live outbound link**
  [src/deck_template.py:582] pointing at `github.com/mahyar-jbr/tactical-dna` with the
  caption "Run it yourself · use your own data". **`UNVERIFIED:` whether that repo is
  public and whether its README instructions actually work from a clean clone** — I did
  not access the network. Two known reasons a clean clone would fail: `plotly` is
  missing from `requirements.txt` (so `build_viz.py` / `build_deck.py` cannot run), and
  `cache/` is gitignored, so Path B (full rebuild) requires a ~5 GB download that the
  README documents but which nothing in the repo verifies still works.
- **README §4 claims a clean-room verification that leaves no artifact.** "This exact
  path was verified in a clean-room run: a fresh venv from `requirements.txt`, only the
  bundled files present…" [README.md §4]. There is **no committed log, transcript, or
  output proving that run happened**, and the `plotly` omission suggests the clean-room
  run cannot have covered the visualisation scripts. Do not repeat this claim publicly
  without re-running it.
- **The two Bayern networks (n=2)** carry a headline conclusion ("Guardiola: 0/2"). It's
  honestly labelled as n=2 in the code, the CSV, and the speaker notes
  [outputs/viz/PRESENTATION_NOTES.md, Slide 8], but a case study that quotes "0%
  recovery" without the n=2 will read as overclaiming.

---

## 11. Open questions for Mahyar

Every `UNVERIFIED:` and `RATIONALE NOT IN REPO` from above, as a to-do list.

1. Is `github.com/mahyar-jbr/tactical-dna` currently **public**, and does a clean clone
   + `pip install -r requirements.txt` actually run the pipeline? (I did not access the
   network.)
2. `plotly` is imported by `build_viz.py` and `build_deck.py` but is missing from
   `requirements.txt`. Was that an oversight, or were the viz scripts deliberately
   excluded from the reproducibility contract? (Same question for `kaleido`.)
3. The README says `src/` has 14 Python files; it has 17. Should the three presentation
   files (`build_viz.py`, `build_deck.py`, `deck_template.py`) be added to the README
   structure section, or were they intentionally out of scope for the submission?
4. The speaker notes call the fingerprint "50-dimensional" while the model uses 44
   features (20 + 16 + 8) and 50 is the CSV column count. Which number do you want in
   the case study?
5. Did the "clean-room run" described in README §4 actually happen, and is there a log
   of it anywhere outside the repo? If not, should that sentence be softened?
6. Was the presentation actually delivered? To whom, when, and how long?
7. What grade / feedback / recognition did the project receive, if any?
8. Where did `Xavi_slide3.jpg`, `AlianzArenaOutside_Slide2.jpg`, and
   `Slide1_YorkuBuilding.jpeg` come from, and under what licence?
9. What is the licence status of the four club-crest SVGs? Does the `.cc.` in the
   filenames mean Creative Commons, and if so, which variant and from where?
10. Do you want `mhyrjbr@my.yorku.ca` on a public portfolio page? It is currently
    rendered on two slides of the published deck.
11. Have you re-checked the StatsBomb user agreement for republishing derived figures
    outside a non-commercial academic context?
12. Why these three model families (LR / RF / XGBoost) and not, say, an SVM or a GNN?
13. Why choose k by the **mean** silhouette across k-means and Ward, rather than by one
    method's curve?
14. Why `MIN_APPEARANCES = 5` for P3 player inclusion?
15. Why `MIN_MATCHES_PER_SEASON = 10` in the scope filter?
16. Why `n_neighbors=15` for the P2 modularity kNN graph, and why UMAP `n_neighbors=20`
    for P2 but `15` for P3?
17. Why Plotly + a hand-written slide engine for the deck, rather than reveal.js or PDF?
18. What do the `SYNC 1` / `SYNC 2` markers in `phase0_scope.py` and `phase3_p1.py`
    refer to — checkpoints with an advisor, or your own decision log? Does that log
    still exist? (It would be the best source for the missing rationales above.)
19. `phase0_scope.py` has a dead branch that would print "Guardiola Barça→Bayern
    transfer experiment is NOT supported by free data" while the same function hardcodes
    `bayern_bundesliga_2015_16: True`. Should that branch be removed before anyone reads
    the source?
20. Development predates git init — all 69 files landed in one commit on 2026-06-09.
    Roughly what was the real timeline (proposal → midterm → final), and do you want the
    case study to state it? The run logs date from 2026-05-29 to 2026-06-09 and the
    `proposal.pdf` file is dated 2026-05-13, but nothing in the repo confirms start date.
