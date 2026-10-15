# Inventis Labs — site

Marketing site and live seismic demonstrator for Inventis Labs, the Roorkee
deep-tech company building indigenous earthquake early warning (EQ-Alert,
MARS) and structural health monitoring.

The organising idea: **an earthquake emits two waves at two speeds, and the gap
between their arrivals is the only warning that will ever exist.** Everything
here is derived from that one line —

```
warning time = d / Vs − d / Vp = d / (6.0 − 3.5) = d / 2.5
```

No number on any screen is hard-coded. The chart, the copy, the command centre
and the playground all call the same functions in `src/lib/wave.ts`.

## Routes

| Route         | What it is                                                            |
| ------------- | --------------------------------------------------------------------- |
| `/`           | Marketing site                                                        |
| `/story`      | Nine-chapter scrollytelling narrative, ends with a self-auditing receipt |
| `/app`        | Command Center — live network map, station trace, response ladder     |
| `/playground` | Pick an epicentre on the map, pick your city, run the clock (0.5×)  |

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · zero UI
dependencies. Static export, deployed to GitHub Pages.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
npm run typecheck
```

## Theming

Light and dark are first-class. Semantic tokens live in `src/app/globals.css`
under `:root` and `[data-theme="dark"]`; components never reference a raw hex
value. The theme is set before first paint by an inline script in
`src/app/layout.tsx`, reads `localStorage("il-theme")`, and falls back to
`prefers-color-scheme`.

Two things that have bitten this codebase:

- **`.btn` deliberately does not set `display`.** A `display` in a component
  class outranks the `hidden` / `md:inline-flex` utilities and silently breaks
  responsive visibility. Callers pass `inline-flex`.
- **`useImpactShake` returns no cleanup.** It re-runs on every `elapsed` tick;
  a cleanup would strip the class mid-animation and the shake would die after
  ~30 ms. Teardown lives in a separate unmount-only effect.
- **The sim clock derives from a fixed base, never from a running total.**
  Adding `(now - start)` on every animation frame compounds quadratically and
  finishes the event in a fraction of a second. See the comment in
  `src/lib/sim.ts`.

## The map

`src/components/NetworkMap.tsx` carries a Natural Earth 1:50m India outline,
Douglas-Peucker simplified to ~490 points. That admin-0 ring excludes most of
the disputed region, so the claimed extent is restored from the **1:10m admin-1
layer** — real boundaries, not hand-traced ones:

| Constant                | Source                              |
| ----------------------- | ----------------------------------- |
| `KASHMIR_AJK`           | Pakistan / Azad Kashmir             |
| `KASHMIR_NORTHERN_AREAS`| Pakistan / Northern Areas (GB)     |
| `KASHMIR_SIACHEN`       | Siachen Glacier                     |
| `KASHMIR_LADAKH_CLAIMED`| India / Ladakh, which NE draws to the LAC |

All four are filled underneath the main outline so the five shapes read as one
landmass. The lines left running through the region are the LoC and the LAC —
real boundaries inside the claimed territory, not artefacts.

Simplified at 0.02°. The ~550 km Central Himalayan gap marker is indicative;
it is labelled as such in the UI.

## What is real and what is not

**Real:** wave velocities and every warning time derived from them; all city
and sensor coordinates; ISRO seismic zones; the boundary geometry (Natural
Earth); the 170-sensor Uttarakhand EEWS and the ~550 km Central Himalayan gap.

**Placeholder:** sensor heartbeat/status, structural-health asset metrics, the
PGA attenuation model (calibrated for order of magnitude, not a hazard curve),
and the ground-motion waveform (synthetic, shaped like a real seismogram).
Swap `SENSOR_NODES` and `ASSETS` in `src/lib/data.ts` for a real feed.

## Licence

Demonstration build. All company claims are illustrative.