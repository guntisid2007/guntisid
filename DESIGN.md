# Design system | Sid Gunti Portfolio

## Design read

Recruiter-facing Computer Engineering portfolio with a calm editorial-tech language. The site favors evidence, fast scanning, and authentic material over interface spectacle.

Design dials:

- Variance: 7/10
- Motion: 4/10
- Density: 4/10

## Visual system

- One dark theme across the page, with charcoal surfaces and a single muted-gold accent.
- Barlow Condensed handles concise display type, Manrope carries body copy, and IBM Plex Mono is reserved for metadata and actions.
- Geometry is square. Borders communicate structure, while spacing replaces unnecessary containers.
- The hero uses the existing portrait as its visual focus. Projects use an asymmetric composition led by the modular fiber-tethered drone rather than repeated equal cards.
- Research retains the original voltage figure and its limitations. No data is redrawn or invented.
- Experience is a ruled list with organization marks. Supplied logos live in `public/assets/logos/`; missing logos use restrained text monograms.

## Motion

- The hero enters once with short opacity and vertical transitions.
- Sections reveal once through IntersectionObserver.
- Buttons use small hover and active feedback.
- `prefers-reduced-motion` disables entrance movement and smooth scrolling.
- No looping animation, parallax, WebGL, scroll-jacking, or animation-only content.

## Responsive behavior

- Desktop: split hero, asymmetric project grid, two-column research and about sections.
- Tablet: single-column content, portrait follows the hero copy, experience summaries wrap below the role.
- Mobile: strict single column, full-width actions, two-column focus strip, compact logo-led experience rows, and a native disclosure navigation.

## Accessibility and performance

- Semantic landmarks, ordered headings, keyboard-operable navigation, visible focus states, descriptive alt text, and a skip link.
- Self-hosted fonts and explicit image dimensions reduce layout shift.
- Below-the-fold imagery is lazy-loaded.
- React, Phosphor Icons, and native browser APIs are the only runtime dependencies.
