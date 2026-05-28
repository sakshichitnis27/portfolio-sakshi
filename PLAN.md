# Portfolio Rebuild Plan — Vismay Tiwari

## Goal
Rebuild the portfolio as a **beautiful, fully responsive, dynamic** website that looks stunning on every screen size — phone, tablet, desktop — at **$0 cost**.

---

## Tech Stack

### Framework — Astro
- Component-based architecture (write reusable `.astro` components, similar to React but simpler)
- Compiles down to **pure static HTML/CSS/JS** — no runtime bloat, lightning fast
- Zero JavaScript shipped to the browser by default (only what we explicitly write)
- First-class support for Tailwind CSS, animations, and markdown content
- Designed specifically for content/portfolio sites — the industry standard in 2025-26

### Styling — Tailwind CSS v4
- Utility-first CSS, no custom `.css` files to maintain
- Built-in responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- Every design decision is mobile-first — looks perfect on all screen sizes automatically
- Installed as an npm package (no CDN link needed, bundled at build time)

### Icons — Simple Icons + Lucide Icons
- **Simple Icons** (`simple-icons` npm package) — SVG icons for every tech brand: Python, Go, Django, Kafka, AWS, GCP, etc. — free, open source, no CDN
- **Lucide Icons** — clean line icons for UI elements (email, arrow, github, etc.)
- All icons are bundled at build time — no external requests at runtime

### Animations
- **CSS animations** + **Tailwind transitions** for hover effects, card lifts, color shifts
- **Intersection Observer API** (vanilla JS, zero dependency) for scroll-triggered section reveals
- **Typewriter effect** — ported from current implementation, enhanced

### Deployment — GitHub Actions + GitHub Pages
- Every `git push` to `main` triggers a GitHub Actions workflow
- Workflow: `npm install` → `astro build` → deploy `dist/` to GitHub Pages
- **Free for public repos**, unlimited builds
- Live at `https://vismaytiwari.github.io/portfolio/`

---

## Cost Breakdown

| Item | Cost |
|------|------|
| GitHub Pages hosting | **$0** |
| GitHub Actions CI/CD (public repo) | **$0** |
| Astro framework | **$0** (open source) |
| Tailwind CSS | **$0** (open source) |
| Simple Icons | **$0** (open source) |
| Custom domain (optional, not required) | ~$10-15/year |
| **Total** | **$0/month** |

---

## Site Structure

```
src/
├── components/
│   ├── Nav.astro              # Sticky nav with mobile hamburger menu
│   ├── Hero.astro             # Intro + typewriter + code block + photo
│   ├── Experience.astro       # VSCode/terminal-style experience cards
│   ├── Skills.astro           # Tech stack with real brand icons
│   ├── Projects.astro         # Project cards with links
│   └── Footer.astro           # Links + copyright
├── layouts/
│   └── Layout.astro           # Base HTML shell, SEO meta tags
├── pages/
│   └── index.astro            # Main page (composes all components)
└── styles/
    └── global.css             # Tailwind base import only
```

---

## Pages & Sections

### 1. Navigation (sticky, blurred glass effect)
- Logo `VT` in emerald
- Links: About · Experience · Skills · Projects
- **Mobile**: hamburger menu → full-screen slide-down overlay
- Active section highlight as user scrolls

### 2. Hero Section
- **Left**: Name + animated typewriter roles ("Backend Developer", "Latency Slayer", etc.)
- **Left-bottom**: Profile photo with subtle glow ring
- **Right**: Animated Python code block (the `async def backend_engineer()` snippet, typed out)
- Social links: Email, LinkedIn, LeetCode, StackOverflow
- Scroll-down indicator arrow

### 3. Experience Section
- VSCode-tab style UI (kept from current design, refined)
- Terminal header: `experience.go` title with red/yellow/green dots
- Click between companies to switch content (PocketFM, Gammastack)
- Stats callouts: `200M+ users`, `2.5M RPM`, `11K QPS` as highlighted badges
- Timeline connector on desktop, stacked cards on mobile

### 4. Skills Section
- Category headers: Languages · Frameworks · Databases · Queues · Cloud/DevOps · Observability
- Each skill: **real SVG brand icon** (from Simple Icons) + label
- Hover effect: card lifts + icon color fills to brand color
- Grid layout → responsive (5 cols desktop, 3 cols tablet, 2 cols mobile)
- All icons bundled at build time — **no broken image paths**

### 5. Projects Section (new, currently missing from the site)
- Card grid with: project name, description, tech tags, GitHub link, live demo link
- Hover: card border glows pink/emerald
- Tech tags styled as pill badges

### 6. Footer
- Social icons row
- "Built with Astro + Tailwind · Hosted on GitHub Pages"

---

## Design System (kept consistent with current palette)

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0f1117` | Page background |
| Surface | `#171923` | Cards, nav |
| Border | `#1e2433` | Card borders |
| Pink accent | `#f472b6` | Name highlight, hover glows |
| Emerald accent | `#34d399` | Logo, code, active states |
| Text primary | `#f1f5f9` | Headings |
| Text muted | `#94a3b8` | Body text, descriptions |
| Font | `JetBrains Mono` (code) + `Inter` (body) | Self-hosted via Astro/Fontsource |

---

## Responsive Breakpoints Strategy

| Screen | Layout |
|--------|--------|
| `< 640px` (phone) | Single column, stacked everything, hamburger nav |
| `640px–1023px` (tablet) | 2-column grids, condensed hero |
| `≥ 1024px` (desktop) | Full 3-column hero, side-by-side experience layout |

Every component is written **mobile-first** — base styles are for phone, then `md:` and `lg:` classes add desktop layout.

---

## Migration Plan (current → new)

- [x] Keep all existing content (roles, description, experience bullets, skills list)
- [x] Keep the dark theme + pink/emerald color palette
- [x] Keep the typewriter effect and code block animation
- [x] Keep the VSCode/terminal-style experience UI
- [ ] Fix broken skill icons (replace `path/to/python-icon.svg` with real Simple Icons)
- [ ] Add Projects section (currently empty/missing)
- [ ] Make fully responsive (current site breaks on mobile)
- [ ] Add scroll animations (sections fade in as you scroll)
- [ ] Set up GitHub Actions workflow for auto-deploy on push

---

## Build & Dev Commands (after setup)

```bash
# Install dependencies
npm install

# Run local dev server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Deployment Flow

```
git push origin main
       ↓
GitHub Actions triggers
       ↓
npm install + astro build
       ↓
dist/ folder deployed to gh-pages branch
       ↓
Live at vismaytiwari.github.io/portfolio
```
