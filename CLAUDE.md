# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server with Turbopack on port 3000
npm run build    # Production build
npm run lint     # ESLint check
```

Pre-commit hooks run automatically via Husky: ESLint + Prettier on staged `src/` files. Pre-push hook runs `npm run build` — fix build errors before pushing.

## Architecture

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript, shadcn/ui, Tailwind CSS 4, Zustand, React Query, NextAuth.js 4, next-intl, Axios, Zod.

### Directory Structure

```
src/
├── app/[lang]/          # Locale-prefixed App Router pages (uz/en/ru default: uz)
│   ├── auth/            # Login page
│   ├── bot/[id]/        # Per-bot management (files, monitoring, send-message, plans, release, web-app, collection, messages)
│   ├── templates/       # Template marketplace
│   ├── tickets/         # Support tickets
│   ├── monitoring/      # Global analytics
│   ├── profile/         # User settings
│   └── api/auth/        # NextAuth route handler
├── features/            # Feature modules (auth, bot, templates, tickets, monitoring, home, billing)
└── shared/
    ├── components/ui/   # shadcn/ui components
    ├── services/        # API layer
    │   ├── instance.ts  # Axios instances (instanceAuth + instance)
    │   ├── requests/    # Per-domain API functions
    │   └── react-query/ # useReactQueryAction hook
    ├── store/           # Zustand stores
    ├── hooks/           # Shared custom hooks
    ├── lib/             # Utilities + env validation (Zod)
    ├── types/           # TypeScript types
    ├── messages/        # i18n translation files (en/uz/ru/jp)
    └── i18n/            # next-intl routing + request config
```

### Key Patterns

**Routing:** All routes live under `src/app/[lang]/`. Middleware (`src/middleware.ts`) enforces locale routing and authentication — public routes are `/website/*` and the landing page (`/` and `/{lang}/`). Auth redirects to `/uz/auth`; sign-out redirects to `/uz/website`. Import alias `@/*` maps to `src/*`.

**Authentication:** NextAuth.js with two providers: Credentials (Telegram OTP → returns access+refresh tokens) and Google OAuth. Sessions contain `access`/`refresh` tokens. Roles: `admin`, `user`, `moderator`.

**API calls:** Two Axios instances in `shared/services/instance.ts`:
- `instanceAuth` — auto-attaches Bearer token from session, handles 401 with token refresh retry
- `instance` — unauthenticated requests

Use `useReactQueryAction()` hook (`shared/services/react-query/use-react-query-action.ts`) for data fetching — it handles URL param substitution (replaces `[paramName]` with current route params), query strings, debounce, retry with exponential backoff (max 30s, skips on 401/403/404), and 5-min stale time. `refetchOnWindowFocus` is disabled globally.

**State:** React Query for server state; Zustand for client state (e.g., `useChatMessageStore` for message composition).

**i18n:** Translation keys in `shared/messages/{en,uz,ru,jp}.json`. Access via `useTranslations()` from next-intl. Locale comes from URL segment.

**Forms:** React Hook Form + Zod schemas for validation.

**Environment:** Variables validated at startup via Zod in `shared/lib/env.ts`. Required: `NEXT_PUBLIC_API`, `CONSTRUCTOR_URL`, `SALES_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

**URL Rewrites:** `next.config.ts` proxies constructor and sales service endpoints to external URLs — bot constructor iframe traffic goes through these rewrites.
