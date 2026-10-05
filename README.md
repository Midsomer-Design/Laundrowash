# Laundrowash website

A refreshed website for **Laundrowash**, the family-owned laundry, ironing and dry-cleaning business at 31 Waples Road, Unanderra NSW (owner: Keith Somerville).

It's a fast, mobile-first static site: plain HTML, CSS and a small amount of JavaScript. There's no build step, no framework and no plugins to update, so it can be hosted anywhere.

## Pages

| URL | Page |
|-----|------|
| `/` | Home |
| `/domestic/` | Household laundry (wash & fold, ironing, doonas, mending, dry cleaning) |
| `/commercial/` | Business laundry (salons, clinics, cafés, hospitality, schools, mechanics) |
| `/industrial/` | Industrial workwear (mines, civil, diesel workshops) |
| `/pricing/` | Price guide *(new)* |
| `/about-us/` | About Laundrowash and Keith |
| `/contact/` | Pickup / quote form, hours, map |
| `/privacy-policy/`, `/terms-conditions/` | Rewritten in plain English |
| `/404.html` | Friendly "page not found" |

The main URLs match the old WordPress site, so existing Google rankings and links carry over. `.htaccess` redirects the old theme demo pages (`/home-2/`, `/shop/`, `/team-one/`, etc.).

## Preview locally

```bash
npx serve .          # then open http://localhost:3000
# or
python3 -m http.server 8080
```

The pages use root-relative paths (`/assets/...`), so preview through a local server rather than by double-clicking the HTML files.

## Deploying

**Same host as now (SiteGround / cPanel):** back up the current WordPress site first, then upload the contents of this folder to `public_html`. The included `.htaccess` handles HTTPS/www, redirects, caching, compression and the 404 page.

**Netlify / Vercel / Cloudflare Pages:** connect the repo with no build command, and set the publish directory to `/`.

## Things to update

### Contact form
Out of the box, the form opens the visitor's email app with everything filled in, so it works with no backend. To have enquiries arrive straight in your inbox instead:

1. Create a free form at [Formspree](https://formspree.io) (or similar) that sends to `info@laundrowash.com.au`.
2. In `contact/index.html`, add the endpoint to the form: `<form data-enquiry data-endpoint="https://formspree.io/f/XXXXXXX" …>`

The script then submits in the background and shows a thank-you message.

### Opening hours
Hours appear in a few places. If they change, update all of them:
- `assets/js/main.js` → the `HOURS` object (drives the live "Open now / Closed" badge and the "Today" highlight)
- The hours tables (`<table class="hours">`) on Home, About and Contact
- The footer hours (`<dl class="footer-hours">`) and the `openingHoursSpecification` in the JSON-LD `<script>` near the top of each page

### Photos
See **[IMAGES.md](IMAGES.md)** for the full shot list, sizes and how to swap placeholders for real photos.

### Phone, email, address
Search and replace across all `.html` files: `(02) 4272 4433` / `+61242724433`, `info@laundrowash.com.au`, `31 Waples Road`.

## To confirm with Keith before launch

- [ ] **Opening hours.** Taken from directory listings (the old site didn't list them): Mon & Wed–Fri 8–5, **Tue 8–12**, Sat 8–2, Sun closed.
- [ ] **Prices.** Ironing baskets from $30; hand ironing from $3.50/item (min. 10); doonas $15 / $20 / $25 / $30 plus $5 for an underlay. Also any prices to add for wash & fold and dry cleaning.
- [ ] **Pickup & delivery.** The site says it's free for business/industrial customers. Which suburbs are covered?
- [ ] **"25+ years" / "family-owned".** Carried over from the old site's wording.
- [ ] **KeiraPC mention** on the About page. Keep or remove?
- [ ] **Reviews.** The four reviews from the old site are used. Link the "Read our Google reviews" button to the Google Business Profile.
- [ ] **Facilities.** Covered garden area, cuppa while you wait, big machines for doonas.
- [ ] **Terms & privacy.** Rewritten in plain English; check the 48-hour claims window and 90-day uncollected items period.
- [ ] **Logo.** A new wordmark and washing-machine icon were created (`assets/img/logo-mark.svg`); swap in an existing logo if preferred.

## Design notes

Built after reviewing high-performing laundry and dry-cleaning sites in Australia and overseas (The Laundry Lady, City Central Laundry, Hampr, Laundryheap, Oxwash, Mulberrys and the Awwwards-nominated Laundry Loft), plus current local-business conversion guidance. What we carried over:

- **Clear value proposition and two primary actions** above the fold (Get in touch / Call).
- **Sticky thumb-zone action bar on mobile** (Call · Directions · Get in touch).
- **Live "Open now" status** and today's hours highlighted.
- **Audience split** (Home / Business / Industrial) so each visitor finds their path in one tap.
- **"How it works" in three steps**, **transparent pricing** and **reviews placed near decisions**.
- **FAQ**, service-area list, embedded map and **LocalBusiness + FAQ structured data** for local SEO.
- Accessible: semantic landmarks, skip link, visible focus states, 44px+ tap targets, reduced-motion support.
- Fast: self-hosted variable fonts, one CSS file, one small JS file, SVG icons, lazy-loaded map.

Brand colours are refreshed from the original navy (`#28406d`) and yellow (`#e2c606`). Fonts are Bricolage Grotesque and Plus Jakarta Sans (OFL; see `assets/fonts/LICENSE.md`).
