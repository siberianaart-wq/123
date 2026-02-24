# Si.beriana — Living Gallery

## Overview
A Next.js web application featuring a 3D interactive art gallery using React Three Fiber. The app displays an animated entrance with the "SI.BERIANA" title and a floating 3D gallery with interactive orbit controls.

## Tech Stack
- **Framework**: Next.js 14.2.0
- **UI**: React 18.2.0, Framer Motion
- **3D**: @react-three/fiber, @react-three/drei
- **Language**: JavaScript (JSX)

## Project Structure
```
app/
  layout.js        - Root layout with dark theme
  page.js          - Main page composing Entrance + Gallery
components/
  Entrance.jsx     - Animated title entrance section
  FloatingGallery.jsx - 3D canvas with floating geometry
public/            - Static assets (images)
next.config.js     - Next.js configuration
```

## Running
- Dev server: `npm run dev` (runs on port 5000, bound to 0.0.0.0)
- Build: `npm run build`
- Production: `npm run start` (port 5000)

## Recent Changes
- 2026-02-24: Initial setup for Replit environment (port 5000, host 0.0.0.0)
