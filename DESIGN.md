# Design system | Sid Gunti Portfolio

## Design read

Recruiter-facing Computer Engineering portfolio with a calm editorial-tech language. The site favors evidence, fast scanning, and authentic material over interface spectacle.

Design dials:

- Variance: 5/10
- Motion: 3/10
- Density: 5/10

## Visual system

- One dark theme across the page, with charcoal surfaces and a single muted-gold accent.
- Barlow Condensed handles concise display type, Manrope carries body copy, and IBM Plex Mono is reserved for metadata and actions.
- Geometry is square. Borders communicate structure, while spacing replaces unnecessary containers.
- The hero is typography-led and keeps the recruiter actions in the initial viewport. It intentionally contains no portrait, illustration, or interactive visual.
- A stats band under the profile bar lists four results already stated elsewhere on the site, each with its source. Values are static, with no counting animation.
- Experience leads the page in a substantial two-column grid. Projects follow in a denser scan-friendly grid.
- The featured project (Wireshark) spans the full project grid with a label and value spec sheet beside its content. The other four projects sit in a 2x2 grid.
- The link preview image is a typographic card in the same type and colors, with no illustration.
- Electrolyzer research is represented inside Experience and Projects, with the source paper and limitations retained.
- Supplied organization logos live in `public/assets/logos/`. Each image has a specific optical sizing treatment rather than relying only on generic `object-fit` behavior.

## Motion

- The hero enters once with short opacity and vertical transitions.
- Sections reveal once through IntersectionObserver.
- Buttons use small hover and active feedback.
- `prefers-reduced-motion` disables entrance movement and smooth scrolling.
- No looping animation, parallax, WebGL, scroll-jacking, or animation-only content.

## Responsive behavior

- Desktop: full-width typographic hero, a four-column stats band, two-column experience and project grids, a full-width featured project, five-column skills groups, and a two-column about section.
- Tablet: two-column stats, single-column experience and projects with the featured spec sheet stacked under its content, a two-column skills layout, and a native disclosure navigation.
- Mobile: strict single column apart from the two-column stats band, full-width hero actions, visible social links, stacked experience content, and 44px or larger navigation targets.

## Accessibility and performance

- Semantic landmarks, ordered headings, keyboard-operable navigation, visible focus states, descriptive alt text, and a skip link.
- Self-hosted fonts and reserved logo containers reduce layout shift.
- Below-the-fold imagery is lazy-loaded.
- React, Phosphor Icons, and native browser APIs are the only runtime dependencies.
