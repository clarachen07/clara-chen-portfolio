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
- Warm Sand `#E8D7B5`, Ochre `#B89562`, Earth `#77634B`: shared project landscape.
- Terrain Ink `#30271E`: project text and warm navigation; cream translucent panels keep text readable over the landscape.

Depth in the projects section comes from real terrain geometry, scanned soil and rocks, soft directional lighting, and transparent warm glass cards. Cards use softly blurred backgrounds, rounded bright edges and restrained highlights; unsupported backdrop filtering or reduced transparency uses an opaque reading surface. The title has a light reading veil. Avoid heavy shadows, rockets, or Apple/SpaceX marks.

## Type

- Signature: Bodoni Moda 400 for the large Clara Chen name, project introduction, and footer statement.
- Display/UI: Inter 600–700 with deliberate tracking and compact line-height.
- Body: Inter 400–500 at a comfortable responsive size and generous line-height.
- Navigation stays visually consistent on every route. The homepage and internal pages share the Clara Chen wordmark and the Projects / Resume / LinkedIn / GitHub actions.

## Current page rhythm

- Home hero: Paper surface, oversized name, one-line identity statement, and an enlarged deterministic manifold.
- Project introduction: low-camera warm terrain with a breathable serif heading.
- Project archive: six text-first sand panels, two columns above 900px and one below; 32–40px gaps reveal the continuous terrain. No project screenshots.
- Footer: full-width interactive Mars globe in deep space with the existing statement.
- Résumé: formal white/gray editorial layout with a restrained portrait and tighter section spacing. It intentionally keeps its own academic tone.

`/projects` begins directly with the shared project experience. The former individual case-study routes are compatibility redirects rather than separate page designs.

## Signature and motion

The Mission Manifold uses fixed SVG paths, orbital lines, and nodes. It must never rely on runtime randomness. Terrain placement also uses a fixed seed. Its camera travels three meters with section scroll, settles when scrolling stops, and has a pause control. Scene rendering suspends offscreen and in background tabs; the globe footer retains its own interaction.

`prefers-reduced-motion` shows a same-scene terrain poster and disables drift, reveal transitions, and smooth scrolling. WebGL/load failure also falls back to the poster. Touch targets are at least 44px, keyboard focus is visible, and the mobile layout must remain fully readable rather than scaling down a desktop artboard.

## Content guardrails

- Keep claims traceable to Clara's résumé or public repositories; never invent metrics or outcomes.
- Keep the project archive text-first and concise.
- External links open safely and are visibly marked.
- Hide the résumé PDF action until a public PDF URL is configured.
- Preserve the continuous homepage → warm project terrain → deep-space Mars footer sequence.
