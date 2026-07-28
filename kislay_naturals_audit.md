# Kislay Naturals — Full-Stack Codebase Audit (v2)

> **Reviewer perspective:** Expert full-stack developer performing a second, post-refactor deep code review.
> **First audit:** ~2026-07-25 | **This re-audit:** 2026-07-28

---

## ✅ What Changed Since v1 (Work Done)

| Old Issue | Status |
|-----------|--------|
| 2.1 — Six test/debug API routes in production | ✅ Deleted |
| 2.2 — Broken CSRF (in-memory store) | ✅ `csrf.ts` deleted; Supabase SSR cookie pattern used |
| 2.3 — Duplicate order creation endpoints | ✅ Consolidated to `POST /api/orders` |
| 2.4 — Supabase anon client for server-side auth | ✅ Migrated to `@supabase/ssr` with `createServerClient` |
| 2.5 — AuthContext 784 lines, triple auth systems | ✅ Rewritten to 142 lines, single `onAuthStateChange` |
| 2.6 — Cart slice SSR hydration mismatch | ✅ `hydrateCart()` dispatched in `useEffect` |
| 3.1 — Redux slices as `.js` files | ✅ All converted to `.ts` with proper types |
| 3.2 — Duplicate `fetchJSON` in slices | ✅ Extracted to `src/utils/fetchJSON.ts` |
| 3.3 — `makeStore` + singleton `store` export | ✅ Only `makeStore` exported; store via `useRef` in `ReduxProvider` |
| 3.4 — `serializableCheck: false` globally | ✅ Removed |
| 3.5 — Admin role in user-writable `user_metadata` | ✅ Migrated to `app_metadata` |
| 3.6 — `supabaseAdmin` importable client-side | ✅ Split to `supabaseAdmin.ts` with `import 'server-only'` |
| 3.7 — Duplicate `<head>` + `metadata` export tags | ✅ Manual `<head>` block removed |
| 3.8 — Two toast systems simultaneously | ✅ Custom toast removed; only `react-toastify` remains |
| 4.3 — `sessionManager.ts` with server-type import | ✅ File deleted entirely |
| 4.4 — Dead code (`content-sync.ts`, `notifications.ts`) | ✅ Both deleted |
| 4.6 — Razorpay webhook signature timing attack | ✅ Upgraded to `crypto.timingSafeEqual` |

---

## 🔴 Executive Summary (Current State)

The core architecture is now **solid**. `@supabase/ssr` is properly integrated, auth is clean, Redux is typed, and the payment pipeline is secure at the signature level. However, a second look reveals a new set of issues — some introduced during the refactor, some pre-existing bugs the original audit missed.

**Overall health: 🟡 Good foundation, actionable improvements needed before scaling.**

---

## 1. 🏗️ Current Architecture Overview

```
src/
├── app/
│   ├── api/
│   │   ├── admin/           (orders, export-csv, stats, users, payment-monitoring)
│   │   ├── auth/            (forgot-password, reset-password, update-details, update-password)
│   │   ├── create-razorpay-order/
│   │   ├── cron/            (payment-monitoring)
│   │   ├── orders/          (CRUD + update-payment, process-notifications, record-failure, retry)
│   │   ├── products/  recipes/  reviews/  blogposts/
│   │   ├── razorpay/        (webhook)
│   │   └── webhooks/        (sync-blog, sync-recipe)
│   └── [pages]/
├── components/              (23 components)
├── contexts/
│   └── AuthContext.tsx      (142 lines ✅ — clean)
├── lib/
│   ├── middleware/          (admin.ts, auth.ts, rateLimit.ts)
│   ├── supabaseAdmin.ts     (server-only ✅)
│   ├── email.ts  razorpay.ts  whatsapp.ts  productVariants.ts
├── store/
│   ├── ReduxProvider.tsx    (hydrateCart in useEffect ✅)
│   ├── store.ts             (makeStore only ✅)
│   └── slices/              (all .ts ✅)
└── utils/
    ├── fetchJSON.ts         (shared ✅)
    └── supabase/            (client, server, middleware ✅)
```

---

## 2. 🔴 Critical Issues (Fix First)

### 2.1 — Coupon Validation Is Fully Client-Side (Bypassable)

**File:** `src/app/checkout/page.tsx` (lines 674–716)

```typescript
// Coupon codes fully exposed in the browser bundle:
if (upperCode === 'SPECIAL' && hasDrops) { return { valid: true, ... }; }
if (upperCode === 'HOLI26' && hasDrops)  { return { valid: true, ... }; }
if (upperCode === 'SWEETSMART')           { return { valid: true, ... }; }
```

And the server blindly trusts whatever total the client sends:

