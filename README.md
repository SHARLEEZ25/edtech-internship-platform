Built a full-stack multi-role Internship & Hiring Platform — one system, two completely different user experiences.

Students and recruiters use the same application but follow entirely different workflows, all handled through role-based architecture.

---

**Student Side**
- Browse & filter internships
- Apply + application status tracking
- AI recommendations (semantic embeddings + cosine similarity)
- Profile & resume management

**Recruiter Side**
- Post internships
- Candidate pipeline with status management
- Intelligent interview scheduling with conflict detection
- Unified dashboard

---

**Tech Stack:** React + TypeScript, Node.js + Express, PostgreSQL + Prisma

---

**System Design Highlights**
- Role-based auth & protected routes with JWT + refresh token rotation + Google OAuth
- Robust scheduling engine with conflict checks and cron-based expiry
- Prisma transactions for data consistency in multi-step operations
- Vector embeddings for smart matching
- Secure AWS S3 presigned uploads

Focused heavily on workflow orchestration, edge cases, and multi-role patterns.

---

```
frontend/    React 19 + TypeScript + Vite
backend/     Node.js + Express v5 + Prisma + PostgreSQL
```
