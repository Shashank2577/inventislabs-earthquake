/**
 * Chapter visuals for the story. The diagrams are server-rendered and the
 * animations use SMIL, so the narrative still moves without JavaScript.
 * The LED grid is the one exception — it is an argument you have to touch.
 */

"use client";

import { useMemo, useState } from "react";

import { DISTANCES, VP, VS, warningTime } from "@/lib/data";

const AMBER = "var(--pw)";
const CRIMSON = "var(--sw)";
const TEAL = "var(--accent)";
const RULE = "var(--line-strong)";

/* ------------------------------------------------------------------ */
/* Ch 02 — two wavefronts racing for one station                       */
/* ------------------------------------------------------------------ */

export function WavePair() {
  const EPICENTRE = { x: 60, y: 170 };
  const STATION = { x: 500, y: 170 };
  const R = 440;

  // P covers 440 units in 2.4 s; S covers the same in 2.4 × (Vp / Vs) = 4.11 s.
  const pDur = 2.4;
  const sDur = pDur * (VP / VS);
  const loop = sDur + 1.1;
  const begin = "0s";
  const repeat = `${loop}s`;

  return (
    <svg
      viewBox="0 0 600 300"
      className="h-auto w-full"
      role="img"
      aria-label="Two wavefronts expanding from an epicentre: the primary wave arrives at a station well before the secondary wave"
    >
      <defs>
        <clipPath id="wave-fronts">
          <rect x="0" y="0" width="600" height="244" />
        </clipPath>
      </defs>
      <g clipPath="url(#wave-fronts)">
      {/* Ground */}
      <line x1="20" y1="170" x2="580" y2="170" stroke={RULE} strokeWidth="1" />

      {/* P front */}
      <circle cx={EPICENTRE.x} cy={EPICENTRE.y} r="0" fill="none" stroke={AMBER} strokeWidth="2">
        <animate attributeName="r" from="4" to="600" dur={`${pDur}s`} begin={begin} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0.9;0" dur={`${pDur}s`} begin={begin} repeatCount="indefinite" />
      </circle>

      {/* S front */}
      <circle cx={EPICENTRE.x} cy={EPICENTRE.y} r="0" fill="none" stroke={CRIMSON} strokeWidth="3">
        <animate attributeName="r" from="4" to="600" dur={`${sDur}s`} begin={begin} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.95;0.95;0" dur={`${sDur}s`} begin={begin} repeatCount="indefinite" />
      </circle>

      {/* Epicentre */}
      <circle cx={EPICENTRE.x} cy={EPICENTRE.y} r="5" fill={CRIMSON} />
      <text x={EPICENTRE.x} y={EPICENTRE.y - 16} textAnchor="middle" fontSize="11" fill={CRIMSON} fontFamily="var(--font-mono)">
        rupture
      </text>

      {/* Station */}
      <g>
        <rect x={STATION.x - 20} y={STATION.y - 46} width="40" height="46" fill="var(--surface-2)" stroke={RULE} />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 0 0; 3 0; -3 0; 0 0"
          keyTimes="0;0.55;0.6;0.65;0.7"
          dur={`${loop}s`}
          repeatCount="indefinite"
        />
        <circle cx={STATION.x} cy={STATION.y} r="6" fill="none" stroke={TEAL} strokeWidth="2">
          <animate attributeName="r" values="6;26;6" dur="2.4s" begin={`${sDur - 0.02}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.9;0" dur="2.4s" begin={`${sDur - 0.02}s`} repeatCount="indefinite" />
        </circle>
        <text x={STATION.x} y={STATION.y - 60} textAnchor="middle" fontSize="11" fill={TEAL} fontFamily="var(--font-mono)">
          you
        </text>
      </g>

      </g>

      {/* Distance axis */}
      <line x1={EPICENTRE.x} y1="215" x2={STATION.x} y2="215" stroke={RULE} strokeWidth="1" strokeDasharray="3 4" />
      <text x={(EPICENTRE.x + STATION.x) / 2} y="234" textAnchor="middle" fontSize="10" fill="var(--ink-3)" fontFamily="var(--font-mono)">
        distance d
      </text>

      {/* Legend */}
      <g fontFamily="var(--font-mono)" fontSize="11">
        <circle cx="90" cy="268" r="4" fill={AMBER} />
        <text x="102" y="272" fill="var(--ink-2)">P wave — {VP.toFixed(1)} km/s</text>
        <circle cx="290" cy="268" r="4" fill={CRIMSON} />
        <text x="302" y="272" fill="var(--ink-2)">S wave — {VS.toFixed(1)} km/s</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Ch 05 — the warning-time curve                                      */
/* ------------------------------------------------------------------ */

const CW = 900;
const CH = 430;
const PAD = { l: 68, r: 34, t: 34, b: 56 };
const X_MAX = 1300;
/** warningTime(1300) = 208 s, so the axis has to clear that. */
const Y_MAX = 220;

const sx = (d: number) => PAD.l + (d / X_MAX) * (CW - PAD.l - PAD.r);
const sy = (s: number) => CH - PAD.b - (s / Y_MAX) * (CH - PAD.t - PAD.b);

/** Smooth sample of the same formula the copy quotes. */
function curve() {
  const pts: string[] = [];
  for (let d = 0; d <= X_MAX; d += 10) {
    pts.push(`${sx(d).toFixed(1)},${sy(warningTime(d)).toFixed(1)}`);
  }
  return pts.join(" ");
}

/**
 * Annotated distances. The labels themselves live in an HTML legend below the
 * plot — annotating inside the SVG collided with the curve at every width we
 * cared about.
 */
const CALLOUTS = [
  { d: 100, act: "drop, cover, hold" },
  { d: 250, act: "full shutdown ladder" },
  { d: 600, act: "evacuate with margin" },
];
const LABELLED_POINTS = new Set([100, 200, 400, 800, 1200]);

export function WarningTimeChart() {
  return (
    <figure className="m-0">
      {/* The plot carries 10-11 px type that becomes unreadable on a phone.
          Below sm it scrolls horizontally at a legible size instead. */}
      <div className="mx-auto w-full max-w-[920px] overflow-x-auto px-1 sm:overflow-visible">
      <svg
        viewBox={`0 0 ${CW} ${CH}`}
        className="h-auto w-full min-w-[620px] sm:min-w-0"
        role="img"
        aria-label="Warning time in seconds against epicentral distance in kilometres. Warning time grows linearly from zero at the epicentre to about 90 seconds at 1200 kilometres."
      >
        <defs>
          <linearGradient id="wt-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.28" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid + axes */}
        {[0, 50, 100, 150, 200].map((s) => (
          <g key={s}>
            <line x1={PAD.l} y1={sy(s)} x2={CW - PAD.r} y2={sy(s)} stroke={RULE} strokeWidth="1" opacity="0.5" />
            <text x={PAD.l - 12} y={sy(s) + 4} textAnchor="end" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)">
              {s}s
            </text>
          </g>
        ))}
        {[0, 200, 400, 600, 800, 1000, 1200].map((d) => (
          <text key={d} x={sx(d)} y={CH - PAD.b + 24} textAnchor="middle" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)">
            {d}
          </text>
        ))}
        <line x1={PAD.l} y1={CH - PAD.b} x2={CW - PAD.r} y2={CH - PAD.b} stroke={RULE} strokeWidth="1.5" />
        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={CH - PAD.b} stroke={RULE} strokeWidth="1.5" />

        <text x={PAD.l} y={16} fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)">
          WARNING SECONDS
        </text>
        <text x={CW - PAD.r} y={CH - 8} textAnchor="end" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)">
          EPICENTRAL DISTANCE · KM
        </text>

        {/* Curve */}
        <polygon
          points={`${sx(0)},${sy(0)} ${curve()} ${sx(X_MAX)},${sy(0)}`}
          fill="url(#wt-fill)"
        />
        <polyline points={curve()} fill="none" stroke={AMBER} strokeWidth="2.5" strokeLinejoin="round" />

        {/* Callout verticals, tagged at the axis only */}
        {CALLOUTS.map((c) => (
          <g key={c.d}>
            <line
              x1={sx(c.d)}
              y1={sy(warningTime(c.d))}
              x2={sx(c.d)}
              y2={CH - PAD.b}
              stroke={TEAL}
              strokeWidth="1"
              strokeDasharray="3 4"
              opacity="0.45"
            />
            <text
              x={sx(c.d)}
              y={CH - PAD.b + 40}
              textAnchor="middle"
              fontSize="10"
              fill={TEAL}
              fontFamily="var(--font-mono)"
            >
              ▲ {c.d} km
            </text>
          </g>
        ))}

        {/* Sample points */}
        {DISTANCES.map((d) => (
          <circle
            key={d}
            cx={sx(d)}
            cy={sy(warningTime(d))}
            r={3.5}
            fill="var(--bg)"
            stroke={AMBER}
            strokeWidth="2"
          />
        ))}

        {DISTANCES.filter((d) => LABELLED_POINTS.has(d)).map((d) => (
          <text
            key={d}
            x={sx(d)}
            y={sy(warningTime(d)) - 11}
            textAnchor="middle"
            fontSize="11"
            fill="var(--ink-2)"
            fontFamily="var(--font-mono)"
          >
            {warningTime(d).toFixed(0)}s
          </text>
        ))}
      </svg>
      </div>
      <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-2 border-t border-line pt-4">
        {CALLOUTS.map((c) => (
          <li key={c.d} className="flex items-baseline gap-2 font-mono text-[11px]">
            <span style={{ color: TEAL }}>▲ {c.d} km</span>
            <span className="text-ink-2">{c.act}</span>
            <span className="tnum text-ink-3">{warningTime(c.d).toFixed(0)} s</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 font-mono text-[11px] leading-relaxed text-ink-3">
        Warning time = d ÷ {VS.toFixed(1)} − d ÷ {VP.toFixed(1)} = d ÷{" "}
        {(VP - VS).toFixed(1)}. Straight line, because the physics is linear.
        There is no configuration of software that makes this curve steeper.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Ch 03 — the sensor node schematic                                    */
/* ------------------------------------------------------------------ */

export function NodeSchematic() {
  const blocks = [
    { x: 24, w: 92, label: "MEMS", sub: "tri-axial" },
    { x: 140, w: 92, label: "LP filter", sub: "1–10 Hz" },
    { x: 256, w: 92, label: "Classifier", sub: "edge AI" },
    { x: 372, w: 92, label: "Packetise", sub: "NTP sync" },
    { x: 488, w: 88, label: "Uplink", sub: "lease line" },
  ];
  return (
    <svg viewBox="0 0 600 150" className="h-auto w-full" role="img" aria-label="Signal chain inside a sensor node: MEMS accelerometer, low-pass filter, edge classifier, packetiser and uplink">
      {blocks.map((b, i) => (
        <g key={b.label}>
          <rect
            x={b.x}
            y="40"
            width={b.w}
            height="62"
            rx="4"
            fill="var(--surface-2)"
            stroke={RULE}
          />
          <text x={b.x + b.w / 2} y="68" textAnchor="middle" fontSize="12" fill="var(--ink)" fontFamily="var(--font-mono)">
            {b.label}
          </text>
          <text x={b.x + b.w / 2} y="86" textAnchor="middle" fontSize="10" fill="var(--ink-3)" fontFamily="var(--font-mono)">
            {b.sub}
          </text>
          {i < blocks.length - 1 && (
            <line
              x1={b.x + b.w}
              y1="71"
              x2={blocks[i + 1].x - 6}
              y2="71"
              stroke={TEAL}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="0.9s" repeatCount="indefinite" />
            </line>
          )}
        </g>
      ))}
      <text x="24" y="26" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)">
        ON SITE · NO ROUND TRIP BEFORE THE DECISION
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Ch 04 — magnitude ladder                                            */
/* ------------------------------------------------------------------ */

const MAGS = [4.0, 5.0, 6.0, 7.0, 8.0];

export function MagnitudeLadder() {
  return (
    <div className="space-y-2">
      {MAGS.map((m, i) => {
        const energy = Math.pow(10, 1.5 * (m - 4));
        return (
          <div key={m} className="flex items-center gap-4">
            <span className="tnum w-14 shrink-0 font-mono text-[12px] text-ink-2">M {m.toFixed(1)}</span>
            <div className="h-7 flex-1 overflow-hidden rounded-sm bg-surface">
              <div
                className="h-full rounded-sm"
                style={{
                  width: `${Math.min(100, (Math.log10(energy) / 6) * 100)}%`,
                  background: `linear-gradient(90deg, var(--pw), var(--sw))`,
                }}
              />
            </div>
            <span className="tnum w-24 shrink-0 text-right font-mono text-[11px] text-ink-3">
              {i === 0 ? "reference" : `× ${energy.toFixed(0)}`}
            </span>
          </div>
        );
      })}
      <p className="pt-2 font-mono text-[11px] leading-relaxed text-ink-3">
        One step on this scale is roughly 31× the energy of the step below it.
        This is why magnitude estimates from a handful of cheap sensors need
        edge models that reject the boring causes — a blast is a blast.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ch 09 — the LED moment                                              */
/* ------------------------------------------------------------------ */

/**
 * The grid is the argument, so it should be touchable. Lighting one lamp
 * changes nothing; lighting all of them is the only number that matters —
 * the panel prints the running total as you go.
 */
export function LedGrid() {
  const [lit, setLit] = useState(1);
  const CELLS = 288;
  const cells = useMemo(() => Array.from({ length: CELLS }, (_, i) => i), []);
  const all = lit >= CELLS;

  return (
    <div>
      <div
        className="grid grid-cols-12 gap-1.5 xs:grid-cols-16 sm:grid-cols-24 lg:grid-cols-32"
        onMouseLeave={() => setLit(1)}
      >
        {cells.map((i) => {
          const on = i < lit;
          return (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onMouseEnter={() => setLit(i + 1)}
              onFocus={() => setLit(i + 1)}
              onClick={() => setLit(i + 1)}
              className="aspect-square rounded-[2px] transition-colors duration-150"
              style={{
                background: on ? "var(--pw)" : "var(--surface-2)",
                boxShadow: on ? "0 0 10px -2px rgb(255 176 32 / 0.55)" : "none",
              }}
            />
          );
        })}
      </div>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-t border-line pt-5">
        <div className="flex items-baseline gap-3">
          <span
            className="tnum font-mono text-6xl font-medium leading-none tracking-[-0.03em]"
            style={{ color: all ? "var(--pw)" : "var(--ink)" }}
          >
            {lit}
          </span>
          <span className="label">/ {CELLS} lamps lit</span>
        </div>

        <p className="max-w-md text-[15px] leading-relaxed text-ink-2">
          {all
            ? "Every lamp. That is what a regional network is — not a better sensor, the same sensor everywhere at once."
            : lit === 1
              ? "One lamp is one site. Move across the grid."
              : `${lit} of ${CELLS}. Useful, but not yet a system.`}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={() => setLit(1)} className="inline-flex btn btn-ghost">
          Reset to one
        </button>
        <button onClick={() => setLit(CELLS)} className="inline-flex btn btn-primary">
          Light them all
        </button>
      </div>
    </div>
  );
}
