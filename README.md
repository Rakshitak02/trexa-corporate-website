# Trexa — Corporate Website

A plain, static multi-page corporate website for Trexa (digital transformation and software development). The site is built with semantic HTML, a single stylesheet, and a single JavaScript file — no frameworks or build tools required.

---

## Project overview

This repository contains a 6‑page static website (Home, About, Services, Portfolio, Careers, Contact) intended as a marketing and lead-capture site for Trexa. All interactive behaviour is implemented with vanilla JavaScript in `js/script.js`; styles are in `css/style.css`.

---

## Pages

- Home — `index.html`: hero, stats, services preview, counters
- About — `about.html`: company story, values, team stats
- Services — `services.html`: service cards and process overview
- Portfolio — `portfolio.html`: filterable project grid and case-study modal
- Careers — `careers.html`: perks and open roles with "Apply" links
- Contact — `contact.html`: contact details and the validated contact form

---

## Implemented features

The following features are implemented in the site source and are documented here because they exist in the project files.

- **Responsive design:** mobile-first layout using CSS Grid and Flexbox with breakpoints for tablet and mobile; a hamburger nav appears on small screens.
- **Dark / light theme:** a theme toggle in the navbar persists preference to `localStorage` and applies a `data-theme` attribute to the root to switch CSS custom properties.
- **Animations & transitions:** scroll-triggered entrance animations (IntersectionObserver), animated numeric counters, and smooth transitions on interactive controls.
- **Portfolio filters and modal:** filter buttons show/hide project cards; cards open an accessible modal with project details; the modal supports keyboard focus trapping and multiple close mechanisms.
- **Careers application flow:** job listings link to `contact.html?job=<role>`; the contact form reads the query, pre-fills the message and selects the careers option, and displays a role banner.
- **Contact form and validation:** client-side validation (required checks, email format), inline error messages with `aria-invalid` and `role="alert"`, live validation, and submission via `fetch` to Web3Forms as configured in the form markup.
- **Accessibility improvements:** skip-to-content link, semantic landmarks (`main`, `nav`, `footer`), ARIA attributes on interactive elements, focus-visible outlines, screen-reader-only utilities, and accessible modal behaviour.
- **SEO implementation:** per-page `<title>` and `<meta name="description">`, canonical links, Open Graph and Twitter Card tags, `robots.txt`, and `sitemap.xml` covering all pages.

---

## Technologies used

- HTML5 (semantic markup)
- CSS3 (custom properties, Grid, Flexbox, responsive rules)
- Vanilla JavaScript (ES2020) — `js/script.js` implements theme, nav, animations, portfolio filtering, modal, and form behaviour
- Inline SVG for icons/illustrations
- Web3Forms for the contact form endpoint (configured in the form markup)

---

## Project structure

```
Corporate-Website/
├── index.html
├── about.html
├── services.html
├── portfolio.html
├── careers.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── favicon.svg
├── og-image.png
├── og-image.svg
├── robots.txt
└── sitemap.xml
```

---

## How to run locally

No build step is required — the site is static. Open `index.html` directly, or serve the folder with a simple static server to avoid fetch restrictions when testing the contact form.

Recommended commands:

```bash
# Using Python 3
cd Corporate-Website
python -m http.server 8080
# then open http://localhost:8080

# Or with Node (if available)
cd Corporate-Website
npx http-server -p 8080
# then open http://localhost:8080
```

Alternatively, use the VS Code Live Server extension: right-click `index.html` → "Open with Live Server".

Note: the contact form posts to Web3Forms and requires an internet connection for submission to succeed.

---

## How to deploy the static site

Any static hosting provider will serve this site. Common choices:

- Vercel: connect a GitHub repo and set the root to the folder containing `index.html` (no build command).
- Netlify: drag-and-drop the `Corporate-Website` folder to the Netlify UI or connect a repository and set the publish directory.
- GitHub Pages: push the folder to a repository then enable Pages for the branch/folder containing `index.html`.

After deployment, update the canonical and `og:url` values in the `<head>` of each HTML file to the live URL (the files include a post-deploy note where to replace the placeholder). Also update `twitter:site` if you have a Twitter/X handle.

---

If you'd like, I can also:

- Run a quick accessibility or SEO checklist against the live site (if you provide the URL).
- Add a short CONTRIBUTING note or deploy script to simplify updates.

- **Replace:** your actual deployment URL (e.g. `https://trexa.vercel.app`)

This updates all 6 canonical tags, all 6 `og:url` values, the `robots.txt` Sitemap directive, and all 6 sitemap `<loc>` entries in one operation. Remove the `<!-- POST-DEPLOYMENT: ... -->` comments from each `<head>` afterwards.

Also update `twitter:site` in all 6 `<head>` blocks if you have a real Twitter/X handle.
