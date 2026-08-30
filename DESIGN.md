# Design DNA — Sid Gunti Portfolio

## 1. Direction

### References

- Field-research logs: measurements arrive in disciplined rows, with provenance close to every claim.
- Scientific journal figures: captions, axes, and limitations make evidence inspectable.
- Calibration strips and instrument labels: narrow typographic bands help readers scan a complex surface.
- Data-sublime installations: restrained signal traces turn quantity into atmosphere.
- Modernist engineering manuals: strict composition supports both dense technical detail and quiet reading.
- Hydrogen-system telemetry: voltage, current, power, pressure, and flow become a product-specific visual grammar.
- Purdue-era student life: one candid portrait keeps the system human rather than anonymous.

### Design thesis

Build a charcoal, warm ivory, and muted gold portfolio where Sid’s engineering work is read by signal, sample, and result—not by card collection. Dense barcodes and traces provide scale; open typographic intervals provide calm. The interface should feel like a research instrument translated into an editorial portfolio.

### Category baseline

Engineering student portfolios typically use dark gradients, glowing cards, technology logos, and broad claims. This site rejects that category surface. It keeps only the useful expectations: an immediate identity statement, clear project proof, a readable résumé, and obvious contact paths.

### Unique mechanism

Every major claim resolves into inspectable evidence: a method, a measured quantity, a concrete responsibility, a research document, or a source link.

### Carried brand traits

- Sid’s portrait remains the human anchor.
- Purdue, research, and hands-on engineering remain the content center.
- LinkedIn, GitHub, email, résumé, and research remain first-class paths.
- Copy stays plainspoken and precise.

## 2. Foundations

### Color

- `--ink: #1c1e1b` — dominant ground and text on inverted surfaces
- `--paper: #f3f0e8` — readable paper surface, intentionally not optic white
- `--white: #faf8f2` — active inversion and high-priority text
- `--line: rgba(5, 5, 5, 0.22)` — structure on paper
- `--line-inverse: rgba(255, 255, 255, 0.26)` — structure on ink
- `--accent: #cfb46a` - muted gold for primary actions and research highlights on charcoal
- `--accent-ink: #756024` - a darker gold for accessible text and icons on ivory
- Gold stays restrained; full-color personal photography adds natural variety.

### Typography

- Display: `Arial Narrow`, `Roboto Condensed`, or the closest system condensed sans; uppercase only when it functions like instrument labeling.
- Body: `Arial`, `Helvetica Neue`, or system sans, with generous line height and normal sentence casing.
- Data: `SFMono-Regular`, `IBM Plex Mono`, `Roboto Mono`, or system monospace; tabular numerals enabled.
- Hero type is fluid with `clamp()` and wraps deliberately. Body copy never relies on letterspacing for style.

### Spacing

- Base unit: 4px.
- Core rhythm: 8, 12, 16, 24, 32, 48, 72, 112px.
- Dense data bands use 8–16px intervals; narrative content uses 24–48px intervals.
- Section transitions are expressed by a change of field, not empty spacer alone.

### Layout

- 12-column desktop grid, 6-column tablet grid, single-column mobile flow.
- Thin rules and bar fields define the grid; they do not wrap every item in a card.
- One dominant hero split: identity and proposition at left, signal field at right.
- Research becomes the densest evidence surface. Experience becomes a ruled chronological log.
- Mobile collapses columns in reading order and reduces bar density rather than shrinking type below legibility.

### Shape and material

- Square geometry; 0–2px radii only where native controls require relief.
- One-pixel rules, no decorative shadows.
- Use warm ivory for projects, experience, and contact; charcoal for the hero and research; a softer charcoal for the portrait section. This section contrast follows the user-approved direction.
- Barcode texture is limited to the existing identity mark and hero. Project rows use Phosphor icons; buttons and contact use clean backgrounds.

## 3. Interaction Grammar

### Primary action

Simple outlined link with a directional arrow. The primary hero action is filled with muted gold. Hover and focus use a contrasting fill; a short transform gives interaction feedback.

### Secondary action

Plain text link with a rule that expands from left to right. External links include a visible arrow and accessible label.

