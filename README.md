# Sid Gunti | Portfolio

A responsive React portfolio for Siddharth “Sid” Gunti, built around inspectable engineering evidence: embedded systems, robotics, data analysis, and research.

The repository includes a standalone web résumé at `public/resume.html` and Sid’s alkaline-electrolyzer research paper at `public/RSI-Research-Paper.pdf`.

## Stack

- React 19 and Vite
- CSS animations and IntersectionObserver for the motion pass, with a full `prefers-reduced-motion` fallback
- Phosphor Icons
- Self-hosted Barlow Condensed, Manrope, and IBM Plex Mono

Organization logos are stored in `public/assets/logos/` and referenced from the centralized experience data in `src/App.jsx`. The page is ordered for recruiter scanning: a stats band of selected results, Experience, Projects, Skills, About, and Contact.

The `stats` array in `src/App.jsx` holds the stats band, and a project with `specs` renders full width with them as a spec sheet. A project with `console` data renders an illustrative terminal panel.

## Link preview image

`public/og-image.jpg` is rendered from `scripts/og-image.html`. After editing the card, rebuild it on macOS with the local Playwright Chromium:

```bash
./scripts/build-og-image.sh
```

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The optimized site is written to `dist/`.
