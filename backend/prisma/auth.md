Authentication Module – API & Database Schema
This document defines the database models (from schema.prisma) and the API contract for the authentication system.

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// =====================================
// USER (Single identity table)
// =====================================
model User {
  id               String   @id @default(cuid())
  email            String   @unique
  passwordHash     String?  // null for OAuth users

  role             Role     @default(STUDENT)

  isActive         Boolean  @default(true)
  emailVerifiedAt  DateTime?

  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Relations
  oauthAccounts    OAuthAccount[]
  refreshTokens    RefreshToken[]
  otps             OTP[]
}

// =====================================
// ROLE ENUM
// =====================================
enum Role {
  STUDENT
  RECRUITER
  ADMIN
}

// =====================================
// OAUTH ACCOUNTS (Google, future providers)
// =====================================
model OAuthAccount {
  id               String        @id @default(cuid())
  provider         OAuthProvider
  providerUserId   String

  userId           String
  user             User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  createdAt        DateTime      @default(now())

  @@unique([provider, providerUserId])
}

// =====================================
// OAUTH PROVIDERS
// =====================================
enum OAuthProvider {
  GOOGLE
}

// =====================================
// OTP (Email verification & password reset)
// =====================================
model OTP {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)

  purpose     OTPTarget
  codeHash    String
  expiresAt   DateTime
  usedAt      DateTime?

  createdAt   DateTime    @default(now())

  @@index([userId, purpose])
}

// =====================================
// OTP PURPOSE
// =====================================
enum OTPTarget {
  EMAIL_VERIFICATION
  PASSWORD_RESET
}

// =====================================
// REFRESH TOKENS (Secure sessions)
// =====================================
model RefreshToken {
  id          String   @id @default(cuid())
  tokenHash   String   @unique

  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  revokedAt   DateTime?
  expiresAt   DateTime

  createdAt   DateTime @default(now())

  @@index([userId])
}

//===============================
Authentication Module – API Contract
//===============================
Base URL:
/api/auth

1. Register (Email + Password)

POST /api/auth/register

Request Body:

{
  "email": "string",
  "password": "string",
  "role": "STUDENT | RECRUITER"
}


Success Response (201):

{
  "message": "Registration successful. Verification OTP sent.",
  "userId": "string"
}


Error Responses:

400 → Invalid input

409 → Email already exists

2. Verify Email (OTP)

POST /api/auth/verify-email

Request Body:

{
  "userId": "string",
  "otp": "string"
}


Success Response (200):

{
  "message": "Email verified successfully."
}


Error Responses:

400 → Invalid or expired OTP

3. Login (Email + Password)

POST /api/auth/login

Request Body:

{
  "email": "string",
  "password": "string"
}


Success Response (200):

{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "string",
    "email": "string",
    "role": "STUDENT | RECRUITER"
  }
}


Error Responses:

401 → Invalid credentials

403 → Email not verified

4. Refresh Access Token

POST /api/auth/refresh-token

Request Body:

{
  "refreshToken": "string"
}


Success Response (200):

{
  "accessToken": "new_jwt_access_token"
}


Error Responses:

401 → Invalid or expired refresh token

5. Logout

POST /api/auth/logout

Request Body:

{
  "refreshToken": "string"
}


Success Response (200):

{
  "message": "Logged out successfully."
}

6. Forgot Password (Send OTP)

POST /api/auth/forgot-password

Request Body:

{
  "email": "string"
}


Success Response (200):

{
  "message": "Password reset OTP sent."
}


Error Responses:

404 → User not found

7. Reset Password

POST /api/auth/reset-password

Request Body:

{
  "otp": "string",
  "newPassword": "string"
}


Success Response (200):

{
  "message": "Password reset successful."
}


Error Responses:

400 → Invalid or expired OTP

8. Google OAuth Login

Initiate Login:
GET /api/auth/google
Redirects user to Google authentication page.

Callback:
GET /api/auth/google/callback

Success Response (200):

{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "string",
    "email": "string",
    "role": "STUDENT | RECRUITER"
  }
}

🛠 Common Error Format

All error responses follow this structure:

{
  "error": true,
  "message": "Meaningful error message"
}
