# Clara Chen Portfolio

Clara Chen's English and Simplified Chinese personal portfolio and résumé site, built around editorial typography and a deterministic mathematical manifold.

Production: <https://clarachen.dev>

## Routes

- `/`: the main Clara Chen hero followed by the complete projects experience.
- `/projects`: a direct entry to the six text-first project cards over a warm 3D Mars terrain.
- `/resume`: the academic résumé, portrait, experience, education, projects, and skills.
- `/projects/:slug`: legacy project URLs redirect to the matching card on `/projects`; unknown slugs return 404.
- `/zh`, `/zh/projects`, and `/zh/resume`: Simplified Chinese versions. Chinese legacy project URLs redirect within `/zh/projects`.
- The top-bar `EN | 中文` control switches the current page and preserves query parameters and section anchors. Language follows the URL, with English at the original unprefixed addresses.

## Architecture

- Vinext/Vite with React and the Next-compatible App Router surface.
- Cloudflare Worker `clara-chen-homepage` serves the custom domain `clarachen.dev`.
- `app/content.ts` is the source of truth for English projects and résumé content; `app/content.zh.ts` holds Chinese translations, reusing the same repository links and technical data.
- `app/i18n.ts` owns typed UI messages and language paths; `app/localized-content.ts` selects the page data.
- `app/(en)` and `app/(zh)/zh` contain thin route wrappers and independent root documents, sharing the page components and styles. Language switching uses a document navigation so the HTML language and metadata stay aligned.
- `app/components/ProjectsLanding.tsx` is shared by the homepage and `/projects`.
- Project terrain is loaded on demand, follows scroll position, and renders only while moving and visible. Reduced motion and unavailable WebGL show matching static posters. The résumé loads no scene runtime.
- `app/components/home/HomeArtwork.tsx` owns the deterministic hero manifold.
- `app/original-home.css`, `app/globals.css`, and `app/resume/resume.css` contain the responsive visual system; `app/language.css` styles the language control and Chinese typography.
- `tests/rendered-html.test.mjs` validates all public routes and the legacy redirect/404 behavior.

The site has no database-backed product feature, authentication, contact form, or analytics tracking. The résumé PDF link remains hidden while `resumeData.pdfUrl` is `null`.

Terrain uses locally hosted CC0 Sandy Gravel 02 and Rock 07 scans from Poly Haven. Sources and artistic changes are recorded in `public/scenes/CREDITS.txt`; `node scripts/prepare-terrain-assets.mjs` rebuilds the material/model derivatives. The landscape is an artistic interpretation, not a reconstruction of a measured Mars location.

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

Production uses Cloudflare Workers.

```bash
npm run build
npx wrangler deploy --dry-run --config dist/server/wrangler.json
npx wrangler deploy --config dist/server/wrangler.json
```

See [DESIGN.md](./DESIGN.md) for the current visual contract.
