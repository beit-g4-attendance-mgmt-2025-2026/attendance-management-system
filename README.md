# Attendance Management System

A role-based university attendance platform built with Next.js App Router, TypeScript, Prisma, PostgreSQL, and Tailwind CSS.

The application supports three working roles:

- `ADMIN` manages departments, teachers, students, and academic years.
- `HOD` manages department teachers, classes, subjects, and class-level reporting.
- `TEACHER` records subject attendance, reviews assigned classes, and exports reports.

## Overview

This project combines:

- authentication with JWT stored in an `httpOnly` cookie
- role-based page access for admin, department, and teacher interfaces
- attendance capture at the daily subject level
- monthly subject and class attendance summaries
- CSV export for multiple resources and reports
- password reset email flow
- optional department logo upload with Cloudinary

## Tech Stack

- Framework: Next.js `15.5.6` with App Router
- Language: TypeScript
- UI: React `19`, Tailwind CSS `4`, Radix UI, Sonner, Recharts
- ORM: Prisma `7`
- Database: PostgreSQL via `@prisma/adapter-neon`
- Validation: Zod
- State: Zustand
- Auth: JWT + cookies
- Email: Mailtrap and Resend helpers
- Monitoring: Sentry
- Package manager: pnpm

## Main Features

### Admin

- View the dashboard
- Manage departments
- Add or update teachers and HODs
- Manage students
- Manage academic years
- Assign or change HODs for departments

### HOD

- View dashboard stats
- Manage teachers within the same department
- Manage students within the same department
- Create and edit classes
- Create and edit subjects
- Review class details and monthly class reports
- Export teacher, student, class, subject, and report data to CSV

### Teacher

- View assigned class information
- View assigned subject list
- Record daily subject attendance
- Move or clear attendance dates
- Review monthly subject and class reports
- Export class and subject report data to CSV

### Authentication

- Login for `Admin` and `User` accounts
- Registration route for user creation
- Logout
- Password reset request for teachers
- Password reset completion using a tokenized link

## Project Structure

```text
app/
  (auth)/                 login, register, reset-password pages
  (protected)/            protected UI routes
    (admin)/              admin-only pages
    (HOD)/                department/HOD pages
    (teacher)/            teacher pages
    dashboard/            role-aware dashboard
  api/                    route handlers
components/               shared UI and feature components
lib/
  actions/                server-side data fetching and mutations
  email/                  Mailtrap and Resend email helpers
  schema/                 Zod request schemas
  auth.ts / guard.ts      auth and role checks
  jwt.ts                  JWT and auth cookie helpers
  prisma.ts               Prisma client setup
prisma/
  schema.prisma           database schema
  seed.ts                 seed script entry point
generated/prisma/         generated Prisma client output
public/                   static assets
```

## Data Model

The Prisma schema is centered around these entities:

- `Admin`
- `User`
- `Department`
- `Class`
- `Subject`
- `Student`
- `AcademicYear`
- `DailyAttendance`
- `MonthlySubAttendance`
- `MonthlyClassAttendance`

Important enums include:

- `Role`: `ADMIN`, `HOD`, `TEACHER`
- `Gender`
- `Semester`
- `Year`
- `SubjectType`
- `Month`

## Routing and Access Model

The root route redirects to `/dashboard`.

UI access is role-based:

- `admin`: `dashboard`, `departments`, `teachers`, `students`, `academic-years`, `head-of-department`, `settings`
- `department`: `dashboard`, `teachers`, `students`, `classes`, `subjects`, `my-class`, `my-subjects`
- `teacher`: `dashboard`, `my-class`, `my-subjects`

Role mapping in the frontend:

- Prisma `ADMIN` -> UI `admin`
- Prisma `HOD` -> UI `department`
- Prisma `TEACHER` -> UI `teacher`

## API Areas

The app exposes route handlers under `app/api`.

Key route groups:

- `api/auth` for login, logout, register, and reset password
- `api/me` for current authenticated account info
- `api/admin`
- `api/teachers`
- `api/departments`
- `api/classes`
- `api/students`
- `api/subjects`
- `api/academic-years`
- `api/dashboard/hod/stats`
- CSV export endpoints for teachers, students, classes, subjects, my-class, my-subjects, monthly subject reports, and monthly class reports

## Attendance Flow

Attendance is tracked in two layers:

1. Daily attendance per student, subject, class, day, and month.
2. Monthly summaries for each subject and class, tied to an academic year.

The codebase also includes server actions for:

- loading teacher/HOD attendance views
- saving daily attendance
- syncing monthly attendance
- moving attendance from one date to another
- clearing attendance for a selected date

## Environment Variables

The codebase expects at least these environment variables for a full setup:

- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV`
- `APP_BASE_URL`
- `NEXT_PUBLIC_BASE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `MAILTRAP_USERNAME`
- `MAILTRAP_PASSWORD`
- `MAILTRAP_SENDER_NAME`
- `MAILTRAP_SENDER_EMAIL`
- `RESEND_API_KEY`
- `RESEND_SENDER_EMAIL`
- `APP_NAME`
- `SUPPORT_EMAIL`
- `EMAIL_LOGO_URL`

## Local Development

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL database

### Install dependencies

```bash
pnpm install
```

### Configure environment

Create a `.env` file with the required variables listed above.

### Generate Prisma client

```bash
pnpm prisma generate
```

### Run migrations

```bash
pnpm prisma migrate dev
```

### Start the development server

```bash
pnpm dev
```

App URL:

```text
http://localhost:3000
```

## Available Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm commit
```

Useful Prisma commands:

```bash
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma studio
```

## Notes for Deployment

- Sentry is enabled through `withSentryConfig` in `next.config.ts`.
- The Prisma client is configured with the Neon adapter in `lib/prisma.ts`.
- Cloudinary support is present for uploads.
- Email templates and transport helpers exist for both Mailtrap and Resend.

## Current Gaps and Caveats

These are worth knowing before production use:

- `prisma/seed.ts` is still placeholder Prisma starter code and does not match the current schema.
- `middleware.ts` contains API-branch logic, but the matcher excludes `/api`, so API protection depends on route-level guards instead of middleware.
- Some client/API helpers use hardcoded `http://localhost:3000` URLs, which should be replaced with environment-based configuration before deployment.
- No automated test suite is currently configured in `package.json`.
- A few route files still contain commented authorization code, so the API surface should be audited before production rollout.

## Recommended Next Steps

- Replace the placeholder seed script with real attendance-system seed data.
- Centralize base URL handling for browser and server usage.
- Add automated tests for auth, role access, attendance entry, and exports.
- Review every API route for consistent authorization enforcement.
- Add a setup section for creating the first admin account if this project will be handed to new developers.
