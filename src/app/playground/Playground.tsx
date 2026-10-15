"use client";

import { useMemo, useState } from "react";
import { NetworkMap } from "@/components/NetworkMap";
import { Seismogram } from "@/components/Seismogram";
import { CITIES, VP, VS, ZONE_NOTE, type City } from "@/lib/data";
import { useQuakeSim } from "@/lib/sim";

/* A Uttarakhand foothill source, and a city close enough to it that the
   default run finishes inside half a minute at 1x. */
const DEFAULT_SOURCE = { lat: 30.15, lon: 78.35 };

export default function Playground() {
  const [source, setSource] = useState(DEFAULT_SOURCE);
  const [cityName, setCityName] = useState<string>("Dehradun");
  const [magnitude, setMagnitude] = useState(6.5);
  const [depthKm, setDepthKm] = useState(12);

  const city = CITIES.find((c) => c.name === cityName)!;

  const sim = useQuakeSim(
    { lat: source.lat, lon: source.lon, magnitude, depthKm },
    { name: city.name, lat: city.lat, lon: city.lon },
    { tailSeconds: 8 },
  );

  const cities = useMemo(
    () =>
      CITIES.map((c) => ({
        name: c.name,
        lat: c.lat,
        lon: c.lon,
        active: c.name === cityName,
        station: c.name === cityName,
      })),
    [cityName],
  );

  const zoneOf = city as City;

  return (
    <div className="mx-auto max-w-[1700px] px-4 py-8 md:px-6 md:py-12">
      <header className="max-w-3xl">
        <p className="eyebrow">Playground</p>
        <h1 className="chapter mt-6">
          Put an epicentre
          <br />
          anywhere on the map.
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-ink-2">
          Click the map to move the source. Pick a city, set a magnitude, and
          run the clock. Everything on screen is computed from the same wave
          speeds — 6.0 km/s for P, 3.5 for S — so the warning you get is the
          warning you would get.
        </p>
      </header>

      <div className="mt-10 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* ── Map ─────────────────────────────────────────────── */}
        <section className="instrument min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <h2 className="label">Click to place the epicentre</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
              {source.lat.toFixed(2)}°N {source.lon.toFixed(2)}°E
            </span>
          </div>

          <div className="relative bg-bg p-3">
            <NetworkMap
              className="h-auto max-h-[min(72vh,860px)] w-full"
              nodes={[]}
              interactive
              onPick={setSource}
              picked={source}
              cities={cities}
              onCity={(n) => setCityName(n)}
              origin={
                sim.live
                  ? { lat: source.lat, lon: source.lon, pKm: sim.elapsed * VP, sKm: sim.elapsed * VS }
                  : { lat: source.lat, lon: source.lon, pKm: 0, sKm: 0 }
              }
            />
            {sim.warned && (
              <div className="pointer-events-none absolute left-3 top-3 rounded border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] backdrop-blur" style={{ borderColor: "rgba(255,97,114,.45)", background: "var(--bg)", color: "var(--sw)" }}>
                P wavefront {sim.elapsed * VP > 0 ? `${Math.round(sim.elapsed * VP)} km` : ""}
              </div>
            )}
          </div>

          <p className="border-t border-line px-4 py-3 font-mono text-[10px] leading-relaxed text-ink-3">
            Squarcles are cities — click one to make it your station. The
            crosshair is the epicentre. Red square = the city you are standing
            in.
          </p>
        </section>

        {/* ── Controls ────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-4">
          <section className="instrument overflow-hidden">
            <div className="border-b border-line px-4 py-2.5">
              <h2 className="label">Your city</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 p-4">
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setCityName(c.name)}
                  className="rounded border px-2.5 py-1.5 font-mono text-[11px] transition-colors"
                  style={{
                    borderColor: c.name === cityName ? "var(--accent)" : "var(--line)",
                    backgroundColor: c.name === cityName ? "var(--accent)" : "transparent",
                    color: c.name === cityName ? "var(--on-accent)" : "var(--ink-2)",
                  }}
                >
                  {c.name}
                  <span style={{ opacity: 0.6 }}> {c.zone}</span>
                </button>
              ))}
            </div>
            <p className="border-t border-line px-4 py-3 text-[13px] text-ink-2">
              <span className="font-mono text-[11px] text-ink-3">
                ZONE {zoneOf.zone} —
              </span>{" "}
              {ZONE_NOTE[zoneOf.zone]}
            </p>
          </section>

          <section className="instrument overflow-hidden">
            <div className="border-b border-line px-4 py-2.5">
              <h2 className="label">Event</h2>
            </div>

            <div className="space-y-6 p-5">
              <Lever
                label="Magnitude"
                current={magnitude}
                display={magnitude.toFixed(1)}
                min={4}
                max={8}
                step={0.1}
                onChange={setMagnitude}
                hint={magnitudeHint(magnitude)}
              />
              <Lever
                label="Focal depth"
                current={depthKm}
                display={`${depthKm} km`}
                min={5}
                max={80}
                step={1}
                onChange={setDepthKm}
                hint="Shallow ruptures radiate sharper; deep ones lose energy before they reach the surface."
              />
            </div>
          </section>

          {/* ── Verdict ───────────────────────────────────────── */}
          <section
            className="instrument overflow-hidden transition-colors"
            style={{ borderColor: sim.warned ? "rgba(255,97,114,.5)" : undefined }}
          >
            <div className="border-b border-line px-4 py-2.5">
              <h2 className="label">What you would get</h2>
            </div>

            <div className="p-5">
              <p className="label">{sim.phase === "idle" ? "Warning time" : "Time to S-wave"}</p>
              <p
                className="tnum mt-1 text-6xl font-medium leading-none tracking-[-0.03em]"
                style={{
                  color: sim.phase === "idle" ? "var(--ink)" : sim.warned ? "var(--sw)" : "var(--ink-3)",
                }}
              >
                {sim.phase === "idle" ? sim.warning.toFixed(1) : sim.countdown > 0 ? sim.countdown.toFixed(1) : "0.0"}
                <span className="ml-1 text-2xl font-normal text-ink-3">s</span>
              </p>

              <p className="mt-4 text-[14px] leading-relaxed text-ink-2">
                {verdict(sim.warning, zoneOf.zone)}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5">
                <Metric k="Distance" v={`${sim.distanceKm.toFixed(0)} km`} />
                <Metric k="Predicted PGA" v={`${sim.pga.toFixed(3)} g`} hot={sim.pga > 0.25} />
                <Metric k="P arrives" v={`+${sim.pAt.toFixed(1)} s`} tone="pw" />
                <Metric k="S arrives" v={`+${sim.sAt.toFixed(1)} s`} tone="sw" />
              </dl>
            </div>
          </section>
        </div>
      </div>

      {/* ── Transport + trace ─────────────────────────────────── */}
      <section className="instrument mt-4 overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-line px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {sim.phase === "running" ? (
              <button onClick={sim.pause} className="inline-flex btn btn-ghost">Pause</button>
            ) : (
              <button onClick={sim.run} className="inline-flex btn btn-primary">Run</button>
            )}
            <button
              onClick={() => sim.runFrom(Math.max(0, sim.sAt - 4))}
              className="inline-flex btn btn-ghost"
            >
              Skip to impact
            </button>
            <button onClick={sim.reset} className="inline-flex btn btn-ghost">Reset</button>
          </div>

          <div className="min-w-[240px] flex-1">
            <Timeline sim={sim} />
          </div>

          <div className="flex items-center gap-4">
            {sim.warning > 60 && sim.phase !== "running" && (
              <span className="font-mono text-[11px] text-ink-3">
                {formatDuration(sim.sAt)} at 1× — use skip to impact
              </span>
            )}
            <span className="tnum font-mono text-[12px] text-ink-2">
              T+{sim.elapsed.toFixed(1)} s
            </span>
          </div>
        </div>

        <div className="grid gap-px bg-line lg:grid-cols-2">
          <div className="bg-surface">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <h3 className="label">{city.name} · vertical trace</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                {sim.distanceKm.toFixed(0)} km away
              </span>
            </div>
            <Seismogram
              elapsed={sim.elapsed}
              pAt={sim.live ? sim.pAt : 999}
              sAt={sim.live ? sim.sAt : 999}
              magnitude={magnitude}
              stationLabel={city.name}
              stationDepth={`${depthKm} km`}
            />
          </div>

          <div className="bg-surface">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <h3 className="label">Response ladder</h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                {sim.ladder.filter((l) => l.done).length} / {sim.ladder.length}
              </span>
            </div>
            <ol className="divide-y divide-line">
              {sim.ladder.map((step) => (
                <li
                  key={step.t}
                  className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                  style={{
                    backgroundColor: step.done
                      ? step.missed ? "rgba(168,106,8,0.07)" : "rgba(28,91,98,0.06)"
                      : "transparent",
                  }}
                >
                  <span className="tnum w-[58px] shrink-0 font-mono text-[11px] text-ink-3">
                    +{step.at.toFixed(1)}
                  </span>
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      background: step.done
                        ? step.missed ? "var(--pw)" : "var(--accent)"
                        : "var(--line-strong)",
                    }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{step.act}</span>
                  {step.missed && (
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em]" style={{ color: "var(--pw)" }}>
                      too late
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Timeline({ sim }: { sim: ReturnType<typeof useQuakeSim> }) {
  const pct = (t: number) => (t / sim.endAt) * 100;
  return (
    <div className="relative h-6">
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-surface-2" />
      {/* P and S markers sit on the track itself, so the relationship
          between the arrivals is visible before you press run. */}
      <span
        className="absolute top-1/2 h-3 w-px -translate-y-1/2"
        style={{ left: `${pct(sim.pAt)}%`, background: "var(--pw)" }}
      />
      <span
        className="absolute top-1/2 h-3 w-px -translate-y-1/2"
        style={{ left: `${pct(sim.sAt)}%`, background: "var(--sw)" }}
      />
      <input
        type="range"
        className="scrub absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2"
        min={0}
        max={sim.endAt}
        step={0.1}
        value={Math.min(sim.elapsed, sim.endAt)}
        onChange={(e) => sim.seek(Number(e.target.value))}
        aria-label="Event time in seconds"
      />
    </div>
  );
}

function Lever({
  label,
  current,
  display,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  label: string;
  current: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="label">{label}</label>
        <span className="tnum font-mono text-[15px]">{display}</span>
      </div>
      <input
        type="range"
        className="lever mt-3"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      <p className="mt-2.5 text-[12px] leading-relaxed text-ink-3">{hint}</p>
    </div>
  );
}

function Metric({ k, v, hot, tone }: { k: string; v: string; hot?: boolean; tone?: "pw" | "sw" }) {
  const c = hot ? "var(--sw)" : tone === "pw" ? "var(--pw)" : tone === "sw" ? "var(--sw)" : "var(--ink)";
  return (
    <div>
      <dt className="label">{k}</dt>
      <dd className="tnum mt-1 font-mono text-[13px]" style={{ color: c }}>{v}</dd>
    </div>
  );
}

function formatDuration(seconds: number) {
  if (seconds < 90) return `${Math.round(seconds)} s`;
  return `${Math.floor(seconds / 60)} min ${Math.round(seconds % 60)} s`;
}

function magnitudeHint(m: number) {
  if (m < 5) return "Rarely felt without instruments. Nothing to warn about.";
  if (m < 6) return "Felt widely. Onsite protection only at most distances.";
  if (m < 7) return "Damaging over a large area. This is the band that justifies a network.";
  if (m < 8) return "Great earthquake. Warning stops being useful beyond a few hundred km.";
  return "Near-maximum. Only the sites closest to the rupture get a real budget.";
}

/** Turns a number into advice, so the playground answers a question
    rather than just printing arithmetic. */
function verdict(warning: number, zone: City["zone"]) {
  if (warning < 4) return `Nothing. At ${warning.toFixed(1)} seconds the only thing that finishes is falling over.`;
  if (warning < 10)
    return `Enough to drop, cover and hold — and not enough to stop anything. In zone ${zone}, this is onsite protection only.`;
  if (warning < 25)
    return `Enough to stop a machine, close a gas valve and get people under cover. This is where an automated ladder starts paying for itself.`;
  if (warning < 60)
    return `A real budget. Evacuation, isolation and shutdown all fit inside it, with margin for the district.`;
  return `Long enough that process control, not human reaction, is the limiting factor.`;
}