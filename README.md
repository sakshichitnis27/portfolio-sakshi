# Sakshi Chitnis Portfolio

Personal portfolio for Java full stack work, production systems, AI tooling, and side projects.

Live site: [sakshichitnis27.github.io/portfolio-sakshi](https://sakshichitnis27.github.io/portfolio-sakshi/)

## Stack

- Astro static site
- Tailwind CSS
- Three.js and WebGL visuals
- GSAP scroll animation
- GitHub Pages deployment

## Local Development

```bash
npm install
npm run dev
```

The site runs locally at the Astro dev server URL, usually `http://localhost:4321/portfolio-sakshi`.

## Production Build

```bash
npm run build
```

The static output is generated in `dist/`.

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`.
The workflow builds the Astro site and deploys the generated `dist/` artifact to GitHub Pages.
