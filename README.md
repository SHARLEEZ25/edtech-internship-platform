# Edtech Internship Platform

Built a full-stack multi-role Internship & Hiring Platform — one system, two completely different user experiences.

Students and recruiters use the same application but follow entirely different workflows, all handled through role-based architecture.

---

## What It Does

### Student Side
- Browse & filter internships
- Apply + application status tracking
- AI recommendations (semantic embeddings + cosine similarity)
- Profile & resume management

### Recruiter Side
- Post internships
- Candidate pipeline with status management
- Intelligent interview scheduling with conflict detection
- Unified dashboard

---

## Tech Stack

### Frontend
| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| State | Zustand |
| Routing | React Router v7 |
| API Client | Axios (with interceptors) |
| Forms | react-hook-form |
| PDF Export | jsPDF |
| Notifications | react-hot-toast |

### Backend
| | |
|---|---|
| Runtime | Node.js + Express v5 |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + Refresh Token Rotation + Google OAuth |
| Storage | AWS S3 (presigned uploads) |
| AI / Matching | Vector Embeddings + Cosine Similarity |
| Scheduling | Cron-based expiry + conflict detection |

---

## System Design Highlights

- **Role-based auth & protected routes** — JWT + refresh token rotation + Google OAuth
- **Robust scheduling engine** — conflict checks and cron-based expiry
- **Prisma transactions** — data consistency in multi-step operations
- **Vector embeddings** — smart matching between students and internships
- **Secure AWS S3 presigned uploads** — for resume/document handling

Focused heavily on workflow orchestration, edge cases, and multi-role patterns.

---

## Repository Structure

```
edtech-internship-platform/
  frontend/    React 19 + TypeScript + Vite
  backend/     Node.js + Express v5 + Prisma + PostgreSQL
```

---

## Running Locally

This project requires environment variables for JWT, Google OAuth, AWS S3, and a PostgreSQL database.

Interested in running it or exploring the architecture?

**Reach out and I'll walk you through it.**

- Email: saleezie@gmail.com
- LinkedIn: [linkedin.com/in/YOUR_HANDLE](https://linkedin.com/in/YOUR_HANDLE)

---
## Demo

https://www.loom.com/share/88ebd8b161254a0e99cf3eef5ed91fa2

*Built with a focus on real-world patterns: role-based flows, scheduling, AI matching, and secure uploads.*
