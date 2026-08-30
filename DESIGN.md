# Clara Chen — Mission Manifold Design System

## Thesis

The site combines Apple-like clarity with SpaceX-like scale and engineering rhythm without copying either brand. Clara's deterministic mathematical manifold is the personal signature; the rest of the interface stays editorial, legible, and restrained.

## Color

- Paper `#F5F5F7`: homepage and neutral reading canvas.
- White `#FFFFFF`: résumé surface and high-contrast type.
- Ink `#1D1D1F`: primary text and controls on light surfaces.
- Night `#000000`: closing surface.
- Night Soft `#0A0A0A`: secondary dark surface.
- Signal Oxblood `#4E0B11`: focus and rare active signals only.
- Project Blue `#0E2543` with Air Blue `#AFD4E4`: project introduction.
- Project Yellow `#FFD753`: six-project archive.

Do not add decorative gradients, glass effects, heavy shadows, rockets, Apple/SpaceX marks, or stock space imagery. Depth comes from surface changes, hairlines, typography, and negative space.

## Type

- Signature: Bodoni Moda 400 for the large Clara Chen name and rare personal marks.
- Display/UI: Inter 600–700 with deliberate tracking and compact line-height.
- Body: Inter 400–500 at a comfortable responsive size and generous line-height.
- Navigation stays visually consistent on every route. The homepage and internal pages share the Clara Chen wordmark and the Projects / Resume / LinkedIn / GitHub actions.

## Current page rhythm

- Home hero: Paper surface, oversized name, one-line identity statement, and an enlarged deterministic manifold.
- Project introduction: full-width Project Blue field with a breathable display heading.
- Project archive: Project Yellow field containing six text-only dossiers; no screenshots or decorative card imagery.
- Footer: full-width Night surface without the removed contact-callout copy.
- Résumé: formal white/gray editorial layout with a restrained portrait and tighter section spacing. It intentionally keeps its own academic tone.

`/projects` begins directly with the shared project experience. The former individual case-study routes are compatibility redirects rather than separate page designs.

## Signature and motion

The Mission Manifold uses fixed SVG paths, orbital lines, and nodes. It must never rely on runtime randomness. Motion is limited to a composed hero entrance, restrained manifold drift, smooth in-page project navigation, and viewport reveals.

`prefers-reduced-motion` disables drift, reveal transitions, and smooth scrolling. Touch targets are at least 44px, keyboard focus is visible, and the mobile layout must remain fully readable rather than scaling down a desktop artboard.

## Content guardrails

- Keep claims traceable to Clara's résumé or public repositories; never invent metrics or outcomes.
- Keep the project archive text-first and concise.
- External links open safely and are visibly marked.
- Hide the résumé PDF action until a public PDF URL is configured.
- Preserve the final black surface and the blue-to-yellow project sequence when extending the site.
