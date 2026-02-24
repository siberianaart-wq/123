# Si.beriana — Living Gallery

## Overview
A Next.js web application featuring a 3D interactive art gallery. The app displays an animated entrance with the "SI.BERIANA" title (letter-by-letter animation) and a tornado-style floating gallery of artworks with 3D rotation effects.

## Tech Stack
- **Framework**: Next.js 14.2.0
- **UI**: React 18.2.0, Framer Motion
- **Language**: JavaScript (JSX)

## Project Structure
```
app/
  layout.js              - Root layout with dark theme
  page.js                - Main page composing Entrance + Gallery
components/
  Entrance.jsx           - Animated title entrance section
  FloatingGallery.jsx    - Tornado gallery with 3D effects and lightbox
gallery.config.js        - Image list config (add/remove images here)
public/                  - Static assets (place gallery images here)
next.config.js           - Next.js configuration
```

## Adding/Replacing Gallery Images
1. Place image files in the `public/` folder
2. Edit `gallery.config.js` — add or remove paths from the array
3. The gallery auto-generates layout configs for any number of images

## Running
- Dev server: `npm run dev` (runs on port 5000, bound to 0.0.0.0)
- Build: `npm run build`
- Production: `npm run start` (port 5000)

## Recent Changes
- 2026-02-24: Made gallery images configurable via gallery.config.js
- 2026-02-24: Added lightbox (click to expand image to 85% screen)
- 2026-02-24: Added 3D rotation effects to cards and pink square
- 2026-02-24: Tornado layout with cascading yOffset levels
- 2026-02-24: Letter-by-letter title animation with pink dot accent
- 2026-02-24: Initial setup for Replit environment (port 5000, host 0.0.0.0)