```typescript
// src/app/api/orders/route.ts line 72
const totalPrice = payload.totalAmount; // Use the final total from frontend
```

**Impact:** A user can open DevTools, intercept `POST /api/orders`, change `totalAmount` to `1`, and get a valid order for ₹1. Razorpay will charge exactly ₹1.

**Fix:**
1. Move coupon validation to `POST /api/coupons/validate` (server-side)
2. Store coupon rules in DB or env config (not in client bundle)
3. Recalculate total **server-side** in `POST /api/orders` before insert
4. Verify in `POST /api/create-razorpay-order`: `amount === db.total_amount * 100`

---

### 2.2 — Payment Amount Not Verified Before Razorpay Order Creation

**File:** `src/app/api/create-razorpay-order/route.ts` (lines 136–148)

```typescript
const options = {
  amount: Math.round(amount), // ← straight from client, unverified for NEW orders
```

There is an amount check for *existing* Razorpay orders (line 82) but **no check when creating a new one**. A user can pass `amount: 100` (₹1) and get a valid ₹1 Razorpay order.

**Fix:**
```typescript
const expectedPaise = Math.round(existingOrder.total_amount * 100);
if (Math.abs(expectedPaise - Math.round(amount)) > 1) {
  return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
}
const options = { amount: expectedPaise, ... }; // always use DB amount
```

---

### 2.3 — `localStorage.setItem('user')` Dead Write Still in AuthContext

**File:** `src/contexts/AuthContext.tsx` (lines 56, 82)

```typescript
localStorage.setItem('user', JSON.stringify(userData));
```

Nothing reads this value back (confirmed by grep — no `localStorage.getItem('user')` anywhere in the codebase). It's a dead write. But it creates confusion and caches sensitive auth data unnecessarily. Session management is fully handled by `@supabase/ssr` cookies.

**Fix:** Remove both `localStorage.setItem('user', ...)` calls and the `clearAuthData` localStorage.removeItem call.

---

## 3. 🟠 Major Issues (Fix Soon)

### 3.1 — Rate Limiter Is In-Memory (Serverless Anti-Pattern)

**File:** `src/lib/middleware/rateLimit.ts`

```typescript
const store: RateLimitStore = {}; // ← in-memory, per Lambda instance
```

Same antipattern as the old CSRF store. On Vercel serverless, each Lambda invocation can be a fresh instance. A user can spam `create-razorpay-order` across multiple requests hitting different Lambda instances, completely bypassing the rate limit.

**Fix:** Use `@upstash/ratelimit` + `@upstash/redis` (designed exactly for this pattern, free tier available).

---

### 3.2 — `forgot-password` Has Hardcoded Fake Fallback URL

**File:** `src/app/api/auth/forgot-password/route.ts` (line 19)

```typescript
const redirectTo = process.env.SUPABASE_RESET_REDIRECT || 'https://your-frontend/reset-password'
```

`SUPABASE_RESET_REDIRECT` is not set in `.env.local`. Password reset emails are sent with a link to `https://your-frontend/reset-password` — a domain that does not exist.

**Fix:** Set `SUPABASE_RESET_REDIRECT=https://kislaynaturals.com/reset-auth` in `.env.local` and Vercel env. Remove the fake fallback string.

---

### 3.3 — Razorpay Key Named Inconsistently Across Routes

**Files:** `create-razorpay-order/route.ts` vs `update-payment/route.ts`

