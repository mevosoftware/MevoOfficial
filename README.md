# Mevo School — Marketing Website

Premium marketing site for **Mevo School**, a modern school management SaaS platform.

> **Software for What's Next.**

## Running locally

No build step, no dependencies. Serve the folder with any static server:

```bash
python3 -m http.server 3000
# or
npx serve .
```

Then open `http://localhost:3000`.

## Structure

```
index.html                  Full page markup + inline SVG icon sprite
assets/css/base.css         Design tokens, reset, typography, buttons
assets/css/product-ui.css   The "real application" UI kit (app chrome,
                            tables, charts, metric tiles, phone frame)
assets/css/site.css         Page sections, responsive rules, reveal system
assets/js/product-ui.js     Templates for every product interface shown on
                            the page (features, tour, phone, ecosystem)
assets/js/app.js            Interaction layer: boot sequence, scroll reveals,
                            counters, chart drawing, tabs, accordion,
                            ecosystem hover graph, pricing toggle
```

## Design system

| Token | Value |
| --- | --- |
| Primary surface | `#FFFFFF` |
| Brand / deep blue | `#03045E` |
| Light blue washes | `#F6F8FD`, `#EEF2FC` |
| Text | `#090B2A` navy, `#5B6478` neutral gray |
| Type | Inter (UI + display), IBM Plex Mono (labels) |

Deep blue is used only for CTAs, active navigation, key statistics, charts
and product UI accents — the page itself stays white.

## Notes

* All product screens are **rendered UI**, not screenshots — they animate,
  respond to interaction and re-render per tab.
* No customer logos or customer statistics are shown. Where a marketing site
  would normally use social proof, the page shows product capabilities instead.
* Motion respects `prefers-reduced-motion`.
* The mobile showcase uses purpose-built touch layouts (bottom navigation,
  48px targets), not a scaled-down desktop view.
