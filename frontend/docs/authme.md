🔐 Authentication System – Frontend Architecture (Thozhil)
1. Purpose of this Document
This document explains:

How authentication is structured in the frontend

What layers exist (pages, logic, visuals, API)

What has already been implemented

How new teammates should extend or modify auth features safely

This is meant for any new developer joining the project to quickly understand the auth flow.

2. High-Level Auth Flow
We currently support these auth flows:

Signup

Login

Forgot Password

Reset Password

Google OAuth (redirect-based)

All flows follow the same architectural pattern.

3. Core Design Principle (Very Important)
UI ≠ Logic ≠ API

We intentionally separate:

Page wiring

Business logic (form handling, API calls)

Visuals (animations, layout, CSS)

API layer (Axios, endpoints)

This keeps the code:

Easy to maintain

Easy to debug

Easy for multiple people to work in parallel

4. Folder Structure (Auth)
src/
├─ api/
│  └─ auth.api.ts        # All auth-related API calls (Axios layer)
│
├─ pages/
│  └─ auth/
│     ├─ LoginPage.tsx
│     ├─ SignupPage.tsx
│     ├─ ForgotPasswordPage.tsx
│     └─ ResetPasswordPage.tsx
│
├─ components/
│  └─ auth/
│     ├─ AuthLayout.tsx          # Shared layout for all auth pages
│
│     ├─ signup/
│     │  ├─ SignupForm.tsx       # Signup logic + form
│     │  ├─ GoogleSignupButton.tsx
│     │  └─ SignupVisual.tsx     # Right-side visual
│
│     ├─ login/
│     │  ├─ LoginForm.tsx
│     │  ├─ GoogleLoginButton.tsx
│     │  └─ LoginVisual.tsx
│
│     ├─ forgot-password/
│     │  └─ ForgotPasswordForm.tsx
│
│     └─ reset-password/
│        └─ ResetPasswordForm.tsx
│
├─ styles/
│  └─ auth/
│     ├─ signup.css
│     ├─ login.css
│     ├─ forgot-password.css
│     └─ reset-password.css
5. The 3-Layer Pattern (Used Everywhere)
Every auth feature follows three layers:

🧩 1. Page Layer (pages/auth/*)
Responsibility:

Route-level wiring

Assembles layout + form + visual

What it should NOT do:

No API calls

No business logic

No CSS

Example:

<AuthLayout
  form={<SignupForm />}
  visual={<SignupVisual />}
/>
🧠 2. Logic Layer (components/auth/*Form.tsx)
Responsibility:

Form state

Validation (minimal)

Calling API functions

Handling loading / success / error

This is where:

useState

handleSubmit

auth.api.ts calls live

Example:

import { register } from "@/api/auth.api";

await register({
  fullName,
  email,
  password,
  role,
});
🎨 3. Visual Layer (*Visual.tsx + CSS)
Responsibility:

Pure UI / animation

Decorative content

Branding visuals

Rules:

❌ No API calls

❌ No form logic

❌ No state (except animation-related)

Visuals import their own CSS:

import "@/styles/auth/signup.css";
This allows a designer to work without touching logic.

6. Auth Layout (AuthLayout.tsx)
Shared layout used by all auth pages.

What it does:

Creates the 2-column grid

Left = form

Right = visual

Handles responsiveness

Why this exists:

Avoid layout duplication

Consistent UX across auth pages

7. API Layer (src/api/auth.api.ts)
This is the single source of truth for auth backend communication.

Axios Instance
const api = axios.create({
  baseURL: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});
API Contract Implemented
Feature	Endpoint
Register	POST /register
Verify Email	POST /verify-email
Login	POST /login
Refresh Token	POST /refresh-token
Logout	POST /logout
Forgot Password	POST /forgot-password
Reset Password	POST /reset-password
Google OAuth	GET /google
Frontend never hardcodes URLs elsewhere.

8. Signup Flow (What We Have Done)
Signup Data Collected
fullName

email

password

confirmPassword (frontend only)

role (STUDENT | RECRUITER)

Flow
User fills form

Frontend validates passwords match

Calls register()

Backend sends OTP

OTP verification handled via /verify-email

9. Login Flow
User enters email + password

Calls login()

Backend returns:

accessToken

refreshToken

user object

Token storage/interceptors are future work.

10. Forgot Password Flow
Page: ForgotPasswordPage
User enters email

Frontend calls:

forgotPassword({ email })
Backend sends OTP or reset link to email

Frontend does not verify OTP here.

11. Reset Password Flow
Page: ResetPasswordPage
User enters:

OTP (from email)

New password

Confirm password

Frontend sends:

resetPassword({
  otp,
  newPassword,
});
Important
OTP verification is entirely backend responsibility

Frontend only collects + submits data

12. Google OAuth
export const googleLogin = () => {
  window.location.href = "/api/auth/google";
};
Why this is safe:

Uses backend OAuth flow

No tokens handled in frontend

Backend redirects back after auth

13. Dependencies Used (Auth-Related)
axios – API calls

react-router-dom – navigation

@types/node – TypeScript support

Material Symbols – icons

14. How New Teammates Should Work
If you are working on UI / Visuals:
Only touch *Visual.tsx

Only touch CSS files

Do NOT modify forms or API logic

If you are working on logic:
Modify *Form.tsx

Use only functions from auth.api.ts

If you add a new auth feature:
Add API function in auth.api.ts

Create Page

Create Form

(Optional) Create Visual

Plug into AuthLayout

15. Summary
✔ Clean separation of concerns
✔ Scalable for more auth features
✔ Easy onboarding for new devs
✔ Safe API contract usage