# Kislay Naturals — Full-Stack Codebase Audit

> **Reviewer perspective:** Expert full-stack developer performing a deep code review across frontend, backend, Supabase integration, and state management.

---

## 🔴 Executive Summary

The project is a Next.js 14 (App Router) e-commerce site using Supabase for auth/DB, Razorpay for payments, Redux Toolkit for cart/state, and a custom AuthContext for session management. The core concept is solid but the execution has **multiple critical architectural problems** that make the codebase fragile, over-engineered in the wrong places, and under-engineered in critical security areas.

**Overall health: ⚠️ Needs significant refactoring before scaling.**

---

## 1. 🏗️ Architecture Overview

```
src/
├── app/                    (Next.js App Router)
│   ├── api/               (18 route groups — many are debug/test routes left in production)
│   │   ├── auth/          (login, logout, me, refresh, signup)
│   │   ├── orders/        
│   │   ├── create-razorpay-order/
│   │   ├── save-order/    ← duplicate of orders/
│   │   ├── webhooks/      (Razorpay webhook)
│   │   ├── admin/
│   │   ├── debug/         ← 🔴 TEST ROUTE IN PRODUCTION
│   │   ├── debug-auth/    ← 🔴 TEST ROUTE IN PRODUCTION
│   │   ├── test-blogs/    ← 🔴 TEST ROUTE IN PRODUCTION
│   │   ├── test-order-creation/ ← 🔴 TEST ROUTE IN PRODUCTION
│   │   ├── test-supabase/ ← 🔴 TEST ROUTE IN PRODUCTION
│   │   └── test-token/    ← 🔴 TEST ROUTE IN PRODUCTION
│   └── [pages]/
├── components/            (25 components — mixed quality)
├── contexts/
│   └── AuthContext.tsx    (784 lines — massively bloated)
├── lib/
│   ├── auth/              (tokenValidation.ts, sessionManager.ts)
│   ├── middleware/        (auth.ts, admin.ts, csrf.ts, rateLimit.ts)
│   ├── supabase.ts
│   ├── email.ts
│   └── razorpay.ts
└── store/                 (Redux: .js files in a TypeScript project)
    ├── slices/
    │   ├── cartSlice.js   ← 🟡 .js in TS project
    │   ├── orderSlice.js  ← 🟡 .js in TS project
    │   └── productSlice.js ← 🟡 .js in TS project
```

---

## 2. 🔴 Critical Issues (Fix First)

### 2.1 — Six Test/Debug Routes Exposed in Production

**Files:** `src/app/api/debug/`, `src/app/api/debug-auth/`, `src/app/api/test-blogs/`, `src/app/api/test-order-creation/`, `src/app/api/test-supabase/`, `src/app/api/test-token/`

**Problem:** These routes are live and accessible at `/api/debug`, `/api/test-supabase`, etc. They likely expose internal auth state, DB connection info, or token data to anyone who hits the URL.

**Fix:** **Delete all 6 directories immediately.**

---

### 2.2 — Broken CSRF Implementation (In-Memory Store = Stateless Death)

**File:** `src/lib/middleware/csrf.ts`

```typescript
const csrfStore: CSRFStore = {}; // ← lives in server memory
```

**Problem:** The CSRF token store is a plain JavaScript object in server memory. In Vercel's serverless environment, **each function invocation may be a fresh instance**. The GET call to `/api/auth/login` stores the token in one lambda, then the POST call hits a different lambda — the token is gone. **CSRF validation always fails silently** (or always passes if never validated). This is an illusion of security.

**Fix:** Either:
- Use Supabase to persist CSRF tokens (a `csrf_tokens` table with TTL), OR
- Switch to the `SameSite=Strict` cookie pattern (which is what Supabase handles natively), OR
- Use the `double-submit cookie` pattern where the token is also stored in the cookie

---

### 2.3 — Duplicate Order Creation Endpoints

