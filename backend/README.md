Thozhil Backend – Team Onboarding & Development Guide

Welcome to the Thozhil Backend project. This document explains the current setup, what has been done, and how team members can get started quickly and safely.

1. Project Overview

Thozhil Backend is the server-side application for managing internship workflows, including:

Student registration, profile management, and internship applications

Recruiter registration, job posting, and applicant management

Admin oversight for platform control

Tech Stack:

Node.js & Express.js – Backend server and APIs

PostgreSQL – Relational database

Prisma ORM – Database modeling, migrations, and client generation

Docker – Local database container for consistent development

JWT – Authentication tokens

The current repository contains:

Fully structured folder layout for controllers, routes, middleware, and utils

Installed dependencies (express, cors, dotenv, prisma, @prisma/client, nodemon)

Prisma initialized and migration files created

Docker setup instructions for running PostgreSQL locally

2. Prerequisites

Before starting development, ensure the following are installed:

Node.js
 (v18+)

Docker Desktop

Make sure Docker is running before starting the backend.

3. Cloning the Repository

Open VS Code or terminal and run:

git clone https://github.com/SHARLEEZ25/thozhil-backend.git
cd thozhil-backend


All folder structure, migration files, and configs are included.

4. Setting Up PostgreSQL Using Docker

We are using Docker for PostgreSQL to ensure a consistent local DB environment for all developers.

Run the following command once:

docker run --name thozhil-postgres \
 -e POSTGRES_USER=thozhil \
 -e POSTGRES_PASSWORD=thozhil \
 -e POSTGRES_DB=thozhil_dev \
 -p 5432:5432 \
 -d postgres:16


This will:

Start a PostgreSQL container named thozhil-postgres

Set username: thozhil

Set password: thozhil

Set database: thozhil_dev

Expose port 5432 to your local machine

Check it’s running:

docker ps

5. Environment Variables

Create a .env file in the project root:

DATABASE_URL="postgresql://thozhil:thozhil@localhost:5432/thozhil_dev"
JWT_SECRET="ba79e938859cead6ca6bd2625010bddb0c48f663f7242a593b75ae6d2886c6aa"
PORT=5000


Explanation:

DATABASE_URL → Connects Prisma to the local Postgres DB

JWT_SECRET → Secret used to sign JWT tokens

PORT → Server port

Important: .env is not committed to Git. Each developer creates their own local copy.

6. Installing Dependencies

Inside the project folder, run:

npm install


This installs all Node packages required to run the backend.

7. Prisma Setup

Generate the Prisma client:

npx prisma generate


Run migrations to create the database schema:

npx prisma migrate dev


Migrations have already been created and pushed. Team members do not create new migrations unless they add new models. They simply apply existing migrations to their local DB.

8. Starting the Backend Server

Run:

npm run dev


The server will be available at:

http://localhost:5000

9. Current Folder Structure
/thozhil-backend
  src
  /config
    db.js
    env.js
  /modules
    /auth
      auth.controller.js
      auth.service.js
      auth.routes.js
    /students
      students.controller.js
      students.service.js
      students.routes.js
    /recruiters
      recruiters.controller.js
      recruiters.service.js
      recruiters.routes.js
    /internships
      internships.controller.js
      internships.service.js
      internships.routes.js
    /applications
      applications.controller.js
      applications.service.js
      applications.routes.js
    /admin
      admin.controller.js
      admin.service.js
      admin.routes.js
  /middlewares
    auth.js
    errorHandler.js
  app.js
  server.js
prisma/
.env
README.md


Team members can immediately start coding in /src.

10. Development Workflow

main branch → stable base

dev branch → active development

Feature branches → created from dev → merged via PR

Example:

git checkout dev
git checkout -b feature/student-auth


Pull latest migrations and schema from main

Run npx prisma migrate deploy to apply to local DB

Build APIs according to project flows

11. Key Notes for the Team

Everyone uses the same .env values for local development

Docker PostgreSQL ensures identical DB for all devs

Migration files are version-controlled; apply, don’t recreate

Production secrets and DB will be separate