```typescript
// create-razorpay-order (line 125):
const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

// update-payment (line 31):
`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
// ↑ RAZORPAY_KEY_ID (no NEXT_PUBLIC_) — likely undefined in env
```

If `RAZORPAY_KEY_ID` is not separately defined, the Authorization header to Razorpay's verification API will be `undefined:secret` — malformed, causing silent failures when verifying payments.

**Fix:** Standardize to one name. Use `NEXT_PUBLIC_RAZORPAY_KEY_ID` everywhere (the public key is safe to expose).

---

### 3.4 — Webhook Uses Anon Client Instead of Admin Client

**File:** `src/app/api/razorpay/webhook/route.ts` (line 8)

```typescript
const supabase = await createClient(); // ← anon/user-scoped client
```

The webhook then queries `orders` using this client. If RLS policies restrict `SELECT` on orders to the row's `user_id`, the webhook (which has no user session) will silently find no orders and acknowledge without updating payment status.

**Fix:** Replace `createClient()` with `supabaseAdmin` in the webhook route. Webhooks are server-to-server and must bypass RLS.

---

### 3.5 — `withAdminAuth`/`withAdminAuthDynamic` Are Dead Code

**File:** `src/lib/middleware/admin.ts` (lines 28–52)

These HOF wrappers were left in after all admin routes were refactored to inline `authenticateAdmin()`. They are no longer imported or called anywhere.

**Fix:** Delete `withAdminAuth`, `withAdminAuthDynamic`, `AdminRequest`, and `AuthenticatedRequest` interface definitions.

---

### 3.6 — Three Migration Scripts Committed to Repository Root

**Files:** `fix_auth_toast.js`, `fix_forms.js`, `fix_roles.js`

One-time migration scripts committed to the repo. They will be deployed to Vercel unnecessarily and expose implementation details.

**Fix:** `git rm fix_auth_toast.js fix_forms.js fix_roles.js && git commit`

---

### 3.7 — `/subscribe` Route Is an Empty Directory

**File:** `src/app/subscribe/` (confirmed: 0 files, 0 bytes)

The directory exists and is listed in `publicRoutes` middleware, so Next.js tries to render it. Any user visiting `/subscribe` will get a 404 or blank screen.

**Fix:** Either implement a subscribe/email capture page, or delete the directory and remove `/subscribe` from `publicRoutes`.

---

### 3.8 — `userScalable: false` Is a WCAG Accessibility Violation

**File:** `src/app/layout.tsx` (lines 87–92)

```typescript
export const viewport = {
  maximumScale: 1,
  userScalable: false, // WCAG 2.1 SC 1.4.4 violation
};
```

Prevents visually impaired users from zooming. Reduces Google Lighthouse accessibility score. Modern browsers (Firefox, iOS Safari 10+) now ignore this setting deliberately. It also disqualifies the site from passing automated accessibility audits.

**Fix:** Remove `maximumScale: 1` and `userScalable: false` entirely.

---

### 3.9 — `SUPABASE_URL` Defined 3 Times in `.env.local`

**File:** `.env.local`

Confirmed by `grep -c "SUPABASE_URL=" .env.local` = 3. Duplicate env var definitions indicate the file has been edited multiple times without cleanup. The last definition wins, which may not be the intended one.

**Fix:** De-duplicate `.env.local` to have each variable defined exactly once.

---

## 4. 🟡 Moderate Issues (Technical Debt)

### 4.1 — `checkout/page.tsx` Is 1,297 Lines — God Component

**File:** `src/app/checkout/page.tsx`

Contains: form state, coupon logic, Razorpay initialization, payment handlers, address validation, pincode delivery estimation, and the full JSX render tree in a single file.

**Recommended extraction:**
- `hooks/useCheckoutForm.ts` — form state and validation
- `hooks/useCoupon.ts` — coupon state and server validation
- `hooks/useRazorpay.ts` — Razorpay initialization, callbacks, cleanup
- `components/AddressForm.tsx`, `components/OrderSummary.tsx`

---

### 4.2 — `alert()` Used for Critical Payment Error Messaging

**File:** `src/app/checkout/page.tsx` (lines 413, 419, 498, 555, 621)

```typescript
alert('Your order has expired...');
alert('Maximum payment attempts exceeded...');
alert('Payment successful but failed to update order. Please contact support.');
```

Browser `alert()` is synchronous, blocks the thread, is unstyled, and looks terrible on mobile — especially in the most critical user journey (payment).

**Fix:** Replace all 5 `alert()` calls with `toast.error()` or `toast.warning()` from react-toastify (already installed).

---

### 4.3 — Order Slice Uses `any` for Core State Types

**File:** `src/store/slices/orderSlice.ts` (lines 57–58)

```typescript
order: any | null;  // Order type already exists in src/types.ts
orders: any[];
```

**Fix:** Import `Order` from `@/types` and type the state properly.

---

### 4.4 — WhatsApp "Notification" System Is a No-Op

**File:** `src/lib/whatsapp.ts`, `src/app/api/orders/process-notifications/route.ts`

`sendOrderConfirmationWhatsApp` generates a `wa.me/` link and stores it in the DB. It never sends a message. The link is never surfaced in any admin UI. Every paid order makes a pointless function call.

**Fix options (pick one):**
- Integrate real WhatsApp Business API (Twilio, WATI, Interakt)
- Surface the `whatsapp_link` column in admin order detail view as a clickable button
- Remove WhatsApp from `process-notifications` entirely to reduce noise

---

### 4.5 — `metadataBase` Not Set (OG Images Broken in Production)

**File:** `src/app/layout.tsx`

Build produces this warning on every page:
```
⚠ metadataBase not set — using "http://localhost:3000"
```

The `og:image` in production HTML resolves to `http://localhost:3000/logo-transparent.png` — broken for all social sharing previews.

