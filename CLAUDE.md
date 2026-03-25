# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server with Turbopack on port 3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
npm run prepare  # Install Husky hooks (runs automatically post-install)
```

Pre-commit hooks run automatically via Husky: ESLint + Prettier on staged `src/**/*.{js,jsx,ts,tsx}` files. Pre-push hook runs `npm run build` — fix build errors before pushing.

## Architecture

**Stack:** Next.js 15.5.9 (App Router) + React 19 + TypeScript 5.9.3, shadcn/ui, Tailwind CSS 4, Zustand 5, React Query 5, NextAuth.js 4, next-intl 4, Axios, Zod 4, React Hook Form 5.

### Directory Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/  # NextAuth route handler + options + type augmentation
│   └── [lang]/                  # Locale-prefixed App Router pages (uz/en/ru, default: uz)
│       ├── auth/                # Login page (Telegram OTP + Google OAuth)
│       ├── bot/[id]/            # Per-bot management
│       │   ├── plans/           # Subscription plans
│       │   ├── collection/      # Data collections
│       │   ├── monitoring/      # Per-bot analytics
│       │   ├── send-message/    # Broadcast messages
│       │   │   └── send-new-message/
│       │   ├── web-app/         # Web app configuration
│       │   ├── release/         # Bot release management
│       │   ├── files/           # Per-bot file management
│       │   └── messages/        # Message templates
│       ├── billing/             # Billing & subscription management
│       ├── files/               # Global file management
│       ├── monitoring/          # Global analytics dashboard
│       ├── profile/             # User profile & settings
│       ├── templates/           # Template marketplace
│       ├── template-earnings/   # Template revenue tracking
│       ├── template-submissions/ # Template submission workflow
│       └── tickets/             # Support tickets
├── features/                    # Feature modules
│   ├── auth/                    # types/ + components/ (login form, password section)
│   ├── bot/                     # plans/, detail/, release/, files/
│   ├── collection/              # components/ (sidebar, data-table, schema-view, dialogs)
│   ├── monitoring/              # types/, dashboard/ (cpu/disk/ram/traffic cards), utils/
│   └── [billing, templates, tickets, home, ...]
└── shared/
    ├── components/
    │   ├── ui/                  # 51+ shadcn/ui components (Radix UI primitives)
    │   ├── common/              # Reusable: page-header, metric-card, plan-card,
    │   │                        #   visitor-chart, delete-modal, select-plan, analytics
    │   └── layout/              # app-sidebar, theme-provider, top-loading-bar,
    │                            #   sidebar-inset-header
    ├── services/
    │   ├── instance.ts          # Axios instances (instanceAuth + instance)
    │   ├── requests/            # Per-domain API functions:
    │   │   ├── auth.ts          #   Login, GetMe, RefreshAccessToken, UpdateProfile
    │   │   ├── file.ts
    │   │   ├── message.ts
    │   │   ├── collection.ts
    │   │   ├── monitoring.ts
    │   │   ├── template-withdrawal.ts
    │   │   └── template-submission.ts
    │   └── react-query/
    │       └── use-react-query-action.ts  # Primary data-fetching hook
    ├── store/
    │   └── chat-message.ts      # Zustand store for message composition state
    ├── hooks/
    │   ├── use-debounce.ts      # Debounce hook with cleanup
    │   └── use-mobile.ts        # Responsive breakpoint (768px)
    ├── lib/
    │   ├── env.ts               # Zod env validation (runs at startup)
    │   ├── constants.ts         # TIME_CONSTANTS, API_CONSTANTS, UI_CONSTANTS, VALIDATION_CONSTANTS
    │   ├── utils.ts             # cn() and other helpers
    │   ├── query-generator.ts   # URL query string builder
    │   ├── format-currency.ts   # Currency formatting
    │   ├── parse-price.ts       # Price parsing
    │   └── input-validators.ts  # Custom Zod/form validators
    ├── types/
    │   ├── http.ts              # API response wrappers (see Type Conventions)
    │   ├── bot.ts               # BotType
    │   ├── collection.ts
    │   ├── plan.ts
    │   ├── release.ts
    │   ├── project.ts
    │   ├── broadcast-message.ts
    │   └── chat-message.ts
    ├── messages/                # i18n translation files
    │   ├── uz.json              # Primary (Uzbek)
    │   ├── en.json
    │   ├── ru.json
    │   └── jp.json
    └── i18n/
        ├── routing.ts           # Locale config (locales: uz/en/ru, default: uz)
        └── request.ts           # Server-side message loader
```

### Key Patterns

**Routing:** All routes live under `src/app/[lang]/`. Middleware (`src/middleware.ts`) enforces locale routing and authentication — public routes are `/website/*` and the landing page (`/` and `/{lang}/`). Auth redirects to `/uz/auth`; sign-out redirects to `/uz/website`. Import alias `@/*` maps to `src/*`.

**Authentication:** NextAuth.js 4 with two providers:
- **Credentials:** Telegram OTP → `Login()` → backend returns `access` + `refresh` tokens
- **Google OAuth:** ID token → `/api/v1/auth/google` → backend returns tokens

