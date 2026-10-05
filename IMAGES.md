# Photo shot list

The site has 16 photo placeholders. Each one is a light-blue box with a label describing the photo that should go there. They're all marked in the HTML like this:

```html
<div class="ph ph--square" role="img" aria-label="Photo placeholder: …">…</div>
```

## How to swap in a real photo

Replace the whole `<div class="ph …">…</div>` with an image, keeping it inside its parent element:

```html
<img class="media-img" src="/assets/img/photos/ironing.webp"
     alt="Team member pressing a business shirt at Laundrowash"
     width="1200" height="1200" loading="lazy">
```

- Use `loading="lazy"` for every photo **except** the homepage hero, which should load straight away.
- Write a short, specific `alt` description for each photo. It helps accessibility and Google Images.
- Export as **WebP** (or high-quality JPG) at the sizes below, aiming for under ~250 KB each.
- Real photos of Keith, the team and the shop will outperform stock photography. Locals want to see the actual place.

## Shots needed

### Home (`/`)

| # | Photo | Size |
|---|-------|------|
| 1 | **Hero:** a smiling team member handing a neat stack of fresh, folded towels across the Laundrowash counter | 1200×1500 (4:5) |
| 2 | **Household card:** a parent and child on the couch with a basket of neatly folded laundry | 1600×1000 (16:10) |
| 3 | **Business card:** crisp white towels on a salon shelf, or a café tablecloth being folded | 1600×1000 (16:10) |
| 4 | **Industrial card:** hi-vis workwear and overalls hanging clean on a rack | 1600×1000 (16:10) |
| 5 | **Ironing:** a team member pressing a crisp business shirt, rail of ironed shirts behind | 1200×1200 (1:1) |
| 6 | **Shopfront:** the Laundrowash shop on Waples Road, Unanderra | 1600×1200 (4:3) |

### Household (`/domestic/`)

| # | Photo | Size |
|---|-------|------|
| 7 | Fresh, neatly folded family laundry stacked in a basket on a bed | 1600×1200 (4:3) |
| 8 | A family enjoying a weekend outdoors at the beach or park (stock is fine) | 1200×1200 (1:1) |

### Business (`/commercial/`)

| # | Photo | Size |
|---|-------|------|
| 10 | Stacks of crisp white salon/spa towels, with a delivery bag ready to go | 1600×1200 (4:3) |
| 11 | A café or restaurant table with a pressed white tablecloth and napkins | 1200×1200 (1:1) |

### Industrial (`/industrial/`)

| # | Photo | Size |
|---|-------|------|
| 12 | Rows of clean hi-vis shirts and navy work overalls on a rack | 1600×1200 (4:3) |
| 13 | A large industrial washing machine being loaded with heavy workwear | 1200×1200 (1:1) |
| 14 | A smiling worker in a clean hi-vis shirt at the start of a shift (stock is fine) | 1200×1200 (1:1) |

### About (`/about-us/`)

| # | Photo | Size |
|---|-------|------|
| 15 | Keith and the team smiling behind the front counter | 1600×1200 (4:3) |
| 16 | Portrait of Keith Somerville in the shop | 1200×1600 (3:4) |
| 17 | A customer walking in carrying a doona and a basket of washing | 1200×1200 (1:1) |

**Tip:** shots 1, 5, 6, 13, 15, 16 and 17 can all be captured in a single one-hour shoot at the shop.
