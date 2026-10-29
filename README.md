# AUREO — Real Estate

A conceptual luxury real estate website: cinematic scroll storytelling, a pinned horizontal property showcase and a full property detail experience. Built with plain HTML, CSS and JavaScript, animated with GSAP and smoothed with Lenis.

**Live site:** https://tiagovskicode.github.io/AUREO-real-estate/

> AUREO is a fictional brand created as a design and front-end development exercise. Every property, price, address and contact detail is invented, and the enquiry form is a demonstration that sends nothing anywhere.

## Highlights

- **Cinematic hero.** A single GSAP timeline directs the opening: image reveal, oversized wordmark, line-by-line headline, copy, calls to action and a featured-residence selector.
- **Pinned horizontal story.** On desktop the collection scrolls sideways with a progress bar, numbered jump links and previous/next arrows. On tablet and phone it becomes a plain vertical list with nothing pinned.
- **Property detail view.** Each residence has its own address (`#/villa-solenne`), a gallery with lightbox, architectural highlights, a shortlist (favourites, saved in the browser) and a "private viewing" request that pre-fills the enquiry form. Browser Back closes the view.
- **One scroll system.** Lenis runs on GSAP's ticker and feeds ScrollTrigger, so there is a single animation loop. The scroll limit is re-measured after every ScrollTrigger refresh.
- **Light and dark rhythm.** Photographic hero, editorial light sections, a night-time collection that the page darkens into, and a full-bleed closing scene.
- **Bespoke buttons.** A pill button with a circular arrow disc: the fill wipes in from the left, one arrow leaves while another arrives, and a soft highlight follows the pointer. Translucent glass variants fall back to solid surfaces where `backdrop-filter` is unsupported.
- **Responsive images.** Every photograph is served as WebP in three widths through `srcset`, with reserved dimensions to avoid layout shift. The showcase photographs load when the section approaches the viewport.
- **Accessible by default.** Semantic landmarks, a skip link, visible focus states, keyboard-operable dialogs with focus trapping, labelled form fields with inline errors, and text contrast of at least 4.5:1.
- **Respects reduced motion.** When the system asks for reduced motion the site stays still and a first-visit prompt offers to turn the animation on. A "Cinematic motion" switch in the footer changes the choice at any time.

## Tech

| Area | Choice |
| --- | --- |
| Markup, style, behaviour | HTML, CSS (custom properties), vanilla JavaScript |
| Animation | [GSAP](https://gsap.com/) with ScrollTrigger and SplitText |
| Smooth scrolling | [Lenis](https://lenis.darkroom.engineering/) |
| Typography | Cormorant Garamond and Manrope (Google Fonts) |
| Icons | Inline SVG sprite |
| Image tooling | [sharp](https://sharp.pixelplumbing.com/) (development only) |

There is no build step. GSAP and Lenis are included as local files in `js/vendor/`.

### Palette

| Colour | Hex | Role |
| --- | --- | --- |
| Midnight Navy | `#14283D` | Dark surfaces, primary brand colour |
| Ocean Blue | `#438DA5` | Lines, icons and focus rings (`#2F6C80` for small text) |
| Porcelain White | `#F7F6F2` | Main light background |
| Champagne Sand | `#D8C5A5` | Highlights and primary buttons |
| Charcoal | `#252B30` | Body text and footer |

## Project structure

```
index.html              the page
css/styles.css          all styling (design tokens at the top)
js/
  data.js               property content — edit here to change the listings
  core.js               motion mode, Lenis, scroll locking, shared helpers
  properties.js         showcase, detail view, gallery, favourites, deep links
  main.js               header, menu, hero timeline, scroll animation, form
  images.js             available WebP widths per photo (generated)
  vendor/               GSAP, ScrollTrigger, SplitText, Lenis
images/                 source photographs (JPG)
images/opt/             generated WebP versions (640, 1200 and 1920 px)
docs/ART-DIRECTION.md   design decisions and rationale
assets/                 original reference images from the Figma design
tools/optimize-images.cjs   generates the WebP files and js/images.js
```

## Run locally

The site is static, so any file server works:

```bash
npm start
```

Then open http://localhost:5174. Opening `index.html` directly also works, but a server matches the hosted site more closely.

## Edit the content

- **Properties:** change `js/data.js`. Each entry holds the text, specs, highlights and gallery images.
- **Photographs:** add the JPG to `images/`, run `npm install` once and `npm run images`, then reference it in `js/data.js` or `index.html`.
- **Colours and spacing:** the tokens are at the top of `css/styles.css`.

## Deploy

The repository is published with GitHub Pages: *Settings → Pages → Deploy from a branch → `main` / `(root)`*. The `.nojekyll` file makes GitHub serve everything as it is. All paths are relative, so the site works under `/AUREO-real-estate/`.

## Credits

Photography comes from [Unsplash](https://unsplash.com/) and from images supplied with the project. Check each image's licence before reusing it outside this concept. GSAP and Lenis are used under their own licences.
