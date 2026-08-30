# Clara Chen — Mission Manifold Design System

## Thesis

The site presents Clara's work as a sequence of research missions. Apple-like
clarity makes each idea feel like an exhibit; SpaceX-like contrast gives every
project a sense of scale and forward motion. The result must never imitate
either brand. Clara's own mathematical manifold is the signature.

## Tokens

- Paper `#F5F5F7`: primary reading canvas.
- White `#FFFFFF`: high-contrast text and image mats.
- Ink `#1D1D1F`: type and controls on light surfaces.
- Night `#000000`: full-bleed mission surfaces.
- Night Soft `#0A0A0A`: secondary dark reading surface.
- Signal Oxblood `#4E0B11`: one small active or data signal per composition.

No decorative gradients. Use surface changes, real project figures, hairlines,
and negative space for depth. Shadows are not part of the interface.

## Type

- Signature: Bodoni Moda 400, used only for the name and rare personal marks.
- Display/UI: Inter 600–700, tight in sentence case and positively tracked in
  uppercase mission headings.
- Body: Inter 400–500, 17–20px with generous line-height.

## Layout

Full-viewport light and dark bands alternate without card chrome. Text lives in
a centered 1440px frame; reading columns stay below 760px. Project numbers are
used only when the projects form a real ordered mission sequence.

## Signature

Mission Manifold: deterministic orbital lines, nodes, and project data plots
move from the home hero into project pages. Keep every other decorative choice
quiet so this remains the memorable element.

## Interaction

- One orchestrated hero entrance, then restrained viewport reveals.
- Buttons use either a filled ink capsule on light or a white ghost capsule on
  dark. Never show more than two competing actions.
- All touch targets are at least 44px. Focus rings use Signal Oxblood.
- `prefers-reduced-motion` removes drift, reveal motion, and smooth scrolling.

## Guardrails

- No rockets, Apple/SpaceX logos, stock space imagery, glass-card grids, neon,
  decorative gradients, or invented project outcomes.
- Use actual repository figures and verified copy. The absence of imagery is
  preferable to a generic illustration.
- Mobile retains the typography and mission rhythm; it does not shrink the
  desktop artboard wholesale.
