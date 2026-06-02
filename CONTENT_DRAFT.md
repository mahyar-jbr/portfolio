# Portfolio Content Draft — source of truth (from updated resume, 2026-06-02)

> Working doc for the overhaul. Reconciles the live site with the new resume.
> Lineup decided: 01 BowlWise · 02 Maridian · 03 MoneyMind · 04 WealthTrack.
> Dropped from site: School Management System, Dog Wash Booking, Hotel DB.

## Identity / hero
- Name: Mahyar Jaberi
- Title direction (to finalize in structure step): full-stack + **AI agent engineer**
  (current site says "Computer Science Student / Problem Solver" — too generic for the new positioning)
- Degree: Honours BA, Computer Science (Co-op), York University — Sept 2023 – Apr 2027 (Expected)
- Location: Aurora, ON (EST) · 437-986-1383 · jaberi.mahyar@gmail.com
- Links: github.com/mahyar-jbr · linkedin.com/in/mahyar-jaberi · mahyar-portfolio.dev

## Certifications
- Machine Learning Specialization — Stanford University & DeepLearning.AI — *In Progress*
- Python for Data Science and AI — IBM — Jan 2026
  (credly badge already linked in current AboutSection)

## Experience
### Software Developer Intern — Nova Ventures — May 2025–Aug 2025 — Toronto, ON
- Built backend API endpoints in Python and FastAPI for a goalkeeper analytics platform, exposing per-session performance data to the coaching dashboard
- Built a data pipeline that parsed and cleaned match stats from club PDFs and spreadsheets into structured database tables for analysis
- Built interactive React heatmap components that visualized save patterns across goal zones

### App Developer & Database Intern — Sepantech — May 2024–Aug 2024 — Sweden (Remote)
- Built core features for a course-management platform serving 500+ medical professionals, including enrollment and automated certification
- Designed 6+ MySQL tables and optimized 12+ queries, cutting average response time by 30%
- Built 8+ Node.js API endpoints in an Agile team for authentication, enrollment, and certificate generation

### (optional, currently on site) Pet Valu — Animal Care Expert & Assistant Manager — Aug 2023–Present
- NOT on the resume's experience section. Decide in structure step whether it stays (it humanizes + ties to BowlWise's PetValu deployment) or drops for a tighter senior feel.

## Projects

### 01 — BowlWise  (bowlwise.app, LIVE)
Stack: React, FastAPI, MongoDB, Python, Pydantic, Docker
- Solo-built and launched a full-stack dog food recommendation platform now live on customer tablets in 2 PetValu retail stores, owning frontend, backend, database, and deployment end-to-end
- Built the React frontend, including a 7-step guided profile form, product-detail overlays, a feeding calculator, and a side-by-side comparison tool tuned for in-store tablets
- Built 20 FastAPI endpoints over a 4-collection MongoDB schema, with magic-link authentication, rate limiting, and 61 automated tests
- (extra detail from current site, verify before using: 100-point scoring algorithm per AAFCO/NRC/WSAVA; 150 products / 6 brands; 95 Lighthouse; PIPEDA/CASL compliance; CI/CD via GitHub Actions)

### 02 — Maridian  (live demo: fgf-sentinel-web.vercel.app/maridian/login.html)
Stack: Next.js, React, Python, FastAPI, Pydantic, SQLite
Role: Technical lead, 5-person team · TMLS 2026 Agentic AI Hackathon
- Led the technical build of a six-agent AI system end to end as technical lead on a 5-person team, owning the architecture, API contract, deployment, and the operator-facing UI; demoed at the TMLS 2026 Agentic AI Hackathon
- Developed and polished the operator and distributor web portals, a five-page interface where factory staff review flagged defects, view the AI's recommended action, and approve customer status updates
- Diagnosed and fixed a production outage that was failing every API route, tracing it to a database path resolving outside the deploy directory and shipping a fix that restored the live service

### 03 — MoneyMind  (GitHub: github.com/mahyar-jbr/MoneyMind)
Stack: Next.js, React, FastAPI, MongoDB Atlas, LangGraph, Gemini
Role: Architecture lead, 3-person team · Google Cloud Agent Hackathon
- Architected a three-layer system (Next.js, FastAPI, MongoDB Atlas) for an AI personal-finance agent as architecture lead on a 3-person team for the Google Cloud Agent Hackathon
- Built and verified an end-to-end streaming pipeline (Next.js → FastAPI → LangGraph agent → Atlas → Gemini) delivering token-by-token responses from a user's real transaction data
- Built the agent service in FastAPI and designed the MongoDB Atlas schema and 1024-dim vector index the rest of the stack runs on

### 04 — WealthTrack  (GitHub: github.com/mahyar-jbr/wealthtrack-mobile)  [KEPT from old site, not on resume]
Stack: React Native, Node.js, Express, TypeScript, PostgreSQL, JWT + BCrypt
- Cross-platform mobile finance/investment tracker (iOS + Android, single codebase, Expo)
- Yahoo Finance + CoinGecko APIs for real-time stock/crypto/ETF prices
- PostgreSQL + Prisma; JWT/bcrypt auth + SecureStore; portfolio analytics engine; price caching (~60% fewer API calls); 12-endpoint REST API
- NOTE: keep as the "I also ship polished mobile apps" proof point, but it's secondary to the AI work.

## Skills (from resume — note new AI/ML category)
- Languages: Python, JavaScript, TypeScript, SQL, Java, C, HTML/CSS
- Frameworks: React, Next.js, FastAPI, Pydantic, Node.js, Express, Tailwind
- Databases: MongoDB Atlas, PostgreSQL, MySQL, SQLite
- AI/ML: LangGraph, Anthropic Claude API, Gemini, Atlas Vector Search, pandas, NumPy
- Tools: Git, Docker, GitHub Actions, Linux, Postman, Figma, Railway, Vercel
- (current site also lists: Express, SQLAlchemy, BeautifulSoup4, Axios, Maven, Jupyter, Expo, MS SQL Server, Spring Boot — reconcile: resume is the tighter, truer set)

## Gallery (keep — differentiator)
- 10 art pieces + "Godfall" story series; unchanged. Strong signal of craft/patience/visual sense.

## Open structure questions (resolve in the structure step, after research)
1. Hero copy: lead with AI-agent positioning? exact tagline?
2. Section order: does Work/projects move directly after hero (before About)?
3. Case studies: do Maridian + MoneyMind get dedicated pages (Next.js routes) vs expandable inline?
4. Experience vs Projects order for a student.
5. Does Pet Valu retail role stay?
6. Skills: adopt the tighter resume set (+ new AI/ML category) and drop the long tail?
