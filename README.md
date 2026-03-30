# Attendance Management System

A multi-role attendance and academic management platform built with **Next.js (App Router)**, **TypeScript**, and **Prisma**.

This project supports workflows for:
- **Admin**: manage departments, HOD users, and admin-level operations
- **HOD (Head of Department)**: manage teachers, classes, subjects, and students in their department
- **Teacher**: access teaching-focused views (`my-class`, `my-subjects`)

---

## 1. Tech Stack

- **Framework**: Next.js `15.5.6` (App Router)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS v4, Radix UI
- **ORM**: Prisma v7
- **Database**: PostgreSQL (using `@prisma/adapter-neon` in current config)
- **Validation**: Zod
- **Auth**: JWT in `httpOnly` cookie
- **File Uploads**: Cloudinary
- **Email**: Resend + Mailtrap/Nodemailer

---

## 2. Core Architecture

### Backend
- Route handlers are under `app/api/**/route.ts`
- Prisma schema is in `prisma/schema.prisma`
- Shared auth/guard helpers:
  - `lib/jwt.ts`
  - `lib/guard.ts`
  - `lib/auth.ts`

### Frontend
- Public auth pages: `app/(auth)/**`
- Protected pages: `app/(protected)/**`
- Shared components: `components/**`

### Important runtime behavior
- Root path `/` redirects to `/dashboard` (see `next.config.ts`)
- JWT token cookie name: `token`
- Protected UI routing also checks a client-side cookie named `role` (`admin`, `department`, `teacher`)

---

## 3. Project Structure

```txt
app/
  (auth)/
    login/
    register/
    reset-password/
  (protected)/
    dashboard/
    (admin)/
      departments/
      teachers/
      students/
      settings/
    (HOD)/
      classes/
      (subject)/subjects/
    (teacher)/
      my-class/
      my-subjects/
  api/
    auth/
    admin/
    teachers/
    departments/
    classes/
    students/
    subjects/
lib/
  prisma.ts
  jwt.ts
  guard.ts
  fetchHandler.ts
  schema/
prisma/
  schema.prisma
components/
constants/
```

---

## 4. Data Model Overview (Prisma)

Main entities:
- `Admin`
- `User` (roles: `ADMIN`, `HOD`, `TEACHER`)
- `Department`
- `Class`
- `Student`
- `Subject`
- `DailyAttendance`
- `MonthlySubAttendance`
- `MonthlyClassAttendance`
- `AcademicYear`

Role and domain enums are defined in `prisma/schema.prisma`.

---

## 5. Authentication & Authorization

### Auth style
This project uses **token-based auth (JWT)** stored in an **`httpOnly` cookie**.

### Flow
1. `POST /api/auth/login`
2. Server verifies credentials
3. Server signs JWT payload `{ userId }`
4. Cookie `token` is set with:
   - `httpOnly: true`
   - `sameSite: "strict"`
   - `maxAge: 7d`
   - `secure: true` in production
5. Protected APIs resolve user/admin using `userId` from JWT

### Guards
- `requireAuth(request, { roles? })` for `User` table checks
- `requireAdminOrUserRoles(request, roles)` for admin-or-user access checks

### UI role cookie
The protected frontend currently reads a separate client cookie `role` for route visibility and sidebar items.

---

## 6. API Surface

All routes are under `/api`.

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `POST /api/auth/reset-password?token=<token>`

### Admin
- `GET /api/admin`
- `POST /api/admin`
- `GET /api/admin/:id`
- `DELETE /api/admin/:id`

### Teachers
- `GET /api/teachers`
- `POST /api/teachers`
- `GET /api/teachers/:id`
- `PUT /api/teachers/:id`
- `DELETE /api/teachers/:id`
- `GET /api/teachers/export` (CSV)

### Departments
- `GET /api/departments`
- `POST /api/departments` (multipart for logo upload)
- `GET /api/departments/:id`
- `PUT /api/departments/:id`
- `DELETE /api/departments/:id`

### Classes
- `GET /api/classes`
- `POST /api/classes`
- `GET /api/classes/:id`
- `PUT /api/classes/:id`
- `DELETE /api/classes/:id`

### Students
- `GET /api/students`
- `POST /api/students`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

### Subjects
- `GET /api/subjects`
- `POST /api/subjects`
- `GET /api/subjects/:id`
- `PUT /api/subjects/:id`
- `DELETE /api/subjects/:id`

---

## 7. Local Development Setup

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL database

### Install dependencies

```bash
pnpm install
```

### Configure environment
Create `.env` (or copy from your existing `.env` conventions) and provide values for:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_BASE_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`
- `RESEND_SENDER_EMAIL`
- `MAILTRAP_USERNAME`
- `MAILTRAP_PASSWORD`
- `MAILTRAP_SENDER_NAME`
- `MAILTRAP_SENDER_EMAIL`
- `MAILTRAP_TOKEN` (if used in your environment)
- `NODE_ENV`

### Prisma setup

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

### Run app

```bash
pnpm dev
```

Open: `http://localhost:3000`

---

## 8. Available Scripts

From `package.json`:

```bash
pnpm dev      # run development server
pnpm build    # production build
pnpm start    # run production server
pnpm lint     # run ESLint
pnpm commit   # commitizen prompt
```

Useful Prisma commands:

```bash
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma studio
```

---

## 9. Example API Calls

### Login

```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Password123"}'
```

### Authenticated request with cookie jar

```bash
# 1) login and save cookies
curl -c cookie.txt -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Password123"}'

# 2) call protected endpoint
curl -b cookie.txt http://localhost:3000/api/classes
```

### Create class (HOD)

```bash
curl -b cookie.txt -X POST http://localhost:3000/api/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IV CEIT",
    "semester": "first_semester",
    "year": "FOURTH",
    "userId": null,
    "academicYearId": null
  }'
```

---

## 10. Frontend Role Access Matrix

`ClientProtected` currently maps route access by role cookie:

- `admin`: `dashboard`, `departments`, `teachers`, `students`, `head-of-department`, `settings`
- `department`: `dashboard`, `teachers`, `students`, `classes`, `subjects`, `my-class`, `my-subjects`
- `teacher`: `dashboard`, `my-class`, `my-subjects`

---

## 11. Operational Notes / Caveats

- `middleware.ts` currently uses matcher:
  - `"/((?!api|_next|.*\\..*).*)"`
  - This means middleware does **not** run on `/api/*`; API protection relies on route-level guards.
- Some API files contain commented-out auth checks. Review and harden before production deployment.
- `prisma/seed.ts` appears to be template/placeholder content and is not aligned with the current schema.
- `tsconfig.json` uses `"ignoreDeprecations": "6.0"`; with some TypeScript versions this can fail `tsc --noEmit`.

---

## 12. Deployment Checklist

Before production rollout:
- Enforce role guards on every write/read-sensitive API endpoint
- Remove or replace placeholder/mock dashboard data from `constants/index.constants.ts`
- Align frontend role cookie handling with server-issued auth context
- Rotate and secure all secrets
- Add CI checks for `lint`, `build`, and DB migration consistency
- Add integration tests for auth + RBAC critical paths

---

## 13. Contributing

- Use feature branches
- Keep API validation in `lib/schema/*`
- Keep auth logic centralized in `lib/jwt.ts` and `lib/guard.ts`
- Use `pnpm commit` for conventional commit prompts

