# Realest

**Voice agent that phones Toronto listing agents for renters and re-ranks their shortlist live.** [README.md:3-8]

## Status: finished hackathon build, page still live
Last commit 2026-09-13 [git log]. The page returned HTTP 200 on 2026-09-23. Pushes to `main` deploy the backend [.github/workflows/deploy.yml:3-5].
- Live page: https://realest-kohl.vercel.app (demo board) [commit 48c6c22]
- Repo: https://github.com/AamelAI/realest
- Demo video: https://youtu.be/A5do1Vd4TgI (listing agents scripted) [README.md:12, README.md:303]

## Dates and team
2026-09-12 to 2026-09-13, 100 commits, **team of 4**. Mine: 14 [git log].
- The ranker: 208 of 275 lines [server/listings.py:94-216, git blame].
- The live page: sliding reorder, rent corrections, detail sheet, resilient polling [web/components/Listings.tsx, DetailSheet.tsx; web/lib/usePolling.ts; commits 812c7ed, d2591da].
- Vercel deploy, `/api/state`, demo listing set [commits 48c6c22, 54b9332].

## Problem
Toronto listings are often wrong: already leased, parking charged on top, pet policy unknown. Renters had to phone each listing agent themselves and play voicemail tag [README.md:41].

## How it works
1. The renter phones in. The voice agent sends their brief to `/agent/preferences`, which ranks every listing in memory and keeps 4 [server/main.py:361-403].
2. "Call them" places one outbound call per listing in parallel. Each transcript becomes a `CallOutcome` via structured output [server/calls.py:336-379, server/calls.py:583-600].
3. The outcome re-ranks the list on real rent (listed plus add-ons). The page polls every 1.2 s and slides cards into place [server/main.py:535-568, web/lib/usePolling.ts:31-34].

## Tech
1. Python 3.12, FastAPI [pyproject.toml:5-8]
2. ElevenLabs Conversational AI [server/voice/elevenlabs.py:19-23]
3. OpenAI structured outputs, `gpt-4.1-mini` [server/chat.py:36-41]
4. Twilio (calls, SMS) [server/calls.py:233-236]
5. Next.js 15, React 19, TypeScript [web/package.json]
6. Tailwind CSS 4 [web/package.json:18]
7. Vercel, GitHub Actions [.github/workflows/deploy.yml]

Left off: `openai-agents` and `exa-py` are declared but never imported [pyproject.toml:17-18].

## Results
- **31 tests pass**, 1 skipped (needs an API key), run 2026-09-23 [tests/test_extraction_live.py:41].
- **104 Toronto listings**, filtered from 124 scraped rows [scripts/scrape_rentals.py:158-173].
- UNVERIFIED: a 131-second live call [README.md:98]; no call log in the repo. No user or latency data.

## Decision
Re-ranking changes only each card's `translateY`. DOM order never changes, so React never moves a node mid-animation [web/components/Listings.tsx:137-146]. The cost is one fixed height for every card [web/components/Listings.tsx:17-19]. This replaced Framer Motion on the board, and first-load JS went from 143 to 108 kB at that commit [commit 812c7ed].

## Visuals (portfolio-assets/)
- `01-shortlist-after-calls.png`: The shortlist after the calls: booked, over budget, no answer, leased.
- `02-detail-sheet.png`: Listed $3,290, really $3,470 with parking.
- `03-calls-in-flight.png`: The real ranker's top 4, all called at once.
- `realest-demo.gif`: One full session.
- `realest-loop.png`: Reordered, calling, rewritten.
- `realest-detail.png`: Detail sheet on a phone.
- `realest-icon.svg`: App icon.

## Keep private
- [withheld: private]
- [withheld: private]
- [withheld: private]
