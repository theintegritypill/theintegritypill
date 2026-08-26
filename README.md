# Handoff: The Integrity Pill — Lead Magnet Landing Page

## Overview
A single-scroll landing page for "The Integrity Pill" (Men Built For More brand), a free 30-page book by Jonathan Livingston. The page pitches the book to men already familiar with "red pill" material, collects name + email in exchange for early access, and releases September 2026.

Reconstructed from a Claude-exported static HTML file, preserving the design exactly (copy, layout, typography, imagery, responsive behavior, animations, visual styling) — not redesigned.

## Structure
Plain HTML/CSS/vanilla JS, no build step or framework dependency — same approach as the sibling `../UNSHAKABLE FOUNDATIONS` project.

- **`index.html`** — the entire page: markup, inline `<style>`, inline `<script>`.
- **`assets/`** — production image files (the book cover, author photo, and footer logo were originally embedded as base64 data URIs in the Claude export; extracted to real files so the page loads fast and the HTML stays readable):
  - `book-cover.png` — 3D book cover render (transparent background), shown in the book/early-access section with a hover tilt effect. Swapped to a higher-resolution official render partway through the build; resized to 520px wide to keep the file size reasonable (~550KB) since no local image tooling was available to re-encode it as WebP.
  - `author-photo.jpg` — Jonathan on a podcast/coaching call, shown in the Author card.
  - `footer-logo.png` — Men Built For More mountain mark, shown in the footer.
- **`vercel.json`** — long-cache header for `/assets/*`.

## Fidelity
**High-fidelity, final.** All colors, typography, spacing, copy, layout, and interactive behavior (scroll progress bar, sticky nav bar, scroll-reveal animations, cover-image hover tilt, floating form labels) are final. Do not redesign — implement as-is.

## Structure (single scroll page, in order)
1. **Header** — wordmark (three-pill icon) + "FREE 30-PAGE BOOK" badge.
2. **Hero** — pill-spectrum icon, eyebrow, three-line headline, body copy, stat row (30 Pages / 3 Pills / 1 Answer), then the **book / early-access block**: book cover (hover tilt) → release note → opt-in form → microcopy. Single column on mobile (book centered, prominent); two-column grid (`.ip-book-cta`, book left / form right) from 640px up. This block is pre-launch messaging only — the book isn't available yet, so copy and success states read as "join the early-access list," not "here's your book."
3. **From Jonathan** — editorial two-column pull-quote section.
4. **Inside The Book** — three-pill ladder (blue/red/integrity) + comparison row of outcomes.
5. **The Journey** — three numbered stage cards (Blue Pill / Red Pill / Integrity Pill) with connecting "crack" spine-motif dividers, personal story callouts, and a testimonial proof card (Sinn quote).
6. **What Changes When You Read It** — four-item vertical timeline (Ceiling, Blind Spot, Root, Practice).
7. **The Author** — photo + bio + credential chips.
8. **Closing CTA** — headline, second opt-in form, signature block.
9. **Footer** — mountain logo + brand caption.

## Interactions & Behavior
- **Scroll progress bar**: fixed 3px bar at the top, fills left-to-right based on scroll position (orange-to-gold gradient).
- **Sticky mini nav bar**: appears once the header scrolls out of view (`IntersectionObserver` on `#top`), with a "Get The Book" anchor link to `#getbook`.
- **Scroll-reveal animations**: journey cards, crack dividers, and the "what changes" timeline items fade/slide in on scroll (`IntersectionObserver`, one-shot).
- **Opt-in forms** (`#heroForm`, `#finalForm`): floating labels, client-side `required` validation. On submit, both forms are wired to the same `handleOptin()` handler.
- **`prefers-reduced-motion`**: all animations/transitions are disabled for users who request it.

## Opt-in Form — Needs Wiring Before Launch
The original export used a Claude-preview-only `window.storage` API that does not exist in production. It's been replaced with a real `fetch()`-based submission, gated behind one constant:

```js
// index.html, inside the <script> at the bottom
const OPTIN_ENDPOINT = '';
```

- **As shipped**: `OPTIN_ENDPOINT` is empty, so the form shows the success state immediately on submit without sending the data anywhere. This keeps the page fully functional for design review/demo purposes.
- **Before launch**: set `OPTIN_ENDPOINT` to a real endpoint (an ESP form action — ConvertKit, Mailchimp, Beehiiv — or a serverless function that stores the lead and triggers the delivery email). The handler POSTs `{ firstname, email, ts }` as JSON and shows an inline error state (`.ip-form-error`) if the request fails, re-enabling the submit button so the user can retry.

## Design Tokens
- **Background**: `#0a0806` with two radial orange glows (top-right, bottom-left corners).
- **Cream**: `#f4efe6` (headlines, primary text)
- **Body text**: `#d9cebd`
- **Orange (brand accent)**: `#e8672d`, hover `#f28a54`
- **Blue (blue pill)**: `#4a7fb8`
- **Red (red pill)**: `#d8453d`
- **Gold**: `#d9a441` (progress bar gradient)
- **Card background**: `rgba(13,10,8,0.45)` (translucent) / `rgb(13,11,9)` (solid)
- **Fonts**: Anton (display/headlines/numbers), Poppins (body, weights 400–800, italic 400–600), IBM Plex Mono (eyebrows/labels/microcopy)
- **Container**: max-width 720px, centered, 28px side padding (18px under 480px)
- **Border radius**: 16–20px (cards/hero), 12px (buttons), 10px (inputs), 50% (icon circles)

## Responsive Behavior
Single 720px max-width centered column with fluid flex/grid, reflowing naturally on tablet and desktop. A mobile breakpoint (`max-width: 480px`) reduces container padding, headline sizes, card padding, and journey-card icon/number sizing. A second breakpoint (`max-width: 700px`) collapses the "From Jonathan" two-column editorial grid into a stacked layout with the sticky rail becoming a static horizontal row. A third (`max-width: 560px`) inserts a manual line break in the "waking up" transition line.

Verified visually and via `scrollWidth`/`clientWidth` checks at 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1920px — no horizontal overflow, clipped imagery, overlapping text, or awkward form wrapping at any width. The book/early-access `.ip-book-cta` block switches from single-column (book centered above the form) to a two-column grid at 640px.

## Production Notes
- No dependency on any Claude/design-preview environment — plain HTML/CSS/JS, confirmed working when served from a plain static file server.
- `vercel.json` sets a long-cache header for `/assets/*` (static images, safe to cache aggressively).
- No `robots` restriction — unlike the private depositor invitations in the sibling project, this is a public lead-magnet page meant to be found and shared.

## Files
- `index.html` — the full page (markup, styles, script)
- `assets/` — book cover, author photo, footer logo (extracted from the original base64 export)
- `vercel.json` — static hosting config (asset caching headers)

Open `index.html` directly in a browser to preview, or serve the folder with any static file server.
