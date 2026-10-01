# Federleicht Abriss — Agent Notes

Static Astro 4 marketing site (de-DE) for a demolition/gutting company in Sehnde, Germany. Deployed to Netlify. 8 pages, no client framework, no backend.

## Commands

```bash
npm ci                 # lockfile is committed; Netlify runs exactly this
npm run build          # the only real verification step (~450ms, 8 pages -> dist/)
npm run dev            # localhost:4321
npm run preview        # serves dist/
npm run astro -- <cmd> # pass-through to the astro CLI
```

**There is no lint, format, test, or typecheck.** Don't invent one and don't reach for `npx astro check` — `@astrojs/check` and `typescript` are *not* installed, so it drops into an interactive install prompt. `npm run build` is the whole gate.

## Highest-value gotcha: `src/styles/global.css` is orphaned

Nothing imports it — not `Layout.astro`, not any page. Verified against a real build: the only CSS emitted is the Tailwind bundle `dist/_astro/danke.*.css`, containing zero `@fontsource` references, no `:focus-visible` rule, and no `/fonts/` directory in `dist`.

So all of this is currently **dead CSS**: the Inter webfont import, the gold `:focus-visible` outline, `.skip-to-main` (the skip link renders as a visible gold link at the top of every page because it falls back to `position: static`), the custom scrollbar, the `prefers-reduced-motion` block, and print styles.

To fix, add `import '../styles/global.css';` to the `Layout.astro` frontmatter. Don't assume it's wired in just because it exists.

## Architecture

- **There is no `src/components/`.** Header, desktop+mobile nav, footer, and cookie banner markup are all inlined in `src/layouts/Layout.astro` (~340 lines). Edit there.
- `Layout.astro` owns the whole HTML shell: meta/OG/Twitter tags, two JSON-LD blocks (LocalBusiness + Organization), header, footer, cookie banner, and the `<script defer>` tags. Pages supply only `<slot />` content.
- All 8 pages import it relatively: `import Layout from '../layouts/Layout.astro';`. The `@layouts/*` etc. aliases in `tsconfig.json` are configured but unused — don't switch to them casually.
- Client JS is plain vanilla files in `public/js/`, loaded via `<script defer>`. No islands, no `is:inline`, no hydration.

## JS wiring quirks

| File | Loaded by | Binds to |
|---|---|---|
| `main.js` | `Layout.astro` (all pages) | `#mobile-menu-btn`, `#mobile-menu`, `#header` |
| `cookie-banner.js` | `Layout.astro` (all pages) | `#cookie-banner` + 3 buttons |
| `form-handler.js` | **only** `kontakt.astro` | `#contact-form`, `#submit-btn` |

- `main.js` scroll animations key off `[data-animate]`, which appears **nowhere** in `src/`. `initScrollAnimations()` is dead code. The Tailwind `animate-fade-in` / `animate-slide-up` classes themselves do work when applied directly (they're used as static classes in the markup).
- The header is `fixed` with a hard-coded `h-28`, followed by a separate `<div class="h-28"></div>` spacer. Change the header height and you must change the spacer or content hides underneath.
- Cookie consent lives in `localStorage` under `federleicht_cookie_consent`. There is **no UI to reopen the banner** — re-testing the consent flow requires clearing that key or calling `window.CookieConsent.revoke()` (which clears and reloads). Escape key = "essential only".

## Images

Every photo is a **WebP + PNG pair** in `public/images/`, served as `<picture>` with `.webp` in `<source>` and `.png` in `<img src>` as fallback. New images need both formats.

`logo_test.*` is the live logo. `logo.*` is otherwise unused — it's only referenced by the Organization JSON-LD as `https://federleicht-abriss.de/logo.png`, which is a **broken path** (missing `/images/`, and no such file in `dist/`).

## Forms (Web3Forms)

Two independent copies of the same form; keep them in sync manually.

- `index.astro` (short) and `kontakt.astro` (extended: adds `address`, `preferred_date`).
- Hard-coded `access_key` in both (`index.astro:483`, `kontakt.astro:173`). The `form-action` / `connect-src` CSP in `netlify.toml` allow-lists `api.web3forms.com` — changing providers requires a CSP edit *and* a `datenschutz.astro` update.
- Honeypot is a `checkbox` named `botcheck`, hidden with Tailwind's `class="hidden"`.
- The `redirect` hidden field points at the absolute `https://federleicht-abriss.de/danke/`. Change it in both or local form tests will jump to production.
- Required on both: `name`, `phone`, `privacy` (checkbox). Email is **optional**.
- Service `<option>` values differ: kontakt adds `asbestsanierung` and `mineralwolle`. Keep the `value` slugs in sync if you touch them.
- `form-handler.js`'s loading state only works on `/kontakt/` — the homepage form has no `id="contact-form"`.

## Legal pages (treat as locked)

`impressum.astro` and `datenschutz.astro` exist to satisfy German law. Don't reword them without legal review. Specific facts other code depends on:

- USt-IdNr is rendered as the literal placeholder `wird nachgereicht` — it has never been issued. The **Steuernummer** `16/109/27238` (Finanzamt Hannover) lives in a *separate* block; a Steuernummer is not a USt-IdNr (`DE…`), so don't merge the two or move one into the other.
- Contact email is `info@federleicht-abriss.de` (14 occurrences across `src/`). An older `Ismaildag@ymail.com` no longer exists — don't reintroduce it.
- `datenschutz.astro` names **Netlify, Inc. (USA)** as host and **Web3Forms** as form processor, and mentions `localStorage` cookie consent. Changing hosting or the form provider makes this page wrong.

## Deployment & routing gotchas

- `netlify.toml` and `public/_redirects` **duplicate** the same `.html` → clean-URL 301s and the 404 fallback. Both ship (Netlify prefers `_redirects` for overlapping rules). Edit both or they silently diverge.
- 404 mismatch: the build emits `dist/404.html`, but both redirect rules point at `/404/`, and no `/404/` directory exists in `dist`. Verify the custom 404 actually serves before assuming it does.
- CSP allows `frame-src https://www.google.com` solely for the `kontakt.astro` map iframe. Any new third-party embed needs a CSP edit.
- `netlify.toml` caches `/fonts/*` for a year — a path that doesn't exist today (see the global.css note).

## SEO

- `public/sitemap.xml` is hand-maintained with hard-coded `lastmod` dates. It deliberately omits `/danke/`. Update it by hand when adding a public page.
- `siteUrl = 'https://federleicht-abriss.de'` is hard-coded in `Layout.astro` frontmatter for canonical/OG URLs — there is no env var.
- Nav links are duplicated between the header and the footer's "Quick Links" block, both in `Layout.astro`. Update both.

## Conventions

- **All user-facing copy is German (de-DE).** Keep new content German.
- Brand colors are Tailwind tokens — use the class, not a hex literal: `shiny-gold` (#D4AF37), `metallic-platin` (#E5E4E2), `concrete` / `-light` / `-dark`, `wood`. Note #D4AF37 is *also* hard-coded inline in `Layout.astro` (`style="border: 2px solid #D4AF37"`, `theme-color`, JSON-LD).
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. Mobile-first `sm:` / `md:` / `lg:` breakpoints.
- Accessibility is deliberate and already implemented — keep it when editing: skip link, `aria-current` on active nav, `aria-expanded` on the menu toggle, `aria-hidden` on decorative SVGs, exactly one `<h1>` per page, German `alt` text, `loading`/`decoding`/`width`/`height` on images.
