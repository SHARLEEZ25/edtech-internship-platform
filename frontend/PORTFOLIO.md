# I Build Platforms. End to End.

I'm a full-stack developer who takes products from blank repo to production — designing the database schema, building the API, crafting the frontend, and wiring it all together. If you need someone who can own a project technically and make real decisions, that's what I do.

---

## Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite, Zustand, React Hook Form, Axios |
| **Backend** | Node.js, Express.js v5, Prisma ORM, PostgreSQL |
| **Auth** | JWT (refresh tokens), Google OAuth (Passport.js), OTP email verification |
| **AI / ML** | Sentence Transformers (`all-MiniLM-L6-v2`), cosine similarity scoring |
| **Cloud** | AWS S3 (presigned URLs), Vercel |
| **Email** | Nodemailer, transactional templates |
| **Other** | node-cron, HTTP-only cookies, environment-aware config |

---

## Case Study — Internship & Hiring Platform

### The Challenge

Two completely different users. One platform.

Students need to discover opportunities, apply, track their pipeline, and schedule interviews. Recruiters need to post internships, review hundreds of applications, manage candidate stages, and coordinate interview logistics. Neither flow looks anything like the other — but they have to live in the same system, share the same database, and talk to the same API.

The challenge wasn't just building features. It was designing an architecture that could handle two entirely different product experiences without becoming a mess.

---

### My Role

Sole architect and engineer — frontend and backend. I designed the database schema, built the API from scratch, built the full React frontend, and deployed the whole thing. Every technical decision was mine to make.

---

### What I Built

#### Frontend

**Authentication & Onboarding**
- JWT-based auth with HTTP-only cookie sessions and refresh token rotation
- Google OAuth integration with callback handling
- Email OTP verification and password reset flow
- Multi-step role-based onboarding: Students go through education → skills → location; Recruiters go through professional details → company info → description
- Smart route guards: `ProtectedRoute`, `PublicRoute`, `OnboardingGuard` — users can only access what they're supposed to

**Student Experience**
- Browse and filter internships by domain, type, location, stipend — with debounced search
- AI-powered recommendation feed (best match + curated picks, personalized to skills and location)
- Apply with resume upload, track application status across 12 pipeline stages
- Interview schedule view — accept/decline, see mode and link
- Full profile management: education, skills, experience, achievements, engagements

**Recruiter Experience**
- Post and manage internship listings (DRAFT/LIVE/CLOSED lifecycle)
- View all applications across all postings, or drill into a specific internship
- Move candidates through the hiring pipeline with status updates and remarks
- Schedule interviews with date, mode (online/offline), link or address
- Company profile with hiring stats and social links

**Engineering**
- 56 custom hooks separating business logic entirely from UI
- 3-layer architecture: Hooks (data + logic) → Visuals (pure presentation) → Styles (modular CSS)
- 46 routes, 228 TypeScript files, 10 API service modules
- ~11,674 lines of hand-written modular CSS

---

#### Backend

**API & Database**
- RESTful API with 40+ endpoints across 12 modules
- 18 PostgreSQL models via Prisma ORM — covers users, profiles, internships, applications, interviews, skills, file uploads, OAuth accounts, OTP and refresh token storage
- Atomic operations with Prisma `$transaction` where data consistency matters
- Prisma auto-migration on deploy — schema changes land in production without manual steps
- Deployed on Vercel with environment-based config

**Authentication System**
- JWT access tokens + hashed refresh tokens (stored in DB, revocable)
- Google OAuth via Passport.js with `OAuthAccount` model
- OTP system for email verification and password reset — hashed codes, expiry, single-use enforcement
- RBAC middleware chain: `requireAuth` → `requireRole` → `requireOnboardingStep` — every protected route knows exactly what state the user needs to be in

**AI Recommendation Engine**
- Generates semantic embeddings for students (headline + skills + specialization) and internships (title + domain + skills) using `@xenova/transformers` (`all-MiniLM-L6-v2`)
- Cosine similarity matching with a 0.25 threshold
- Scoring: 70 pts semantic match + 10 pts location boost + 5 pts freshness (within 7 days)
- Hard filters: removes previously applied/saved internships, enforces location compatibility
- Diversity filter: ensures varied companies in the result set
- In-memory cache with 15-minute TTL for all live internships — fast response without re-embedding on every request
- Returns: 1 highlighted "best match" + 3 curated recommendations

**Email System**
- 7 transactional email templates via Nodemailer / Gmail SMTP:
  - OTP verification and password reset
  - Interview invitation (with date, mode, link/address)
  - Interview confirmation when candidate accepts
  - Offer letter notification
  - Rejection notification
  - Interview cancellation with reason
  - Interview reschedule with new details

**Interview Scheduling**
- Full lifecycle: `PENDING` → `SCHEDULED` → `COMPLETED` (or `CANCELLED` / `RESCHEDULED` / `EXPIRED`)
- Conflict detection on acceptance — rejects overlapping interview requests
- Hourly cron job (node-cron) expires PENDING invitations that were never responded to
- Rescheduling with reason tracking

**File Storage**
- AWS S3 presigned URL flow — client uploads directly to S3, backend never touches the file
- UUID-based key generation, filename sanitization, path traversal protection
- PDF-only validation
- Local dev fallback to `public/uploads/` — no S3 needed to run locally

---

### By the Numbers

```
Frontend   46 routes · 228 TypeScript files · 56 custom hooks · 10 API modules · ~11,674 lines CSS
Backend    18 DB models · 40+ endpoints · 12 modules · 7 email templates · 1 AI engine
```

---

## How I Work

**Architecture first.** Before I write a component or a route handler, I have the schema, the module boundaries, and the auth flow figured out. Building on a solid foundation is faster than refactoring a shaky one.

**Type-safe, end to end.** TypeScript on the frontend, Prisma-generated types on the backend. If something changes in the schema, the compiler tells me everywhere it matters before I ship.

**Separation of concerns by default.** Hooks handle logic. Components handle display. Services handle data. This isn't about pattern-following — it's about keeping the codebase readable six months later.

**Edge cases are part of the feature.** Conflict detection for overlapping interviews. Token revocation for secure logout. OTP expiry and single-use enforcement. Cascade deletes that don't leave orphaned records. I think through what breaks before it breaks.

**Deployable from day one.** Environment-aware configs, migration scripts that run on deploy, local dev fallbacks for external services. The codebase should work anywhere without a setup call.

---

## What I Can Build For You

**If you're a startup:** You need a platform, not a prototype. I design the schema, architect the API, build the frontend, and ship the whole thing — auth, role-based dashboards, AI features, file uploads, email notifications, deployment. I make the technical decisions so your team can focus on the product.

**If you're a client:** You don't want someone who needs constant direction. I scope the work, own the architecture, flag tradeoffs early, and deliver. You get a working product — not a collection of components waiting to be assembled by someone else.

---

## Let's Talk

If you're building something and want someone who can own it technically — I'm available.

**Email:** [your email]
**LinkedIn:** [your linkedin]
**GitHub:** [your github]