**Fix:**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://kislaynaturals.com'),
  // ...
};
```

---

### 4.6 — Notification Triggered via HTTP Self-Call (Fragile on Serverless)

**File:** `src/app/api/orders/update-payment/route.ts` (lines 87–101)

```typescript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
fetch(`${baseUrl}/api/orders/process-notifications`, { ... });
```

A serverless function calling itself via HTTP is an anti-pattern: it creates an outbound network request that fails in preview deployments (where `NEXT_PUBLIC_BASE_URL` may not be set), hits localhost in dev, and adds execution time.

**Fix:** Import `processNotifications` as a direct server-side module call instead of an HTTP fetch.

---

### 4.7 — Product Variant Pricing Hardcoded in TypeScript (Not DB-Driven)

**File:** `src/lib/productVariants.ts`

Variant pricing (`10ml → ₹299`, `30ml → ₹699`) and coupon overrides are hardcoded in a TS file. Changing prices requires a code deployment.

**Note:** This is fine for a very early-stage product but will become painful as the catalog grows. Flagging for awareness.

---

### 4.8 — No Server-Side Max-Length Validation on Free Text Fields

**Files:** `src/app/api/reviews/route.ts`, `src/app/api/orders/route.ts`

Fields like `user_name`, `comment`, `notes` are inserted into Supabase without max-length validation. While parameterized queries prevent SQL injection, there's no protection against:
- Stored XSS payloads rendered in admin UI
- Extremely long strings (e.g., a 10MB comment body)

**Fix:** Add `maxLength` checks server-side before any DB insert.

---

## 5. 🟢 What's Now Solid

| Area | Status |
|------|--------|
| `@supabase/ssr` for all server-side auth | ✅ |
| `app_metadata.role` for admin check | ✅ |
| Middleware using `updateSession` + `app_metadata.role` | ✅ |
| `import 'server-only'` on `supabaseAdmin` | ✅ |
| `makeStore` + `useRef` in `ReduxProvider` | ✅ SSR-safe |
| `hydrateCart` in `useEffect` | ✅ No hydration mismatch |
| All Redux slices in TypeScript | ✅ |
| `crypto.timingSafeEqual` for Razorpay HMAC | ✅ |
| Razorpay signature verified on `update-payment` | ✅ Before DB write |
| Single toast system (react-toastify) | ✅ |
| AuthContext at 142 lines, single auth source | ✅ |
| No dead test routes in production | ✅ |

---

## 6. 📋 Updated Implementation Plan

### Phase 1: Security & Revenue (Do This Week) 🔴

| # | Task | File(s) |
|---|------|---------|
| 1 | Server-side coupon validation + amount verification | `checkout/page.tsx`, `api/orders/`, `api/create-razorpay-order/` |
| 2 | Fix `forgot-password` redirect URL | `api/auth/forgot-password/route.ts`, `.env.local` |
| 3 | Fix webhook to use `supabaseAdmin` | `api/razorpay/webhook/route.ts` |

### Phase 2: Correctness (Next Sprint) 🟠

| # | Task | File(s) |
|---|------|---------|
| 4 | Add `metadataBase` | `layout.tsx` |
| 5 | Remove dead `localStorage.setItem('user')` writes | `AuthContext.tsx` |
| 6 | Delete 3 migration scripts | `fix_*.js` in root |
| 7 | Replace all `alert()` with `toast()` | `checkout/page.tsx` |
| 8 | Standardize Razorpay env var naming | `.env.local`, `update-payment/route.ts` |
| 9 | Replace in-memory rate limiter with Redis | `lib/middleware/rateLimit.ts` |
| 10 | Fix `userScalable: false` | `layout.tsx` |

### Phase 3: Architecture 🟡

| # | Task | File(s) |
|---|------|---------|
| 11 | Split 1,297-line checkout page into hooks + components | `checkout/page.tsx` |
| 12 | Resolve WhatsApp no-op | `whatsapp.ts`, `process-notifications/` |
| 13 | Refactor notification HTTP self-call to direct import | `update-payment/route.ts` |
| 14 | Type `OrderState` with `Order` type | `orderSlice.ts` |
| 15 | Delete dead HOF wrappers and interfaces | `admin.ts`, `auth.ts` |
| 16 | Handle `/subscribe` route | `app/subscribe/` |
| 17 | Clean up `.env.local` duplicates | `.env.local` |
| 18 | Add server-side max-length validation | `api/reviews/`, `api/orders/` |

---

## 7. 🔑 Most Critical Fix Right Now

**Issue 2.1 + 2.2 — Server-side price validation.**

A determined user can pay ₹1 for any order today by modifying the `totalAmount` field in the `POST /api/orders` request. Coupon codes are also visible in the browser bundle. This is an active revenue vulnerability that must be closed before traffic scales.
