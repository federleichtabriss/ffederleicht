# Federleicht Abriss Website - Agent Documentation

> **Language Note:** This is a German-language website. All content, UI text, and documentation comments are in German (de-DE).

---

## Project Overview

This is a static business website for **Federleicht Abriss Entkernung und Entrümpelung**, a German demolition, gutting, and clearance company based in Sehnde, Lower Saxony. The company is owned by Ismail Dag and specializes in professional demolition services with certifications for hazardous material handling (TRGS 519 & 521 - asbestos and mineral wool).

**Live Site:** https://federleicht-abriss.de

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [Astro](https://astro.build/) | ^4.5.0 | Static site generator |
| [Tailwind CSS](https://tailwindcss.com/) | ^3.4.1 | Utility-first CSS framework |
| [@astrojs/tailwind](https://docs.astro.build/en/guides/integrations-guide/tailwind/) | ^5.1.0 | Astro-Tailwind integration |
| [@fontsource/inter](https://fontsource.org/fonts/inter) | ^5.0.16 | Web font (Inter) |
| [Web3Forms](https://web3forms.com/) | - | Contact form handling (API-based) |
| [TypeScript](https://www.typescriptlang.org/) | strict | Type safety |

---

## Project Structure

```
├── astro.config.mjs          # Astro configuration (static output, Tailwind)
├── tailwind.config.mjs       # Tailwind with custom brand colors
├── tsconfig.json             # TypeScript strict config with path aliases
├── netlify.toml              # Netlify deployment config + security headers
├── package.json              # NPM scripts and dependencies
├── src/
│   ├── layouts/
│   │   └── Layout.astro      # Main layout (HTML shell, meta tags, header, footer)
│   ├── pages/                # File-based routing
│   │   ├── index.astro       # Homepage (Hero, Services, Process, Contact form)
│   │   ├── leistungen.astro  # Services detail page (Abriss, Entkernung, Entrümpelung)
│   │   ├── ueber-uns.astro   # About page (Founder story, certificates, service area)
│   │   ├── kontakt.astro     # Contact page (form, hours, map)
│   │   ├── impressum.astro   # Legal notice (required by German law)
│   │   ├── datenschutz.astro # Privacy policy (GDPR/DSGVO compliant)
│   │   └── danke.astro       # Thank you page (form success)
│   ├── components/
│   │   ├── Header.astro      # Navigation component (sticky header)
│   │   ├── Footer.astro      # Footer with contact info
│   │   └── CookieBanner.astro # GDPR cookie consent banner
│   ├── styles/
│   │   └── global.css        # Custom styles, font imports, accessibility
│   └── env.d.ts              # Astro type declarations
├── public/
│   ├── js/
│   │   ├── main.js           # Mobile menu, scroll effects, animations
│   │   └── cookie-banner.js  # Cookie consent management
│   ├── images/               # Static images
│   │   ├── hero.png          # Homepage hero background
│   │   ├── leistung1.png     # Demolition service image
│   │   ├── leistung2.png     # Gutting service image
│   │   ├── leistung3.png     # Clearance service image
│   │   ├── uberuns.png       # About us / team image
│   │   ├── logo.png          # Company logo
│   │   └── logo_test.png     # Active logo (used in header/footer)
│   └── favicon.svg           # Site favicon
└── .astro/                   # Astro build cache
```

---

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:4321)
npm run dev
# or
npm start

# Build for production (outputs to /dist)
npm run build

# Preview production build locally
npm run preview

# Astro CLI
npm run astro
```

---

## Key Configuration Details

### Astro Config (`astro.config.mjs`)
- **Output:** Static (`output: 'static'`)
- **Build format:** Directory (`/about/` → `/about/index.html`)
- **Integrations:** Tailwind CSS
- **Dev Toolbar:** Disabled (`devToolbar: { enabled: false }`)
- **Optimizations:** 
  - CSS/HTML minification (`compressHTML: true`)
  - Inline stylesheets (`inlineStylesheets: 'auto'`)
  - Vite build optimizations for CSS/JS minification

### Tailwind Config (`tailwind.config.mjs`)
Custom brand colors defined:
- `metallic-platin`: #E5E4E2 (light gray background)
- `shiny-gold`: #D4AF37 (brand accent, CTAs)
- `concrete`: #7F8C8D (text gray)
- `concrete-light`: #95A5A6
- `concrete-dark`: #5D6D6E
- `wood`: #8B5A2B (accent)

Custom animations: `fade-in`, `slide-up`, `float`

Font family: Inter (with system fallbacks)

### TypeScript Paths (`tsconfig.json`)
```json
"@/*": ["src/*"]
"@components/*": ["src/components/*"]
"@layouts/*": ["src/layouts/*"]
"@styles/*": ["src/styles/*"]
```

---

## Code Style Guidelines

### Astro Components
- Use frontmatter (`---`) for TypeScript logic at top
- Props interface defined with `export interface Props`
- Destructure props with defaults: `const { title, description, ogImage = '/default.jpg' } = Astro.props`
- Use semantic HTML5 elements (`<section>`, `<article>`, `<nav>`)
- Include ARIA attributes for accessibility (`aria-label`, `aria-labelledby`, `aria-current`)
- Pages import Layout: `import Layout from '../layouts/Layout.astro'`

### CSS/Tailwind Conventions
- Use Tailwind utility classes as primary styling method
- Custom CSS only in `global.css` for:
  - Font imports (`@import '@fontsource/inter/...'`)
  - Custom scrollbar styles
  - Accessibility focus styles (`:focus-visible` with `#D4AF37`)
  - Skip-to-content link
  - Print styles
  - Reduced motion preferences (`prefers-reduced-motion`)
- Max-width container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Responsive breakpoints: `sm:`, `md:`, `lg:` (mobile-first)

### JavaScript
- Vanilla JS only (no frameworks)
- Use `document.addEventListener('DOMContentLoaded', ...)` in `main.js`
- All functions documented with JSDoc comments
- Cookie banner uses IIFE pattern in `cookie-banner.js`
- Debounce/throttle utilities provided in `main.js`

---

## Legal & Compliance Requirements

### German Legal (TMG/DSGVO)
The website **must** include:

1. **Impressum** (`/impressum/`) - Legal notice with:
   - Company name and owner (Ismail Dag)
   - Physical address (Johann-Wichernstrasse 9a, 31319 Sehnde)
   - Contact details (phone: 0162 1689715, email: Ismaildag@ymail.com)
   - VAT ID (currently marked "wird nachgereicht")
   - Gewerbeanmeldung (Gewerbeamt der Stadt Sehnde)
   - Professional liability insurance note
   - TRGS 519 & 521 certifications
   - Online dispute resolution link (EU ODR)
   - Liability disclaimers (§ 7-10 TMG)
   - Copyright notice

2. **Datenschutzerklärung** (`/datenschutz/`) - Privacy policy covering:
   - Contact form data processing (Art. 6 DSGVO basis)
   - Web3Forms as processor
   - Netlify hosting (US-based) with log data info
   - Cookie usage disclosure (localStorage)
   - User rights (Auskunft, Löschung, Berichtigung, etc.)
   - SSL encryption notice
   - Contact for data protection inquiries
   - Supervisory authority (LfD Niedersachsen)

### GDPR/DSGVO Cookie Consent
- Cookie banner implemented in `CookieBanner.astro` + `cookie-banner.js`
- Stores consent in `localStorage` (key: `federleicht_cookie_consent`)
- Three options: Accept All, Essential Only, Reject
- Consent object structure: `{ type: 'accepted'|'essential'|'rejected', timestamp: ISOString, version: '1.0' }`
- Escape key defaults to essential-only
- Public API exposed via `window.CookieConsent`

### Accessibility (a11y)
- Skip-to-main-content link (`<a href="#main-content" class="skip-to-main">`)
- Focus indicators with brand gold color (`outline: 2px solid #D4AF37`)
- ARIA labels on all interactive elements
- Semantic HTML structure
- `prefers-reduced-motion` media query support
- Alt text on all images (German language)
- Proper heading hierarchy (single `<h1>` per page)

---

## Contact Form Configuration

The contact form uses **Web3Forms** API:

```html
<form action="https://api.web3forms.com/submit" method="POST">
  <input type="hidden" name="access_key" value="IHR_WEB3FORMS_KEY_HIER" />
  <input type="hidden" name="redirect" value="https://federleicht-abriss.de/danke/" />
  <!-- fields: name, phone, email, service, address, preferred_date, message, privacy -->
</form>
```

**Important:** The access key is currently a placeholder (`IHR_WEB3FORMS_KEY_HIER`). Before deployment, this must be replaced with an actual Web3Forms access key from https://web3forms.com/

Forms exist on:
- Homepage (`index.astro`) - basic version
- Contact page (`kontakt.astro`) - extended version with address and date fields
- Both submit to the same Web3Forms endpoint and redirect to `/danke/`

---

## Deployment

### Netlify Configuration (`netlify.toml`)
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 20

### Security Headers
All pages include:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` (CSP) configured
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Redirects
HTML extension URLs redirect to clean URLs:
- `/leistungen.html` → `/leistungen/`
- `/kontakt.html` → `/kontakt/`
- etc.

### Caching
- CSS/JS files: 1 year (`max-age=31536000`)
- Fonts: 1 year (`max-age=31536000`)
- Images: 30 days (`max-age=2592000`)

---

## SEO Implementation

Each page includes:
- Unique `<title>` and `meta name="description"`
- Canonical URL (`<link rel="canonical">`)
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:locale="de_DE"`)
- Twitter Card tags
- Schema.org structured data (LocalBusiness + Organization JSON-LD in Layout.astro)
- Semantic heading hierarchy (single `<h1>` per page)
- Preconnect to Web3Forms API

---

## Images and Assets

Expected images in `public/images/`:
- `hero.png` - Homepage hero background
- `leistung1.png` - Demolition service photo
- `leistung2.png` - Gutting service photo
- `leistung3.png` - Clearance service photo
- `uberuns.png` - About us / team photo
- `logo_test.png` - Active company logo (used in header/footer)
- `logo.png` - Alternative logo

All images should:
- Be optimized (PNG format currently used)
- Include descriptive `alt` text in German
- Use `loading="lazy"` except hero images (`fetchpriority="high"`)
- Use `decoding="async"` for performance

---

## Testing Checklist

Before deploying changes:
- [ ] `npm run build` completes without errors
- [ ] All pages render correctly (`npm run preview`)
- [ ] Mobile menu works on small screens
- [ ] Contact form submits successfully
- [ ] Cookie banner appears and stores preference
- [ ] All internal links work
- [ ] Images load correctly
- [ ] No console errors
- [ ] Lighthouse audit passes (accessibility, SEO, performance)
- [ ] Impressum and Datenschutz pages are accessible

---

## Security Considerations

- No user authentication system
- No database (fully static)
- Form data handled by third-party (Web3Forms)
- CSP headers prevent XSS
- No inline scripts (all in external files)
- HTTPS enforced by Netlify
- Form honeypot field (`botcheck`) for spam protection

---

## Notes for AI Agents

1. **Language:** All content is in German. Maintain German language for any new content.

2. **Legal Pages:** Do not modify Impressum or Datenschutz without legal review. These are legally required documents under German law.

3. **Brand Colors:** Always use Tailwind classes for colors:
   - Gold accent: `text-shiny-gold`, `bg-shiny-gold`
   - Background: `bg-metallic-platin/20`, `bg-white`
   - Text: `text-gray-900` (headings), `text-gray-600` (body)

4. **Responsive Design:** All layouts use mobile-first approach with `sm:`, `md:`, `lg:` breakpoints.

5. **Form Handling:** Do not modify form action URLs or hidden fields without understanding Web3Forms API.

6. **Images:** Always include proper `alt` attributes in German for accessibility.

7. **Navigation:** When adding new pages, update:
   - `Header.astro` navItems array
   - `Footer.astro` footerLinks
   - `Layout.astro` if needed for structured data

---

*Last updated: March 2024*
