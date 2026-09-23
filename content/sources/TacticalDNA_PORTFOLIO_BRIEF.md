# Tactical DNA — Portfolio Brief

## 1. What it is
Network-science study of football passing, framed for opponent scouting and player recruitment. [final-report.pdf p.1]

## 2. Status
**Finished** course project (EECS 4414, submitted Spring 2026) [final-report.pdf p.2]. The interactive deck is **live**: GitHub Pages builds `main`, latest build from `b300747`, HTTP 200 on 2026-09-23 [GitHub Pages API]. Last commit 2026-06-09 [git log].
- Live: https://mahyar-jbr.github.io/tactical-dna/outputs/viz/presentation.html
- Repo: https://github.com/mahyar-jbr/tactical-dna

## 3. Dates and team
- First commit 2026-06-09 22:05, last 2026-06-09 22:18 (−0400) [git log].
- **Solo:** 1 git author; report lists one author [final-report.pdf p.1].
- UNVERIFIED: real start date. Commit `3daf493` adds all 69 files at once; there is no earlier history.

## 4. Problem
Coaches, pundits and fans describe tactics ("possession football", "gegenpressing") qualitatively, but they are rarely measured. Earlier passing-network studies were mostly descriptive, covering one team or a few matches [final-report.pdf p.1].

## 5. How it works
Traced on Barcelona 5–0 Real Madrid, 2010-11-29 (match 69299) [src/problem2_cluster.py:44]:
1. **Build:** cached StatsBomb events are cut at the first substitution (minute 45), producing an 11-node pass graph with 296 passes [src/build_networks.py:131-244] [outputs/phase1_build_log.csv].
2. **Featurise:** `extract()` computes 44 model features: 8 global, 20 centrality, 16 motif [src/features.py:124-210] [src/phase3_p1.py:105-116].
3. **Infer:** labelled "Guardiola" for coach classification [src/phase3_p1.py:89-102], placed in cluster 1 of 2 [outputs/p2_embedding_coords.csv].

## 6. Tech
1. Python 3.13 [src/build_deck.py:21]
2. NetworkX [src/features.py:43]
3. scikit-learn [src/phase3_p1.py:45-51]
4. XGBoost [src/phase3_p1.py:56]
5. pandas + NumPy [requirements.txt:3-4]
6. UMAP [src/problem3_roles.py:326]
7. Plotly [src/build_viz.py:29]
8. StatsBomb Open Data (statsbombpy) [src/sb_cache.py:26]

Left off: matplotlib (static figures only) and SciPy (one `skew` call [src/features.py:46]).

## 7. Results
1. **775** team-match networks from **42** teams [outputs/features_all.csv].
2. Coach ID: Random Forest accuracy 0.3578043315907394 against a 136/517 majority baseline, falling to 0.24984171692347662 when whole seasons are held out [outputs/phase3_p1_results.csv:3,6,17].
3. Player roles: 1,196 of 1,355 nearest-neighbour slots (271 players, k=5) share the player's position [outputs/p3_position_purity.csv:2].

## 8. Decision
Random CV leaks same-season matches, "partly measuring 'which season' instead of 'which coach'". So season-grouped CV runs alongside it, and the lower number is reported [src/phase3_p1.py:248-265]. The deck leads with that drop [src/deck_template.py:433-435].

## 9. Visuals (`portfolio-assets/`)
- `01-coach-id-results.png`: accuracy under random vs. leakage-free CV, plus the confusion matrix for 8 coaches.
- `02-tactical-archetypes-umap.png`: 774 networks in UMAP space, coloured by k=2 clusters.
- `03-player-role-search.png`: live search for "Xavi" highlights his structural neighbours (zoomed to outfield players).
- `04-clasico-passing-network.png`: the 5–0 Clásico passing network, nodes sized by PageRank (copied from `outputs/example_network.png`).

Screenshots 01–03 are 1440×810, from `outputs/viz/presentation.html`, with the York logo hidden. The repo has no logo, diagram or demo video.

## 10. Keep private
- [withheld: private]
- [withheld: private]
- [withheld: private]
- [withheld: private]
- [withheld: private]
- [withheld: private]