### Navigation

Desktop navigation is a slim status strip with section labels. The active/hovered target inverts. Mobile uses a compact disclosure with a real button, focus management, and no off-canvas animation dependency.

### Scan state

Research traces and project rows reveal as a scanner passes through the section. Motion changes opacity and transform only; it does not obscure content or delay access.

### Inversion state

User-triggered controls and major section boundaries can invert paper/ink. There is no automatic flashing or full-frame strobe.

### 3D field

The hero contains one purposeful Three.js formation: a sparse hydrogen/electrolysis signal lattice. It is decorative support, never the only carrier of meaning. It renders a static frame for reduced motion, caps device pixel ratio, pauses when offscreen or hidden, and has a semantic CSS/SVG fallback.

## 4. Motion

- Hero entry: 500–750ms, `power3.out`, short overlap between status strip, headline, and proof links.
- Scroll reveals: 420–560ms, `power2.out`, 12–20px travel, no blur.
- Signal draw: scale/clip or SVG dash movement triggered once when the research figure enters.
- Barcode drift: very low amplitude and decoration-only; disabled under reduced motion.
- Continuous 3D motion is slow and has a visible pause control. It also pauses offscreen and when the document is hidden.
- Mobile avoids pinning. Desktop uses CSS sticky positioning for the research visual rather than ScrollTrigger pinning.

## 5. Responsive and Accessibility Rules

- Validate at 375, 768, 1024, and 1440px.
- Minimum touch target: 44px.
- Visible `:focus-visible` outline uses the current foreground color plus an offset.
- A skip link appears on keyboard focus.
- Canvas is `aria-hidden`; its meaning is duplicated in text.
- `prefers-reduced-motion: reduce` removes scrub, drift, and continuous rotation.
- Text remains selectable and readable with JavaScript or WebGL unavailable.
- Research limitations are presented beside the findings, not buried in a disclaimer.

## 6. Component Families

- `StatusRail`: name, current role, availability, and primary navigation
- `SignalField`: barcode/lattice composition with semantic fallback
- `EvidenceLink`: primary/secondary link styles with clear source destination
- `ProjectIndex`: asymmetrical rows with role, tools, and proof point
- `ResearchPlate`: paper abstract, method ledger, animated chart, limitations, and PDF link
- `ExperienceLog`: ruled chronological experience list
- `ResumePage`: standalone accessible HTML résumé with print action and portfolio return path
- `ContactBand`: concise closing statement and direct contact channels

## 7. Governance

- New sections must identify the evidence they contribute before being added.
- Keep gold as the only UI accent. Do not introduce a rounded card family, glass surface, or generic gradient.
- Reuse the signal/bar vocabulary sparingly; open areas are part of the system.
- Do not fabricate project metrics or research conclusions.
- Any new animation must explain change, order, or scale and must define a reduced-motion outcome.
- Any Three.js expansion must preserve one focal scene and meet the same pause, fallback, DPR, and disposal requirements.


## August 2026 visual refresh

- Design read: engineering portfolio for recruiters and collaborators; warmer technical style, preserving information architecture and recognizable identity.
- Dials: DESIGN_VARIANCE 6 / MOTION_INTENSITY 4 / VISUAL_DENSITY 4. Retain existing pauseable 3D hero and reveal behavior; add no new continuous animation.
- Audit: existing palette was #050505 / #f4f4ef, Barlow Condensed + Manrope + IBM Plex Mono, square corners, oversized uppercase titles, repeated barcodes. Main paths are work, research, web résumé, and contact.
- Preserve: anchor IDs, nav labels, content provenance, social/contact links, research limitations, reduced-motion fallback, keyboard focus, page metadata, and résumé URL.
- Evolve: gold action/highlight color, smaller section headings, sentence-case project/experience titles, original-color portrait, shorter first-person contact copy.
- Asset limit: only the existing portrait is supplied. Do not present generated or stock hardware pictures as Sid’s projects. Add authentic project photography when supplied.
- User-approved alternating surfaces and existing 3D visual take precedence over generic skill defaults for a single theme and generated hero imagery.
