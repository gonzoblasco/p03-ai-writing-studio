# Agent Tasks Handoff: Next.js 15 & Supabase CRUD Starter

This document tracks the core implementation tasks for the Full Stack Starter template.

## Tasks

- [x] Initialize Next.js 15 project (Next 16 used as per workspace context)
- [x] Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `clsx`, `tailwind-merge`
- [x] Initialize shadcn/ui and add components: `card`, `button`, `input`, `badge`, `dialog`, `label`, `select`, `sonner` (toast)
- [x] Setup Supabase Client & Middleware
    - [x] `lib/supabase/client.ts`
    - [x] `lib/supabase/server.ts`
    - [x] `middleware.ts`
- [x] Implement Auth System
    - [x] `lib/actions/auth.ts`: `signIn`, `signUp`, `signOut`
    - [x] `app/(auth)/login/page.tsx`
    - [x] `app/(auth)/register/page.tsx`
- [x] Implement Tasks CRUD
    - [x] `lib/actions/tasks.ts`: `createTask`, `updateTask`, `deleteTask`, `getTasks`
    - [x] `components/tasks/TaskCard.tsx`
    - [x] `components/tasks/TaskForm.tsx` (Handles Create & Edit)
    - [x] `components/tasks/TaskList.tsx` (Handles list & filtering)
- [x] Build Dashboard
    - [x] `app/(dashboard)/page.tsx`: Layout with tasks list and filters

## Context & Constraints

- **Stack**: Next.js 15, Supabase.
- **No Prisma**: Use `@supabase/supabase-js` directly.
- **Server Actions**: All logic in `lib/actions/`.
- **Auth Layer**: Middleware should handle session refreshes and protect routes under `/app/(dashboard)`.
- **RLS**: Database policies are defined in `schema.sql`.

## Files Reference

- [schema.sql](file:///Users/gonzoblasco/Projects/full-stack-starter/schema.sql)
- [implementation_plan.md](file:///Users/gonzoblasco/Projects/full-stack-starter/implementation_plan.md)
