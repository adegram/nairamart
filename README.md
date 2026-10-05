# NairaMart

NairaMart is a Nigerian ecommerce web app built as an **HNG Lesson 2 individual task**. Browse a Neon-backed catalog, add items to a cart that survives refreshes, sign in with Google, review a checkout page, and finish a **demo** order that sends a confirmation email through Mailgun.

Visit https://nairamart-eta.vercel.app to view the live website

> **The payment button is a demo.** NairaMart does not integrate Stripe, Paystack, Flutterwave, PayPal or any other gateway. Clicking "Pay ₦X (Demo)" charges nothing, stores no order, and ships nothing. The success page says so explicitly.

## Features

- Home page with hero, categories and featured products
- Shop page with category filter, search and sorting (server-side, validated with Zod)
- Product details with stock status, quantity picker and related products
- Cart persisted in `localStorage` (survives refresh and navigation, syncs across tabs, hydration-safe)
- Checkout page with item review, quantity controls, delivery form (React Hook Form + Zod) and order summary
- Demo payment flow ending on a clearly labelled confirmation page
- Google sign-in/sign-out with Auth.js (database sessions in Neon)
- Mailgun order confirmation email, sent server-side; failures are logged and never crash the app
- Prices in Nigerian Naira, formatted with `en-NG` (for example `₦250,000`)
- Responsive layout, mobile menu, loading, empty and error states

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS 4 · DaisyUI 5 · Neon PostgreSQL · Drizzle ORM · Auth.js (next-auth v5) with Google · Zod · React Hook Form · Mailgun HTTP API · Lucide React · Vercel

## Project structure

```
src/
  app/            Routes: /, /shop, /products/[slug], /cart, /checkout, /checkout/success, /signin, /api/auth
  actions/        Server actions (checkout, auth)
  components/     UI by area: layout, cart, product, checkout, brand, ui
  db/             Drizzle schema, lazy Neon client, seed script and seed data
  emails/         Order confirmation email template
  lib/            Constants, Naira formatting, product queries, Mailgun client, cart store/hook
  schemas/        Zod schemas (cart, checkout, shop filters)
  types/          Type augmentations (Auth.js session)
  auth.ts         Auth.js configuration
drizzle/          Generated SQL migrations
public/products/  Generated placeholder product images (SVG)
scripts/          Product image generator
```

## Prerequisites

- Node.js 20.9 or newer
- A free [Neon](https://neon.tech) account
- A Google account (for Google Cloud Console)
- A [Mailgun](https://www.mailgun.com) account
- GitHub and [Vercel](https://vercel.com) accounts for deployment

## Local installation

```bash
git clone <your-repo-url> nairamart
cd nairamart
npm install
cp .env.example .env.local
```

## Environment variables

| `DATABASE_URL` | Neon connection string (`...?sslmode=require`) |
| `AUTH_SECRET` | Random secret. Generate with `npx auth secret` or `openssl rand -base64 32` |
| `AUTH_URL` | Site URL, e.g. `http://localhost:3000` locally. On Vercel it can be left unset or set to your production URL |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `MAILGUN_API_KEY` | Mailgun API key (server-side only) |
| `MAILGUN_DOMAIN` | Mailgun sending domain, e.g. `sandbox123.mailgun.org` |
| `MAILGUN_FROM_EMAIL` | Sender, e.g. `NairaMart <postmaster@sandbox123.mailgun.org>` |
| `MAILGUN_BASE_URL` | Optional. `https://api.eu.mailgun.net` for EU-region domains |

None use the `NEXT_PUBLIC_` prefix, so none are exposed to the browser.

## Neon setup

1. Create a project at neon.tech.
2. Open **Connection details** and copy the connection string.
3. Put it in `.env.local` as `DATABASE_URL`.

## Database migration and seeding

```bash
npm run db:migrate     # applies the SQL in ./drizzle to Neon
npm run db:seed        # inserts 24 realistic NairaMart products (safe to re-run)
```

`npm run db:push` syncs the schema directly during development. After changing `src/db/schema.ts`, run `npm run db:generate`.

Product images are generated placeholders (`npm run images:generate`). To use real photos, store full URLs in the `image` column and add the host to `images.remotePatterns` in `next.config.ts` (and remove `unoptimized` from the `Image` components if you want Next.js optimisation).

## Mailgun setup

1. Create a Mailgun account and use the free **sandbox domain**, or add your own domain.
2. Copy your **API key** into `MAILGUN_API_KEY`.
3. Set `MAILGUN_DOMAIN` and `MAILGUN_FROM_EMAIL` (a sender on that domain).
4. **Sandbox domains only deliver to authorized recipients.** Add the email you will test with under *Authorized recipients* and confirm the verification email.
5. EU-region account? Set `MAILGUN_BASE_URL=https://api.eu.mailgun.net`.

If Mailgun is missing or fails, the demo order still completes. The error is logged server-side and the user sees a friendly message.

## Running locally

```bash
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run build
```

## Production build

```bash
npm run build
npm start
```

## Vercel deployment

1. Push the repository to GitHub.
2. In Vercel choose **Add New → Project**, import the repository (Next.js is detected automatically).
3. Add the environment variables above under Project Settings → Environment Variables.
4. Run `npm run db:migrate` and `npm run db:seed` once from your machine with the production `DATABASE_URL`.
5. Add `https://<your-domain>/api/auth/callback/google` as a redirect URI in Google Cloud Console.
6. Deploy. Every push to your main branch redeploys.

No production URL is hard-coded in the codebase.

## How the demo checkout works

1. The cart lives in `localStorage` (`nairamart:cart:v1`) and is validated with Zod when loaded.
2. Checkout requires Google sign-in. The form data and `{ productId, quantity }` pairs go to the `placeDemoOrder` server action.
3. The server re-validates input, loads real names and prices from Neon (client prices are ignored), checks stock, then sends the Mailgun email.
4. The user lands on `/checkout/success`, which states that no payment was made. No order is stored.

To add a real payment provider later, create the payment session inside `placeDemoOrder` (`src/actions/checkout.ts`) before the email step, and add an orders table.

## Troubleshooting

- **`DATABASE_URL is not set`**: create `.env.local` (not just `.env.example`) and restart the dev server.
- **Home or shop page shows an error**: run `npm run db:migrate`, then `npm run db:seed`.
- **`redirect_uri_mismatch`**: the URI in Google Cloud Console must match exactly (`http` vs `https`, no trailing slash).
- **Google "access blocked"**: add your account as a test user on the OAuth consent screen.
- **`MissingSecret` from Auth.js**: set `AUTH_SECRET`.
- **No confirmation email**: look for a `[mailgun]` line in the server logs. Sandbox recipients must be authorized.
- **Cart empty in a private window**: `localStorage` is per browser profile and origin.
