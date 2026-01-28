# Zenshinsuru.com Redesign - Handoff Documentation

## Project Context

**Date:** January 2026
**Branch:** `claude/redesign-zenshinsuru-1V2R3`
**Previous State:** Personal site with interactive canvas starfield, spaceship game, and oneko cat

## What Changed

The site was completely redesigned from a personal/artistic site into a **web design portfolio** showcasing demo websites. The goal is to use zenshinsuru.com as a professional portfolio where potential clients can see examples of website work.

### New Structure

```
zenshinsuru.com/
├── index.html                    # Portfolio landing page
├── demos/
│   ├── la-abejita/
│   │   └── index.html           # Mexican restaurant demo
│   ├── techflow/
│   │   └── index.html           # SaaS/startup demo
│   └── haven-realty/
│       └── index.html           # Real estate agency demo
├── TIMOTHY_DOCS/                 # This documentation
├── style.css                     # (legacy - not used by new pages)
├── script.js                     # (legacy - not used by new pages)
└── [other legacy files]
```

### Design Decisions

1. **Self-contained demos**: Each demo site has all CSS inline in the HTML file. This makes them completely standalone and easy to copy/share. No external dependencies except Google Fonts.

2. **Consistent navigation pattern**: Every demo has a "Back to Portfolio" link in the footer that returns to the main landing page (`../../`).

3. **Professional aesthetic**: The portfolio landing uses a dark theme with purple/indigo gradients. Clean, modern, "agency" feel.

4. **Demo variety**: Three different industries to show range:
   - Restaurant (warm, inviting)
   - SaaS (dark, techy, conversion-focused)
   - Real Estate (professional, trustworthy)

## Demo Details

### 1. La Abejita (Mexican Restaurant)
- **Color palette:** Terracotta (#c2410c), gold (#d97706), sage green (#365314), cream (#faf6f1)
- **Fonts:** Playfair Display (display), Lato (body)
- **Sections:** Hero, About/Story, Menu with items, Weekly Specials, Location/Hours
- **Vibe:** Warm, family-owned, authentic

### 2. TechFlow (SaaS Platform)
- **Color palette:** Dark (#09090b), blue (#3b82f6), purple (#8b5cf6)
- **Fonts:** Inter
- **Sections:** Hero with stats, Features (6-card grid), Pricing (3 tiers), Testimonials, CTA
- **Vibe:** Modern startup, conversion-focused, professional

### 3. Haven Realty (Real Estate)
- **Color palette:** Navy (#1e3a5f), gold (#c9a962), cream, white
- **Fonts:** DM Serif Display (display), DM Sans (body)
- **Sections:** Hero, Search bar, Featured Listings (6 properties), Agent profiles, CTA
- **Vibe:** Professional, trustworthy, premium

## Deployment

The site deploys via rsync to a Vultr VPS:

```bash
# From local repo at:
# /home/trashh_panda/code/PROJECTS/VULTR_0/sites/zenshinsuru.com

./deploy.sh
```

The deploy script excludes certain directories (see deploy.sh for details).

## Future Work Ideas

1. **More demo sites**: Add demos for other industries (fitness, photography, e-commerce, portfolio, etc.)

2. **Screenshots**: Add actual screenshot images of the demos to the portfolio cards instead of emoji placeholders

3. **About page**: Add a dedicated about/services page for the portfolio

4. **Contact form**: Add a working contact form (would need backend)

5. **Case studies**: Expand each demo card to have a dedicated case study page explaining the design process

6. **Mobile polish**: The demos are responsive but could use more mobile-specific refinements

7. **Animations**: Add subtle scroll animations or transitions to make demos feel more polished

8. **Auto-deploy**: Set up GitHub Actions to auto-deploy on push (would need SSH keys as secrets)

## Technical Notes

- All pages use Google Fonts loaded via CDN
- No build process - pure static HTML/CSS/JS
- Each demo is ~600-1000 lines of self-contained HTML
- Responsive breakpoints typically at 768px and 1024px
- Using CSS custom properties (variables) for theming
- Unicode emoji used for placeholder icons (can be replaced with real images/SVGs)

## Legacy Files

The following files are from the previous version and aren't used by the new portfolio:
- `style.css` - Old cyberpunk styles
- `script.js` - Canvas starfield/spaceship game
- `oneko.js` / `oneko-standalone.js` - Mouse-following cat
- `texts/` directory - Old blog posts
- Various birthday pages (alejo.html, etc.)

These could be removed or kept for reference. The oneko cat is actually a cool standalone component that could be repurposed.

## Questions for Tim

- Keep or remove legacy files?
- Any specific industries you want demos for next?
- Want real placeholder images instead of emoji?
- Should the demos have working forms (would need backend)?