**Files:** `src/app/api/orders/route.ts` AND `src/app/api/save-order/route.ts` AND `src/app/api/create-razorpay-order/route.ts`

**Problem:** There are **three separate API routes** involved in order creation. This creates confusion: which one actually creates the DB record? Which one is the source of truth? This is a vibe-coded pattern where each new feature got its own route instead of extending the canonical one.

**Fix:** Collapse into a two-step clean flow:
1. `POST /api/razorpay/create-order` → creates Razorpay order only
2. `POST /api/orders` → saves the order to Supabase after payment verification

---

### 2.4 — Supabase Client Misuse: `supabase` (anon) Used for Server-Side Auth Validation

**File:** `src/lib/auth/tokenValidation.ts` (line 39)

```typescript
const { data: { user }, error } = await supabase.auth.getUser(token);
```

**File:** `src/lib/middleware/auth.ts` (line 13)

```typescript
const { data, error } = await supabase.auth.getUser(token)
```

**Problem:** Both the middleware AND the token validation use the **anonymous/public client** (`supabase`) to validate tokens server-side. The correct approach is to use `@supabase/ssr` which creates a request-scoped client with the user's session baked in. Using the singleton anon client for auth state is a known anti-pattern that Supabase explicitly warns against.

**Also:** The `supabase.ts` file exports **both** the anon client AND the service role client from the same file. The service role key (`SUPABASE_SERVICE_ROLE_KEY`) is available at build time because `NEXT_PUBLIC_*` variables are bundled. But non-NEXT_PUBLIC env vars should NEVER be referenced in files that might get bundled into client code. This file is imported by both client and server code.

**Fix:**
- Install `@supabase/ssr`
- Create separate `createServerClient` and `createBrowserClient` factory functions
- Never import `supabaseAdmin` in any component or client-side file

---

### 2.5 — AuthContext Is 784 Lines and Has Multiple Competing Auth Systems

**File:** `src/contexts/AuthContext.tsx`

**Problems:**
1. **Triple auth redundancy:** The app has (a) `AuthContext` with `checkAuth()`, (b) `SessionManager` class in `lib/auth/sessionManager.ts`, and (c) periodic `setInterval` polling for admin users — all running simultaneously and calling `/api/auth/me` repeatedly.
2. **sessionManager.ts has `'use client'` at the top but imports `extractTokenFromRequest`** which is a `NextRequest` server function — this will crash when the client tries to use it.
3. **localStorage used as a trust source:** On mount, the app sets `user` state from `localStorage` before server validation. A malicious user can craft any JSON in localStorage and momentarily appear as admin in the UI.
4. **`checkAuth` has circular dependency:** It depends on `user` and calls `refreshToken` which calls `checkAuth` again. With forced check, this can loop.
5. **`isCheckingAuth` is a state variable** (causes re-renders) instead of a `ref` (no re-renders).
6. The toast system (230+ lines) is embedded inside AuthContext and has **nothing to do with auth**.

**Fix:**
- Delete `SessionManager` class — Supabase's `onAuthStateChange` listener handles this natively
- Move toast system to a dedicated `ToastContext` or use `react-hot-toast`/`sonner`
- Use Supabase's native `onAuthStateChange` as the single source of truth
- Remove all localStorage user caching

---

### 2.6 — Cart Slice Breaks SSR / Causes Hydration Errors

**File:** `src/store/slices/cartSlice.js` (lines 4-16)

```javascript
const cartItemsFromStorage = typeof window !== 'undefined' && localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];
```

**Problem:** This code runs at **module initialization time** (when the Redux store is created). On the server, `window` is `undefined`, so the slice initializes with `[]`. On the client, it reads from localStorage. This means the Redux store **has different initial state on server vs. client** = React hydration mismatch error in Next.js App Router.

**Fix:** Initialize cart state as `[]` always. Load from localStorage in a `useEffect` after hydration using a `ClientOnly` wrapper or a proper `useHydration` hook.

