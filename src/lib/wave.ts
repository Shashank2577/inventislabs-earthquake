/** Seismic wave maths. Pure functions — no React, no DOM. */

import { VP, VS } from "@/lib/data";

/** Great-circle distance in km. */
export function haversineKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export type TracePoint = { t: number; v: number };

/**
 * Synthetic ground-motion amplitude at a station, `t` seconds after origin.
 *
 * Before P there is only instrument noise. Between P and S the trace shows the
 * small, high-frequency compression wave. After S it shows the large, slow
 * shear energy that actually does the damage. Magnitude scales the envelope.
 */
export function amplitudeAt(
  t: number,
  pAt: number,
  sAt: number,
  magnitude: number,
  seed = 0,
): number {
  // Instrument noise floor. Big enough to read on screen, small enough that
  // nobody mistakes it for signal.
  const noise = 0.035;
  if (t < pAt) return (hash(seed + Math.floor(t * 37)) - 0.5) * noise * 2;

  const magScale = Math.pow(10, 0.32 * (magnitude - 5));

  if (t < sAt) {
    // Primary wave: small, fast oscillation.
    const age = t - pAt;
    const env = Math.exp(-age * 2.2);
    const osc = Math.sin(age * 46 + seed) * 0.5 + Math.sin(age * 83 + seed * 2) * 0.3;
    return osc * env * 0.14 * magScale;
  }

  // Secondary wave: large, growing, long-period shear energy.
  const age = t - sAt;
  const env = Math.min(1, age * 6) * Math.exp(-Math.max(0, age - 2.2) * 0.55);
  const osc =
    Math.sin(age * 11.5 + seed) * 0.62 +
    Math.sin(age * 19.2 + seed * 3) * 0.26 +
    Math.sin(age * 5.4 + seed * 5) * 0.34;
  return osc * env * 0.95 * magScale;
}

/** Deterministic pseudo-noise so the idle trace is stable across renders. */
function hash(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Crude peak-ground-acceleration estimate in g, calibrated against the usual
 * ordering of magnitude: ~0.13 g for an M5.2 at 25 km down to ~0.01 g for an
 * M7.2 at 520 km. Good enough for a readout, not a hazard curve.
 */
export function peakPga(magnitude: number, distanceKm: number) {
  if (distanceKm < 1) return 0;
  const magScale = Math.pow(10, 0.4 * (magnitude - 5));
  const falloff = 1 / (1 + Math.pow(distanceKm / 50, 1.8));
  return Math.min(1.2, magScale * falloff * 0.14);
}

export { VP, VS };