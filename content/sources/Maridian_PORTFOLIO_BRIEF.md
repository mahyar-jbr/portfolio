# Portfolio Brief: Maridian

## 1. Maridian
Six Claude agents decide what to do with a flagged bakery defect, for line operators. [api/agents/orchestrator.py:3]

## 2. Status: finished
- Hackathon build complete [README.md:151]; last commit 2026-05-29 [b65cfcf]. Deploys: Railway API, Vercel web [api/Procfile:1; README.md:80].
- On 2026-09-23 the API returned 404; the live portal shows "Unable to load lines" [web/public/maridian/line-portal.html:336-338].
- Live: https://fgf-sentinel-web.vercel.app/pitch/index.html · Repo: https://github.com/mahyar-jbr/maridian-sentinel

## 3. Dates and team
- 2026-05-25 to 2026-05-29 [4b28ece, b65cfcf].
- Team of 5, 245 commits: Bahar 102, Mahyar 83 (9 as `r <r@r>`, e.g. his E1-T6 [docs/internal/BACKLOG.md:196; 6064b48]), Elham 25, Matin 22, Saba 13.
- I built: the monorepo scaffold and shared TypeScript/Pydantic contract [dd3898a]; Vercel/Railway deploys [docs/internal/BACKLOG.md:164-165]; per-tool-call logging [api/agents/runtime.py:108-120]; both portals' redesign and distributor API [bbecba2, 711cec0]; the pitch page [8fe5a23]. Teammates owned agents, tools, schema [CONTRIBUTORS.md:10-13].

## 4. Problem
Computer vision flags bakery defects at line speed, but deciding what happens next is manual. A QA technician pulls the unit, classifies it, checks specs, phones a coordinator, calculates recovery value and picks an outcome. [docs/fgf-sentinel-briefing.html:867]

## 5. How it works
1. "Run AI Analysis" POSTs `/problems/{id}/analyze/stream`, which builds a defect event from the batch's top QC row [front/line-detail.html:2042; api/routers/production.py:354-412].
2. Six agents run in sequence (the Recovery Planner only on an SLA breach), each a Claude tool-use loop over SQLite tools [api/agents/orchestrator.py:121-232].
3. Events stream over SSE; the operator accepts or overrides; customer emails stay drafts [api/routers/production.py:466; api/agents/prompts/recovery_planner.md:42].

## 6. Tech
Python 3.11 [api/runtime.txt:1] · Claude Haiku 4.5 via Anthropic SDK [api/agents/runtime.py:27] · FastAPI [api/requirements.txt:1] · Server-Sent Events [api/main.py:120] · SQLite, 14 tables [api/db/schema.sql:9-174] · HTML/CSS/JavaScript [front/] · Railway, Vercel [README.md:80]

Left off: Next.js [web/package.json:13]; it only serves the static portals. Notable: no agent framework, the tool-use loop is hand-written [api/agents/runtime.py:199-289].

## 7. Results
- Smoke test: 22/23 checks passed (local run, 2026-09-23); the one failure [api/smoke_test.py:186] is a known issue [5480258].
- Full six-agent run: 31.7 s and 32.6 s (two local runs, UI timer [front/line-detail.html:2076]).
- 14 and 13 tool calls per run (non-breach / breach), same smoke run.

## 8. Decision
Railway crashed on boot: the DB path pointed outside its `/api` root. I shipped the seeded SQLite file inside `api/` and made DB startup non-fatal (`/health` stays up); cost: a 397,312-byte binary in git [c5616f5; api/db/connection.py:23-43; api/main.py:37-42].

## 9. Visuals (portfolio-assets/)
- `01-agent-reasoning.png`: Agent run on LINE-3: recommendation and reasoning, completed in 32.6 s.
- `02-sla-breach-recovery.png`: Breach path: decision, recovery proposals, customer update held as a draft.
- `03-production-lines.png`: Production lines with defect rates and SLA-breach flags.
- `04-login.png`: Sign-in screen with tagline (existing, from web/public/pitch/shots/).

Customer names in 01–03 are replaced with "Customer A–F". Existing diagrams skipped: they don't match the code [README.md:61-74].

## 10. Keep private
- [withheld: private]
- [withheld: private]
- [withheld: private]
- [withheld: private]
- [withheld: private]
