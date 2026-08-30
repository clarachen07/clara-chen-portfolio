# Clara Chen Portfolio — Working Rules

Purpose: maintain Clara Chen's responsive English portfolio and résumé at `https://clarachen.dev`.

## Run and verify

- Requires Node.js `>=22.13.0`.
- Install with `npm install`; develop with `npm run dev` at `http://localhost:3000`.
- Before handoff run `npm run lint`, `npx tsc --noEmit`, and `npm test`.
- `npm test` includes the production build and rendered route tests.

## Stack and deployment

- Vinext/Vite, React, TypeScript, and a Next-compatible App Router surface.
- Production is Cloudflare Worker `clara-chen-homepage` on `clarachen.dev`.
- Deploy only from `dist/server/wrangler.json` after a successful build and dry run.
- `.openai/hosting.json` is unresolved legacy Sites wiring, not the production target.

## Source conventions

- `app/content.ts` is the typed source of truth for projects and résumé data.
- `app/page.tsx` joins the homepage hero to `ProjectsLanding`; `/projects` reuses it.
- Valid legacy `/projects/:slug` routes redirect to `/projects#slug`; unknown slugs are 404.
- Keep hero SVG output deterministic; do not introduce runtime randomness.
- Preserve accessible focus, 44px touch targets, reduced-motion support, and responsive reading sizes.
- Use framework links internally; external links must open safely and show an external marker.
- Do not expose a résumé PDF button while `resumeData.pdfUrl` is `null`.

## Current status

- The current homepage, six-project archive, résumé, mobile layout, tests, GitHub main branch, and Cloudflare production site are aligned.
- Next decisions: provide the final résumé PDF and choose whether to remove the legacy Sites wiring and superseded visual-QA assets.
