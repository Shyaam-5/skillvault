# SkillVault — Recorded Course Marketplace Prototype

A responsive React + Vite prototype for an on-demand, recorded-course marketplace. It is designed to run locally on Windows, macOS, or Linux.

## Requirements

- Node.js 20 LTS or newer (Node.js 22 LTS is also fine)
- npm (included with Node.js)

Check your installation:

```bash
node -v
npm -v
```

## Run locally

1. Extract the `skillvault-project.zip` file.
2. Open the extracted `skillvault` folder in VS Code.
3. Open the integrated terminal (**Terminal → New Terminal**).
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL Vite prints, normally `http://localhost:5173`.

Keep the terminal open while using the app. Press `Ctrl+C` to stop the dev server.

## Prototype features

- Course catalogue with search and category filters
- Course detail pages and lesson curriculum
- Simulated checkout (no real payment is collected)
- Student learning dashboard and lesson completion
- Wishlist / save for later
- Instructor studio: create and remove local course drafts
- Admin console with demo metrics and reset controls
- Local browser persistence using `localStorage`

## Important prototype limitations

- Demo purchases are not real transactions.
- The app has no real sign-in, backend, or role-based access control.
- Course drafts and progress are stored only in the current browser on the current device.
- The video player is a styled placeholder; video upload/streaming is not connected.
- Never use the prototype's simulated checkout to collect real money or grant production access.

## Build a production bundle

```bash
npm run build
npm run preview
```

The compiled website is generated in `dist/`.

## Suggested production roadmap

1. Supabase Auth and PostgreSQL tables for profiles, courses, lessons, orders, enrollments, and progress.
2. Instructor/admin role checks enforced server-side with database row-level security.
3. Razorpay (or another provider) with server-side order creation, verified webhooks, refunds, and idempotent purchase handling.
4. Managed video hosting such as Mux or Cloudflare Stream, with short-lived playback tokens.
5. Tests, privacy/terms/refund policies, accessibility checks, analytics, and deployment.
