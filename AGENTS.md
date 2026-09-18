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

## Source conventions

- `app/content.ts` is the typed source of truth for projects and résumé data.
- `app/page.tsx` joins the original homepage hero to `ProjectsLanding`; `/projects` reuses the original project experience.
- Valid legacy `/projects/:slug` routes redirect to `/projects#slug`; unknown slugs are 404.
- Keep hero SVG and Mars star output deterministic; do not introduce runtime randomness.
- Three.js loads on demand for the shared project terrain and Mars footer, and must not load on `/resume`.
- Project terrain uses locally hosted CC0 scans, seeded placement, section-bound scroll motion, a pause control, and same-scene static posters. Preserve reduced-motion fallback and offscreen/background suspension.
- Preserve Mars pause, offscreen/background suspension, GPU cleanup, keyboard/touch controls, and static fallback.
- Preserve accessible focus, 44px touch targets, reduced-motion support, and responsive reading sizes.
- Use framework links internally; external links must open safely and show an external marker.
- Do not expose a résumé PDF button while `resumeData.pdfUrl` is `null`.

## Current status

- The original homepage hero and résumé are preserved. The shared six-project archive uses a warm scanned 3D terrain background and translucent sand-colored glass cards; the interactive Mars globe remains in the footer.
- Asset attribution is in `public/scenes/CREDITS.txt`. GitHub `main` is the release source; publish only after the validation and deployment checks above.
- Next step: provide the final résumé PDF when it is ready; keep the PDF action hidden until its public URL is configured.
