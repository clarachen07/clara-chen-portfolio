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
- Three.js is used only by the Mars footer and must not load on `/resume`.
- Preserve Mars pause, offscreen/background suspension, GPU cleanup, keyboard/touch controls, and static fallback.
- Preserve accessible focus, 44px touch targets, reduced-motion support, and responsive reading sizes.
- Use framework links internally; external links must open safely and show an external marker.
- Do not expose a résumé PDF button while `resumeData.pdfUrl` is `null`.

## Current status

- The original homepage, six-project archive, résumé, and navigation are restored locally; only the former black footer is replaced by the interactive Mars scene.
- Production and GitHub main have not been updated. Asset attribution is in `public/scenes/CREDITS.txt`.
- Next step: provide the final résumé PDF when it is ready; keep the PDF action hidden until its public URL is configured.