---

## 3. 🟠 Major Issues (Fix Soon)

### 3.1 — Redux Slices Are `.js` Files in a TypeScript Project

**Files:** `cartSlice.js`, `orderSlice.js`, `productSlice.js`

The entire project is TypeScript (`.tsx`/`.ts`) but the Redux slices are plain JavaScript. This means **no type safety** for the most critical state in the app (cart, orders, products). The `store.ts` imports them with TypeScript but can't infer their types properly.

**Fix:** Rename to `.ts`, add proper `PayloadAction` types, define `CartItem`, `OrderState`, `ProductState` interfaces.

---

### 3.2 — Duplicate `fetchJSON` Utility in Two Separate Files

**Files:** `src/store/slices/orderSlice.js` (line 4) and `src/store/slices/productSlice.js` (line 4)

Identical `fetchJSON` helper function is copy-pasted in both files. No shared utility.

---

### 3.3 — `makeStore` + `store` Both Exported from store.ts

**File:** `src/store/store.ts` (lines 14-25)

```typescript
export const makeStore = () => { return configureStore({...}); };
export const store = makeStore(); // ← singleton instance
```

`makeStore` is defined for SSR compatibility (each request gets its own store) but then `store` is also exported as a singleton. If components import `store` directly (instead of the `ReduxProvider`'s store), they'll use the singleton, breaking SSR isolation.

---

### 3.4 — `serializableCheck: false` in Redux Middleware

**File:** `src/store/store.ts` (line 19)

```typescript
serializableCheck: false,
```

This disables Redux's built-in serialization check globally. This exists because `Date` objects or class instances are being stored in Redux (likely `Order.createdAt`). Fix the types instead of disabling the check — serialization errors are safety guardrails.

---

### 3.5 — Admin Role Stored in `user_metadata` — Easily Escalated

**File:** `src/lib/auth/tokenValidation.ts` (line 58)

```typescript
const role = (user.user_metadata as any)?.role || 'user';
```

**Problem:** In Supabase, `user_metadata` is **user-writable** by default. Any authenticated user can call `supabase.auth.updateUser({ data: { role: 'admin' } })` and bypass the admin check. 

**Fix:** Store roles in `app_metadata` (server-writable only) which requires the service role key to update. This is the critical distinction in Supabase's auth model.

---

### 3.6 — `supabase.ts` Exports Service Role Client with No Guard

**File:** `src/lib/supabase.ts`

The `supabaseAdmin` client using the `SUPABASE_SERVICE_ROLE_KEY` is defined in a file that can be imported anywhere — including accidentally in client components. The service role key bypasses ALL row-level security. If it ever gets bundled in client-side code, the entire database is exposed.

**Fix:**
- Move `supabaseAdmin` to `src/lib/supabase-admin.ts` (server-only)
- Add `import 'server-only'` at the top to get a build error if accidentally imported client-side

---

### 3.7 — Duplicate `metadata` + `<head>` Tags in layout.tsx

**File:** `src/app/layout.tsx`

Open Graph and icon tags are defined **twice**: once in the `metadata` export (the Next.js way) and again as raw `<link>`/`<meta>` tags in `<head>`. This causes duplicate meta tags in the HTML output, which can confuse crawlers and social sharing previews.

**Fix:** Remove the manual `<head>` block entirely — the `metadata` export handles all of it.

---

### 3.8 — `ToastContainer` from react-toastify AND Custom Toast in AuthContext

**File:** `src/app/layout.tsx` (line 117) + `src/contexts/AuthContext.tsx` (lines 710-773)

The app has **two separate toast systems running simultaneously**:
1. `react-toastify` (`<ToastContainer>` in layout)
2. A custom hand-rolled toast with `useState` inside `AuthContext`

**Fix:** Pick one. `react-toastify` or a lighter alternative like `sonner`. Delete the 100+ lines of custom toast in AuthContext.

---

## 4. 🟡 Moderate Issues (Technical Debt)

### 4.1 — `generate_qr.py` and `.svg` QR Files in Project Root

**Files:** `generate_qr.py`, `lab_report_qr.svg`, `manufacturer_details_qr.svg`

A Python script and generated SVG files sitting in the Next.js project root. These are one-off scripts that should never be in a web project repo. They'll get deployed to Vercel unnecessarily.

---

### 4.2 — SQL Migration Files Outside Supabase Directory

**Files:** `supabase/update_original_price_to_399.sql`, `supabase/update_product_variants.sql`

These are ad-hoc SQL files sitting outside the `migrations/` folder. They likely represent one-off data fixes that were run manually. They clutter the supabase directory and aren't part of the migration chain.

---

### 4.3 — `AuthContext` Imports `SessionManager` Which Has `NextRequest` Dependency

**File:** `src/lib/auth/sessionManager.ts` (line 3)

```typescript
import { validateToken, extractTokenFromRequest } from './tokenValidation';
```

`extractTokenFromRequest` takes a `NextRequest` which is a server-only type. The `sessionManager.ts` has `'use client'` but imports a server type. This will fail or get tree-shaken in unpredictable ways.

---

### 4.4 — `content-sync.ts` and `notifications.ts` May Be Dead Code

**Files:** `src/lib/content-sync.ts`, `src/lib/notifications.ts`

These files exist in `lib/` but are not obviously referenced. Possibly added and never properly integrated.

---

### 4.5 — Missing RLS (Row Level Security) Verification

**Files:** `supabase/migrations/`

Only 3 migration files exist, none of which set up Row Level Security policies. Without RLS policies, any authenticated user can read/write **any row** in any table using the anon key. This is a critical data isolation problem for an e-commerce app (user A could read user B's orders).

---

### 4.6 — Razorpay Webhook Signature Not Verified Properly (Likely)

Without reading the webhook route, the pattern in `src/lib/razorpay.ts` is very thin (905 bytes). Razorpay webhooks **must** have HMAC signature verification on every incoming request. If this is missing or incorrectly implemented, the payment webhook endpoint can be spoofed to mark orders as paid without real payment.

---

### 4.7 — `productVariants.ts` is a 4.7KB Library File with Unknown Usage

**File:** `src/lib/productVariants.ts`

This is a substantial library file with product variant logic. Unclear if it's used or duplicated in the database schema.

---

## 5. 🟢 What's Done Right

| Area | Status |
|------|--------|
| Rate limiting in `src/lib/middleware/rateLimit.ts` | ✅ Exists |
| Separate `withAdminAuth` / `withAdminAuthDynamic` HOFs for API routes | ✅ Clean pattern |
| `createAsyncThunk` pattern in Redux slices | ✅ Correct |
| `requireAuth` HOF in `lib/middleware/auth.ts` | ✅ Clean |
| Supabase admin client has `persistSession: false` | ✅ Correct |
| Open Graph / Twitter meta in `metadata` export | ✅ |
| `Suspense` wrapping in layout | ✅ |
| `credentials: 'include'` on all fetch calls | ✅ |

---

## 6. 📋 Implementation Plan — Prioritized Fix Order

### Phase 1: Security & Data Integrity (Week 1) 🔴

| # | Task | File(s) | Why |
|---|------|---------|-----|
| 1 | **Delete all test/debug API routes** | `api/debug/`, `api/debug-auth/`, `api/test-*` | Security — data exposure |
| 2 | **Move admin role to `app_metadata`** | Supabase dashboard + tokenValidation.ts | Role escalation vulnerability |
| 3 | **Add `import 'server-only'` to supabase-admin** | Split `supabase.ts` | Prevent service key client bundle |
| 4 | **Verify Razorpay webhook signature** | `api/webhooks/razorpay/route.ts` | Payment spoofing risk |
| 5 | **Set up Supabase RLS policies** | Supabase dashboard + migrations | Data isolation |
| 6 | **Fix CSRF to use DB instead of in-memory** | `csrf.ts` | CSRF is currently broken on serverless |

### Phase 2: Architecture Fixes (Week 2) 🟠

| # | Task | File(s) | Why |
|---|------|---------|-----|
| 7 | **Replace custom auth with `@supabase/ssr`** | `supabase.ts`, `middleware.ts`, `AuthContext.tsx` | Correct SSR auth pattern |
| 8 | **Delete `SessionManager` class** | `lib/auth/sessionManager.ts` | Supabase `onAuthStateChange` replaces it |
| 9 | **Slim down `AuthContext` to ~150 lines** | `AuthContext.tsx` | Currently 784 lines doing too much |
| 10 | **Consolidate order creation into 2 endpoints** | `api/orders/`, `api/save-order/`, `api/create-razorpay-order/` | Remove duplication |
| 11 | **Separate toast system** | `AuthContext.tsx`, `layout.tsx` | Remove dual toast systems |
| 12 | **Fix `layout.tsx` duplicate meta tags** | `layout.tsx` | Duplicate head tags |

### Phase 3: TypeScript & State Management (Week 3) 🟡

| # | Task | File(s) | Why |
|---|------|---------|-----|
| 13 | **Convert Redux slices to `.ts`** | `cartSlice.js`, `orderSlice.js`, `productSlice.js` | Type safety |
| 14 | **Fix cart hydration (SSR mismatch)** | `cartSlice.js` | Hydration errors in production |
| 15 | **Extract shared `fetchJSON` utility** | `orderSlice.js`, `productSlice.js` | DRY |
| 16 | **Re-enable `serializableCheck`** | `store.ts` | Fix root cause (Date objects) |
| 17 | **Remove `makeStore` singleton ambiguity** | `store.ts` | SSR store isolation |

### Phase 4: Cleanup (Week 4) 🟢

| # | Task | File(s) | Why |
|---|------|---------|-----|
| 18 | **Delete `generate_qr.py` and `.svg` files** | project root | Not a Python project |
| 19 | **Move ad-hoc SQLs to migrations** | `supabase/update_*.sql` | Migration hygiene |
| 20 | **Audit `content-sync.ts`, `notifications.ts`** | `lib/` | Possible dead code |
| 21 | **Audit `productVariants.ts`** | `lib/productVariants.ts` | Duplication check |

---

## 7. 🗂️ Files to Delete Entirely

| File/Directory | Reason |
|---------------|--------|
| `src/app/api/debug/` | Exposes internal state |
| `src/app/api/debug-auth/` | Exposes auth internals |
| `src/app/api/test-blogs/` | Test route, not needed |
| `src/app/api/test-order-creation/` | Test route, not needed |
| `src/app/api/test-supabase/` | Exposes DB internals |
| `src/app/api/test-token/` | Exposes token internals |
| `generate_qr.py` | Wrong project |
| `lab_report_qr.svg` | Wrong project |
| `manufacturer_details_qr.svg` | Wrong project |
| `src/lib/auth/sessionManager.ts` | Replace with Supabase `onAuthStateChange` |
| `supabase/update_original_price_to_399.sql` | Move to migrations or delete |
| `supabase/update_product_variants.sql` | Move to migrations or delete |

---

## 8. 🔑 Recommended Starting Point

**Start here: Phase 1, Item 1 → Delete debug routes, then fix admin role metadata.**

These two are the highest-risk issues with zero downside to fixing them. Everything else can be done incrementally without breaking the live site.

For the auth refactor (the biggest change), do it in a feature branch:
1. Install `@supabase/ssr`
2. Create `createServerClient()` util
3. Replace `tokenValidation.ts` approach with SSR client
4. Slim down `AuthContext`
5. Delete `SessionManager`

This will be the most impactful single change that improves reliability, security, and code quality simultaneously.
