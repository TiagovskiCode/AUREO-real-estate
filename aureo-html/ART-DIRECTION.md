# AUREO — Art direction

Decisions made before the rebuild. Intelligence source: the UI UX Pro Max skill (installed locally in
`.claude/skills/ui-ux-pro-max`; its CSV data was read directly because `search.py` needs Python, which is not
installed here). Nothing from uupm.cc's own branding or layout was copied.

## Personality
Quiet, architectural, confident. A private gallery rather than a portal: few words, large images, deliberate pauses.
Taken from the skill's data: *Real Estate* → hero-centric + minimalism; *Luxury/Premium Brand* → storytelling-driven;
*Liquid Glass* → navigation and controls only, never content; *Motion-Driven* → GSAP, transforms only, 300–400 ms hovers.

## Typography
- Cormorant Garamond for voice: headlines, property names, prices, tag-lines (italic).
- Manrope for function: navigation, buttons (sentence case, as in the reference), specs, forms.
- Small uppercase Manrope labels (0.72rem, 0.2em) only for section markers.

## Space and layout
- One gutter token (`--gutter`), 12-column logic on desktop, asymmetry through image ratios (2:3, 3:4, 1:1, 3:2).
- Hero follows the reference: wordmark left, centred links, glass "Enquire" right, copy block at ~45% height.

## Image direction
Navy grade over every photograph via gradients (no blend modes, no filters: they repaint on scroll).
Each property has its own ratio, crop and gallery of three frames.

## Interaction language
- **Glass is reserved for CTAs, header and floating controls.** Layers: translucent fill, backdrop blur, 1px edge,
  inner highlight, specular light from the top-left, gliding reflection on hover, arrow in its own disc.
  Primary = tinted glass or navy; secondary = clear glass. Opaque fallback if `backdrop-filter` is unsupported.
- Solid navy buttons on light grounds so contrast stays above 4.5:1.

## Motion
One timeline for the opening, one vocabulary after it (line reveal, clip reveal, rise, parallax). One pinned
sequence only (the property story, desktop). One scroll controller (Lenis on GSAP's ticker). Everything is
off or static under reduced motion, with a visible switch to opt back in.

## Light and dark rhythm
Dark photographic hero → porcelain introduction → sand property story → dark photographic interlude →
porcelain services index (rows fill navy on hover) → warm editorial feature → navy statement → porcelain contact →
charcoal footer.

## Property hierarchy
Image first, then name (serif), tag-line (italic), three specs, price, one action. The detail view adds the
narrative, four architectural highlights, a three-image gallery with lightbox, shortlist and a private-viewing request.
