# Rocket Launch Visualizer

An interactive browser-based tool for simulating and visualizing rocket trajectories using a physics-based gravity turn model.

## Features

- RK4 gravity turn simulation with atmospheric drag
- Configurable launch parameters: target orbit altitude, thrust-to-weight ratio, pitchover angle, pitchover altitude, and atmosphere toggle
- SVG trajectory graph with a velocity-gradient path, launch/insertion markers, and a hover tooltip showing altitude, velocity, downrange distance, and elapsed time
- Orbit stats panel: circular velocity, achieved velocity, circularization Δv, total Δv, burn duration, and apogee

## Tech Stack

- React 19 + TypeScript
- Vite
- D3 v7 (scales/math, React-owned DOM)
- react-hook-form + Zod (validated controls)
- Tailwind CSS v4

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