Sessions contain `access`/`refresh` tokens. Roles: `admin`, `user`, `moderator`. Token expiry: access = 5 min, refresh = 7 days. Automatic refresh via `RefreshAccessToken()` in the JWT callback.

**API calls:** Two Axios instances in `shared/services/instance.ts`:
- `instanceAuth` — auto-attaches Bearer token from session, handles 401 with token refresh + retry
- `instance` — unauthenticated requests

Use `useReactQueryAction()` for all data fetching:

```typescript
const { data, isLoading, error } = useReactQueryAction<ResponseType>({
  url: "/v1/bots/[id]/messages/",  // [paramName] auto-substituted from route params
  query: { page: 1, search: term }, // appended as query string
  debounceTime: 300,               // optional debounce (ms)
  enabled: !!botId,                // conditional fetching
});
```

Retry: exponential backoff, max 30s, skips on 401/403/404. Stale time: 5 min. `refetchOnWindowFocus` disabled globally.

**State:** React Query for server state; Zustand for client state (e.g., `useChatMessageStore` manages message text, files, status, and inline button layout).

**i18n:** Translation keys in `shared/messages/{uz,en,ru,jp}.json`. Access via `useTranslations()` from next-intl. Locale comes from URL segment. Always use locale-aware navigation:

```typescript
import { Link, useRouter, redirect } from "@/shared/i18n/routing";
// Automatically prepends the current locale to hrefs
```

**Forms:** React Hook Form + Zod schemas. Custom validators live in `shared/lib/input-validators.ts`.

**URL Rewrites:** `next.config.ts` proxies constructor and sales service endpoints to external URLs — bot constructor iframe traffic goes through these rewrites. Allowed image domains: `localhost`, `localhost:3002`, `192.168.3.1:3000`, `api.botmother.uz`.

## Type Conventions

Use shared HTTP response wrappers from `shared/types/http.ts`:

```typescript
APIListResponse<T>         // Paginated list: { count, next, previous, results: T[] }
ApiRetrieveResponse<T>     // Single item wrapper
APIDetailCreateResponse<T> // Create/update response
ScrollAPIResponse<T>       // Cursor/scroll-based pagination
```

## Constants Reference

All timing, API, UI, and validation constants live in `shared/lib/constants.ts`:

```typescript
TIME_CONSTANTS.ACCESS_TOKEN_EXPIRES   // 5 minutes
TIME_CONSTANTS.REFRESH_TOKEN_EXPIRES  // 7 days
TIME_CONSTANTS.DEBOUNCE_DELAY         // 300ms
TIME_CONSTANTS.RETRY_DELAY_MAX        // 30s

API_CONSTANTS.MAX_RETRY_ATTEMPTS      // 3
API_CONSTANTS.TIMEOUT                 // 10s

UI_CONSTANTS.PAGINATION_SIZE          // 20
UI_CONSTANTS.MAX_FILE_SIZE            // 10MB

VALIDATION_CONSTANTS.OTP_LENGTH       // 6
VALIDATION_CONSTANTS.MIN_PASSWORD     // 8
```

## Environment Variables

Validated at startup via Zod in `shared/lib/env.ts`. All variables except `NODE_ENV` are optional in the schema but required at runtime:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API` | Backend API base URL |
| `CONSTRUCTOR_URL` | Bot constructor service URL (e.g., `http://localhost:3001`) |
| `SALES_URL` | Sales/website service URL (e.g., `http://localhost:3002`) |
| `NEXTAUTH_SECRET` | JWT signing secret (min 32 chars) |
| `NEXTAUTH_URL` | Canonical site URL for NextAuth.js |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NODE_ENV` | `development` / `production` / `test` |
| `PORT` | Server port (default: 3000) |
| `DEBUG` | Debug mode flag (default: false) |

Copy `.env.example` to `.env.local` and populate before running.

## ESLint & Formatting

Config: `eslint.config.mjs` extending `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`.

Active rule overrides:
- `@typescript-eslint/no-explicit-any` — **off** (use `any` where needed)
- `react/no-unescaped-entities` — **off**
- `@typescript-eslint/no-unused-vars` — **warn**, ignores identifiers starting with `_`

Lint-staged (pre-commit) runs on `src/**/*.{js,jsx,ts,tsx}`:
1. `eslint --fix`
2. `prettier --write`

## CI/CD

**File:** `.github/workflows/deploy.yaml`

**Trigger:** Git tags matching `*-prod` (production) or `*-dev` (staging).

**Pipeline:**
1. Checkout code
2. Populate `.env` from `.env.example` using GitHub Secrets/Variables
3. Build Docker image (no-cache)
4. Push to registry as `{DOCKER_REGISTRY}/botmother-admin:{tag}` and `latest`

**Required GitHub Secrets:** `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DOCKER_REGISTRY`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`

**Required GitHub Variables:** `NEXT_PUBLIC_API`, `NEXTAUTH_URL`, `DOCKER_REGISTRY`
