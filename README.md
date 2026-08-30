# Clara Chen Portfolio

Clara Chen's English personal portfolio and résumé site, built around editorial typography and a deterministic mathematical manifold.

Production: <https://clarachen.dev>

## Routes

- `/`: the main Clara Chen hero followed by the complete projects experience.
- `/projects`: a direct entry to the six text-only project cards.
- `/resume`: the academic résumé, portrait, experience, education, projects, and skills.
- `/projects/:slug`: legacy project URLs redirect to the matching card on `/projects`; unknown slugs return 404.

## Architecture

- Vinext/Vite with React and the Next-compatible App Router surface.
- Cloudflare Worker `clara-chen-homepage` serves the custom domain `clarachen.dev`.
- `app/content.ts` is the source of truth for projects and résumé content.
- `app/components/ProjectsLanding.tsx` is shared by the homepage and `/projects`.
- `app/components/home/HomeArtwork.tsx` owns the deterministic hero manifold.
- `app/original-home.css`, `app/globals.css`, and `app/resume/resume.css` contain the responsive visual system.
- `tests/rendered-html.test.mjs` validates all public routes and the legacy redirect/404 behavior.

The site has no database-backed product feature, authentication, contact form, or analytics tracking. The résumé PDF link remains hidden while `resumeData.pdfUrl` is `null`.

## Local development

Node.js `>=22.13.0` is required.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Validation

```bash
npm run lint
npx tsc --noEmit
npm test
```

`npm test` performs a production build before running the rendered HTML suite.

## Deployment

Production uses Cloudflare, not the legacy Sites project identifier stored in `.openai/hosting.json`.

```bash
npm run build
npx wrangler deploy --dry-run --config dist/server/wrangler.json
npx wrangler deploy --config dist/server/wrangler.json
```

The `.openai/hosting.json` file and its Vite integration are retained only as unresolved legacy scaffold wiring; do not treat that project ID as a valid deployment target. See [DESIGN.md](./DESIGN.md) for the current visual contract.
