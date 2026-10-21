# Design system | Sid Gunti Portfolio

## Design read

Recruiter-facing Computer Engineering portfolio with a calm editorial-tech language. The site favors evidence, fast scanning, and authentic material over interface spectacle. A deliberate motion layer sits on top and never carries content of its own.

Design dials:

- Variance: 5/10
- Motion: 8/10
- Density: 5/10

## Visual system

- One dark theme across the page, with charcoal surfaces and a single muted-gold accent.
- Barlow Condensed handles concise display type, Manrope carries body copy, and IBM Plex Mono is reserved for metadata and actions.
- Geometry is square. Borders communicate structure, while spacing replaces unnecessary containers.
- The hero is typography-led and keeps the recruiter actions in the initial viewport. Behind the copy, a decorative canvas (`HardwareFlow`) draws lanes of a flowing graph that resolve into chip contacts. The hero has no portrait and nothing interactive.
- A stats band under the profile bar lists four results already stated elsewhere on the site, each with its source. Each value counts up from zero the first time the band is seen. The markup always holds the final value, so screen readers, print, and copy get it whole.
- Experience leads the page in a substantial two-column grid. Projects follow in a denser scan-friendly grid.
- The featured project (Wireshark) spans the full project grid with a label and value spec sheet beside its content. The other four projects sit in a 2x2 grid.
- The link preview image is a typographic card in the same type and colors, with no illustration.
- Electrolyzer research is represented inside Experience and Projects, with the source paper and limitations retained.
- Supplied organization logos live in `public/assets/logos/`. Each image has a specific optical sizing treatment rather than relying only on generic `object-fit` behavior.

## Motion

The motion is a deliberate high-motion pass ported from wiresharks.tech and redrawn in this site's charcoal, muted gold, and square geometry. It stays subordinate to the content. Every pattern runs once or loops in place, and nothing it shows is missing from the page at rest. `src/components/motion.js` decides when an element is first seen through one shared IntersectionObserver, and the motion rules sit together at the end of `src/styles.css`.

- Elements marked `data-reveal` and wired with `ref={reveal}` enter once, when first seen, rising 14px out of a 6px blur (4px under 600px) over 800ms on `cubic-bezier(0.16, 1, 0.3, 1)`. Content on screen at load plays at once, so it never waits on a scroll.
- The hero name and every section heading rise in word by word, 35ms apart, through `Words`. The heading keeps its full sentence as its accessible name.
- Stats count up from zero over 1400ms with an ease-out quartic, in tabular numerals. Only a plain integer with an optional prefix or suffix counts. Any other value shows as written.
- A 520px gold radial glow follows a fine pointer inside experience cards, project cards, and stats cells. It is a layer moved by transform, and it stays under the pointer when the page scrolls beneath it.
- A gold hairline along the header's bottom edge tracks scroll progress. Past 24px of scroll the header fades to translucent ink. Its backdrop blur is always on, so only the color changes.
- On viewports 1200px and wider, the hero canvas loops continuously at about 30fps and pauses while it is off screen or the tab is hidden. Narrower viewports get one still frame at 35% opacity.
- The Wireshark spec rows rise in 90ms apart. Its In Development status has a square gold LED that pulses on a 2.4s loop.
- The Sidekick card holds a console panel labelled Illustrative. Its transcript restates the pipeline described on the page, claims no metrics, streams in line by line, and ends on a blinking caret.
- The `SG` mark's square outline draws itself on load, then its letters fade in.
- A giant, faint `SID GUNTI` wordmark rises out of the footer edge when it scrolls into view.
- Buttons and cards use small hover and active feedback.
- The site has no parallax, WebGL, scroll-jacking, or animation-only content.

Under `prefers-reduced-motion: reduce` the page renders finished. Nothing hides or blurs, stats show their final values, every spec row and console line is visible, and the outline is already drawn. The hero canvas draws one still frame instead of looping. The glow, the LED pulse, and the caret blink are off. Reduced motion switched on after load takes effect too, so anything not yet seen appears finished. The header hairline still tracks scroll, with no transitions. The rules that hide content apply only to screen media with motion allowed, so print also shows the whole page.

## Responsive behavior

- Desktop: full-width typographic hero, a four-column stats band, two-column experience and project grids, a full-width featured project, five-column skills groups, and a two-column about section.
- Tablet: two-column stats, single-column experience and projects with the featured spec sheet stacked under its content, a two-column skills layout, and a native disclosure navigation.
- Mobile: strict single column apart from the two-column stats band, full-width hero actions, visible social links, stacked experience content, and 44px or larger navigation targets.

## Accessibility and performance

- Semantic landmarks, ordered headings, keyboard-operable navigation, visible focus states, descriptive alt text, and a skip link.
- Self-hosted fonts and reserved logo containers reduce layout shift.
- Below-the-fold imagery is lazy-loaded.
- React, Phosphor Icons, and native browser APIs are the only runtime dependencies.
