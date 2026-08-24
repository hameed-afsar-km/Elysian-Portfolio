# Hameed Afsar — Portfolio Website

A distinctive, interactive developer portfolio built with **Next.js 16**, **React 19**, **Framer Motion**, **GSAP**, and **Lenis**. Features immersive scroll-driven animations, a terminal-style about section, 3D resume card, horizontal project timeline, and an AI-powered chat twin.

## Live Demo

[https://hameedafsar.vercel.app](https://hameedafsar.vercel.app) *(deploy on Vercel)*

---

## ✨ Key Features

| Section | Description |
|---------|-------------|
| **Hero** | Large kinetic "THINK MAKE REPEAT" headline with dual curved marquees that scale/fade on scroll |
| **About (Terminal)** | Retro terminal UI with animated typewriter output, scroll-synced card reveal via Framer Motion |
| **Scroll Scrub Philosophy** | Horizontal scrub section revealing design principles as you scroll |
| **Vertical Timeline** | Career journey with parallax cards and smooth Lenis scrolling |
| **Tech Stack Marquee** | Infinite horizontal marquee with sticky parallax effect |
| **Projects (Horizontal Timeline)** | GSAP-driven horizontal strip: 5 featured projects with year/era badges, GitHub/demo links |
| **Resume (3D Card)** | Interactive 3D tilt card with terminal preview, download/view buttons, PDF modal viewer |
| **AI Twin** | Conversational AI assistant trained on portfolio data — answers questions about projects, stack, background |
| **Footer** | Contact links, social, newsletter signup |

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Animation**: Framer Motion, GSAP + ScrollTrigger, Lenis (smooth scroll)
- **Styling**: Custom CSS (CSS variables, clamp fluid typography), Tailwind CSS v4 for utilities
- **Fonts**: Droid 1997 (display), Droid Sans / Droid Sans Mono (UI), Barlow Condensed, Press Start 2P
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main page — orchestrates all sections
│   ├── layout.tsx            # Root layout, fonts, Lenis provider
│   ├── globals.css           # Global styles, CSS variables, base resets
│   ├── custom.css            # Section-specific styles (responsive, animations)
│   └── projects/page.tsx     # Full projects archive page
│   └── api/chat/route.ts     # AI Twin chat endpoint (mock/local logic)
├── components/
│   ├── Navbar.tsx            # Fixed nav with scroll progress ring
│   ├── ParticleBackground.tsx        # Canvas particle system (hero)
│   ├── ParticleBackgroundMono.tsx    # Mono variant (about section)
│   ├── CurvedMarquee.tsx     # SVG curved text ribbons
│   ├── TerminalAbout.tsx     # Typewriter terminal about card
│   ├── TimelineSection.tsx   # Horizontal GSAP project strip
│   ├── VerticalTimeline.tsx  # Career journey vertical cards
│   ├── ScrollScrubSection.tsx# Philosophy scrub section
│   ├── TechStackMarquee.tsx  # Infinite tech stack ticker
│   ├── ResumeSection.tsx     # 3D tilt resume card + PDF viewer
│   ├── AiTwinSection.tsx     # Chat interface + logic
│   ├── AiTwinBackground.tsx  # Animated orb background
│   ├── AiTwinMarkdown.tsx    # Markdown renderer for AI responses
│   ├── FooterSection.tsx     # Footer with links
│   └── ui/container-scroll-animation.tsx  # Scroll-linked container
├── data/
│   └── aiTwinData.ts         # AI Twin knowledge base & responses
└── public/
    ├── Hameed_Afsar_Resume.pdf
    └── fonts/Droid1997.otf
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm / npm / yarn / bun

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## 🎨 Design System

### CSS Variables (globals.css / custom.css)

```css
:root {
  --val-red:    #ff4655;    /* Primary accent */
  --val-dark:   #080810;    /* Near-black background */
  --val-light:  #ece8e1;    /* Off-white text */
}
```

### Fluid Typography

All headings use `clamp()` for responsive scaling without media queries:
- Hero: `clamp(4rem, 12vw, 14rem)`
- Section headers: `clamp(2.5rem, 7vw, 6.5rem)`
- Body: `1rem` base, scaled via media queries

### Breakpoints (custom.css)

```css
@media (max-width: 960px)  { /* Tablet / small desktop */ }
@media (max-width: 768px)  { /* Mobile landscape */ }
@media (max-width: 640px)  { /* Standard mobile */ }
@media (max-width: 480px)  { /* Android phones */ }
@media (max-width: 360px)  { /* Narrow Android (Galaxy S8, etc.) */ }
@media (hover: none)       { /* Touch devices — disables 3D tilt */ }
```

---

## ⚙️ Configuration

### Fonts (layout.tsx)

Google Fonts preloaded: Droid Sans, Droid Sans Mono, Barlow Condensed, Press Start 2P.  
Local font: `Droid1997.otf` in `/public/fonts`.

### Lenis Smooth Scroll

Initialized in `layout.tsx` via `<ReactLenis>`. Scroll progress synced to:
- GSAP ScrollTrigger (hero, marquees, timeline)
- Framer Motion (about card, tech stack parallax)

### GSAP Context

All GSAP animations wrapped in `gsap.context(() => { ... })` for clean revert on unmount.

---

## 🧩 Customization Guide

### Edit Portfolio Content

| File | What to Change |
|------|----------------|
| `src/data/aiTwinData.ts` | AI Twin responses, suggested prompts, project details |
| `src/components/TimelineSection.tsx` | `entries[]` array — project data (headline, sub, body, tags, links) |
| `src/components/ResumeSection.tsx` | Resume PDF path, terminal lines, stats, skills |
| `src/components/VerticalTimeline.tsx` | Career timeline entries |
| `src/components/TerminalAbout.tsx` | About terminal lines |
| `src/components/TechStackMarquee.tsx` | Tech stack items in marquee |
| `public/Hameed_Afsar_Resume.pdf` | Replace with your resume |

### Colors & Theme

Modify CSS variables in `src/app/globals.css`:
```css
:root {
  --val-red: #your-accent;
  --val-dark: #your-bg;
  --val-light: #your-text;
}
```

### Animation Timing

- GSAP scrub: `scrub: 0.3` in `page.tsx` hero timeline
- Framer Motion springs: `stiffness` / `damping` in `page.tsx` about card
- Lenis: `lerp: 0.08` (in layout.tsx provider)

---

## ♿ Accessibility

- Semantic HTML5 (`<section>`, `<header>`, `<main>`, `<footer>`)
- `prefers-reduced-motion` respected (animations disabled)
- Focus-visible outlines on interactive elements
- ARIA labels on icon-only buttons (GitHub, close modal)
- Alt text on decorative images omitted (`aria-hidden`)
- Sufficient contrast ratios (WCAG AA)

---

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel → auto-detects Next.js
3. Deploy — zero config

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export (Not Supported)

This project uses `next/navigation`, `framer-motion`, `lenis`, and API routes — requires a Node.js server. Use `output: 'standalone'` in `next.config.ts` for container deployments.

---

## 📄 License

MIT — feel free to use as a template for your own portfolio. Attribution appreciated.

---

## 🙏 Credits

- **Fonts**: Droid 1997 (custom), Google Fonts
- **Animations**: Framer Motion, GSAP, Lenis
- **Icons**: Lucide React
- **Inspiration**: Brutalist web design, terminal aesthetics, scrollytelling

---

Built with precision by **Hameed Afsar** — AI Engineer & Full Stack Developer.