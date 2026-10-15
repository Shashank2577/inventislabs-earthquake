"use client";

import { useEffect, useRef } from "react";
import { amplitudeAt } from "@/lib/wave";

type SeismogramProps = {
  /** Seconds since origin. */
  elapsed: number;
  /** Seconds until P arrives at this station. Negative means "already passed". */
  pAt: number;
  /** Seconds until S arrives at this station. */
  sAt: number;
  magnitude: number;
  stationLabel: string;
  /** Station depth in metres, shown in the frame header. */
  stationDepth?: string;
  className?: string;
};

const WINDOW = 26; // seconds of trace held on screen
const SAMPLE_DT = 1 / 120; // event-time seconds between samples
const MAX_BUFFER = Math.ceil(WINDOW / SAMPLE_DT);
const W = 900;
const H = 260;

/**
 * Rolling three-component seismogram. The trace is derived from the same
 * amplitude function the rest of the app uses, so what you see is what the
 * numbers claim.
 */
export function Seismogram({
  elapsed,
  pAt,
  sAt,
  magnitude,
  stationLabel,
  stationDepth = "0 m",
  className,
}: SeismogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferRef = useRef<Trace[]>([]);
  const lastE = useRef(0);
  const stateRef = useRef({ elapsed, pAt, sAt, magnitude });
  stateRef.current = { elapsed, pAt, sAt, magnitude };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    let raf = 0;
    let buffer = bufferRef.current;

    /* Canvas cannot read CSS variables, so the theme colours are resolved to
       concrete values and re-read whenever the theme attribute flips. */
    const css = getComputedStyle(document.documentElement);
    let palette = {
      grid: css.getPropertyValue("--grid").trim() || "#333",
      rule: css.getPropertyValue("--line").trim() || "#333",
      ink: css.getPropertyValue("--ink-3").trim() || "#888",
      trace: css.getPropertyValue("--accent").trim() || "#0f0",
      pw: css.getPropertyValue("--pw").trim() || "#fa0",
      sw: css.getPropertyValue("--sw").trim() || "#f55",
    };
    const readPalette = () => {
      const c = getComputedStyle(document.documentElement);
      palette = {
        grid: c.getPropertyValue("--grid").trim(),
        rule: c.getPropertyValue("--line").trim(),
        ink: c.getPropertyValue("--ink-3").trim(),
        trace: c.getPropertyValue("--accent").trim(),
        pw: c.getPropertyValue("--pw").trim(),
        sw: c.getPropertyValue("--sw").trim(),
      };
    };
    const themeObserver = new MutationObserver(readPalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Seed the window with quiet background so the trace reads as a live
    // instrument the moment the panel paints, not 20 s after load.
    if (buffer.length === 0) {
      for (let e = -WINDOW; e <= 0; e += SAMPLE_DT) {
        buffer.push({ e, v: amplitudeAt(e, 999, 999, 0, 1.7) });
      }
      lastE.current = 0;
    }

    /**
     * Samples in EVENT time, not wall time. React hands us `elapsed` only
     * every 50 ms, so sampling at frame rate off that value would draw a
     * staircase instead of a waveform. Stepping between the last known event
     * time and the current one at a fixed 120 Hz keeps the trace dense and
     * identical at 1x and 8x playback.
     */
    const advance = () => {
      const s = stateRef.current;
      const target = s.elapsed;
      if (target <= lastE.current) return;

      let steps = 0;
      let e = lastE.current + SAMPLE_DT;
      while (e <= target && steps < 600) {
        buffer.push({ e, v: amplitudeAt(e, s.pAt, s.sAt, s.magnitude, 1.7) });
        e += SAMPLE_DT;
        steps++;
      }
      if (buffer.length > MAX_BUFFER) buffer = buffer.slice(-MAX_BUFFER);
      lastE.current = target;
    };

    const draw = () => {
      const { elapsed: e, pAt: p, sAt: s } = stateRef.current;
      ctx.clearRect(0, 0, W, H);

      const mid = H / 2;
      const scale = H / 2 - 14;

      // Grid.
      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < 10; i++) {
        const x = (i / 10) * W;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (let i = 1; i < 4; i++) {
        const y = (i / 4) * H;
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();

      // Baseline.
      ctx.strokeStyle = palette.rule;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(W, mid);
      ctx.stroke();

      // P / S arrival markers.
      const xFor = (eAt: number) =>
        ((eAt - (e - WINDOW)) / WINDOW) * W;

      const marker = (eAt: number, color: string, tag: string) => {
        if (eAt < e - WINDOW || eAt > e) return;
        const x = xFor(eAt);
        ctx.strokeStyle = color;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = color;
        ctx.font = "600 11px ui-monospace, monospace";
        ctx.fillText(tag, x + 6, 16);
      };
      marker(p, palette.pw, "P");
      marker(s, palette.sw, "S");

      // Trace.
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = palette.trace;
      ctx.beginPath();
      let started = false;
      for (let i = 0; i < buffer.length; i++) {
        const pt = buffer[i];
        const x = ((pt.e - (e - WINDOW)) / WINDOW) * W;
        if (x < -2) continue;
        // Clamp rather than let a strong event draw outside the frame — a
        // trace that runs off the panel reads as a broken canvas.
        const y = Math.max(4, Math.min(H - 4, mid - pt.v * scale));
        if (!started) {
          ctx.moveTo(x, y);
          started = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Right-edge head marker.
      ctx.fillStyle = palette.trace;
      ctx.beginPath();
      ctx.arc(W - 3, mid, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = "10px ui-monospace, monospace";
      ctx.fillStyle = palette.ink;
      ctx.fillText(`${(e - WINDOW).toFixed(0)}s`, 6, H - 8);
      ctx.textAlign = "right";
      ctx.fillText(`${e.toFixed(1)}s`, W - 6, H - 8);
      ctx.textAlign = "left";
    };

    const loop = () => {
      advance();
      draw();
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
    };
  }, []);

  const sPassed = elapsed >= sAt;
  const pPassed = elapsed >= pAt;

  return (
    <div className={className}>
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="label">{stationLabel}</span>
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest">
          <span className="text-ink-3">
            z <span className="text-ink-2">{stationDepth}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full"
              style={{
                background: pPassed ? "var(--pw)" : "var(--line-strong)",
              }}
            />
            <span style={{ color: pPassed ? "var(--pw)" : "var(--ink-3)" }}>
              P
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full"
              style={{
                background: sPassed ? "var(--sw)" : "var(--line-strong)",
              }}
            />
            <span style={{ color: sPassed ? "var(--sw)" : "var(--ink-3)" }}>
              S
            </span>
          </span>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
    </div>
  );
}

type Trace = { e: number; v: number };