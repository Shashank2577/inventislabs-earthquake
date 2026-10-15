"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RESPONSE_LADDER, VP, VS } from "@/lib/data";
import { haversineKm, peakPga } from "@/lib/wave";

export type Phase = "idle" | "running" | "paused" | "settled";

export type QuakeSource = {
  lat: number;
  lon: number;
  magnitude: number;
  depthKm: number;
};

export type Station = {
  name: string;
  lat: number;
  lon: number;
};

/**
 * The whole earthquake clock in one place.
 *
 * Both the Command Center and the Playground drive this, so the physics,
 * the response ladder and the trace buffer cannot drift apart between them.
 * Playback runs at 1:1 — the warning time is the point, and speeding it up
 * makes the number on screen a lie.
 */
export function useQuakeSim(
  source: QuakeSource,
  station: Station,
  options: { tailSeconds?: number; rate?: number; onComplete?: () => void } = {},
) {
  const { tailSeconds = 9 } = options;
  /* Playback speed. 1 is the honest rate; anything else is a deliberate
     choice to watch in slow motion, never to make a number look better. */
  const rate = options.rate ?? 1;

  const distanceKm = useMemo(
    () => haversineKm(source, station),
    [source, station],
  );
  const pAt = distanceKm / VP;
  const sAt = distanceKm / VS;
  const warning = sAt - pAt;
  const pga = peakPga(source.magnitude, distanceKm);

  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);

  const elapsedRef = useRef(0);
  /* Event time at the moment the clock started. The loop derives from this
     rather than adding a frame delta to a running total — accumulating
     (now - start) once per frame compounds quadratically and the event races
     to its end in a fraction of a second. */
  const baseRef = useRef(0);
  const startRef = useRef(0);
  const endAt = sAt + tailSeconds;

  // A change of source, station or magnitude invalidates the current run.
  const signature = `${source.lat.toFixed(3)},${source.lon.toFixed(3)},${source.magnitude},${station.lat.toFixed(3)},${station.lon.toFixed(3)}`;
  const sigRef = useRef(signature);
  useEffect(() => {
    if (sigRef.current === signature) return;
    sigRef.current = signature;
    baseRef.current = 0;
    elapsedRef.current = 0;
    setElapsed(0);
    setPhase("idle");
  }, [signature]);

  useEffect(() => {
    if (phase !== "running") return;
    let raf = 0;
    let lastPush = 0;

    const loop = () => {
      const e =
        baseRef.current + ((performance.now() - startRef.current) / 1000) * rate;
      elapsedRef.current = e;
      const now = performance.now();
      // React state moves at 20 Hz; the trace canvas reads refs at frame rate.
      if (now - lastPush > 50) {
        lastPush = now;
        setElapsed(e);
      }
      if (e > endAt) {
        setElapsed(endAt);
        setPhase("settled");
        options.onComplete?.();
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase, endAt, rate]);

  const run = useCallback(() => {
    const from = Math.max(0, pAt - 2);
    baseRef.current = from;
    elapsedRef.current = from;
    startRef.current = performance.now();
    setElapsed(from);
    setPhase("running");
  }, [pAt]);

  /**
   * Start the clock from an arbitrary moment. Used for "skip to impact" —
   * it moves where you start watching, not how fast the event happens, so the
   * numbers on screen stay the real ones.
   */
  const runFrom = useCallback(
    (t: number) => {
      const start = Math.max(0, t);
      baseRef.current = start;
      elapsedRef.current = start;
      startRef.current = performance.now();
      setElapsed(start);
      setPhase("running");
    },
    [],
  );

  const pause = useCallback(() => {
    setElapsed(elapsedRef.current);
    setPhase("paused");
  }, []);

  const reset = useCallback(() => {
    baseRef.current = 0;
    elapsedRef.current = 0;
    setElapsed(0);
    setPhase("idle");
  }, []);

  /** Direct time travel — lets you jump straight to the interesting second. */
  const seek = useCallback((t: number) => {
    const clamped = Math.max(0, Math.min(t, endAt));
    baseRef.current = clamped;
    elapsedRef.current = clamped;
    setElapsed(clamped);
    setPhase("paused");
  }, [endAt]);

  const countdown = sAt - elapsed;
  const warned = elapsed > 0 && elapsed < sAt;
  const impacted = elapsed >= sAt;
  const live = phase === "running" || phase === "paused" || phase === "settled";

  const ladder = useMemo(
    () =>
      RESPONSE_LADDER.map((step) => {
        const at =
          step.t === "T+S"
            ? sAt
            : Math.max(pAt, pAt + Number(step.t.match(/([\d.]+)/)![1]));
        return { ...step, at, done: elapsed >= at, missed: at > sAt };
      }),
    [elapsed, pAt, sAt],
  );

  return {
    phase,
    elapsed,
    live,
    warned,
    impacted,
    countdown,
    rate,
    distanceKm,
    pAt,
    sAt,
    warning,
    pga,
    ladder,
    endAt,
    run,
    runFrom,
    pause,
    reset,
    seek,
  };
}

export type QuakeSim = ReturnType<typeof useQuakeSim>;