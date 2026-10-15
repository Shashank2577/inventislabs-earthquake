"use client";

import { useCallback, useMemo, useState } from "react";
import { MapLegend, NetworkMap } from "@/components/NetworkMap";
import { Seismogram } from "@/components/Seismogram";
import { Reveal } from "@/components/primitives";
import { ASSETS, SENSOR_NODES, VP, VS } from "@/lib/data";
import { haversineKm } from "@/lib/wave";
import { useImpactShake, useQuakeSim } from "@/lib/sim";

const HQ = { lat: 29.85, lon: 77.89, name: "Roorkee Core" };

/**
 * Scenarios are defined by distance, not by a coordinate — the epicentre is
 * back-projected from HQ along a north-westerly bearing so the warning time on
 * screen is the warning time you actually get.
 */
const SCENARIOS = [
  { id: "onsite", label: "Onsite", distanceKm: 25, magnitude: 5.2, depthKm: 8,
    blurb: "Under your feet. Enough time to drop, cover and hold — nothing else." },
  { id: "city", label: "City", distanceKm: 120, magnitude: 6.4, depthKm: 12,
    blurb: "The first distance where humans and machines can both respond." },
  { id: "regional", label: "Regional", distanceKm: 260, magnitude: 6.8, depthKm: 15,
    blurb: "Full automatic response ladder engages across the district." },
  { id: "farfield", label: "Far field", distanceKm: 520, magnitude: 7.2, depthKm: 18,
    blurb: "Regional network scale. Long budget, wide coverage." },
] as const;

function backProject(distanceKm: number) {
  const bearing = (320 * Math.PI) / 180;
  const dLat = (distanceKm / 111) * Math.cos(bearing);
  const dLon = (distanceKm / (111 * Math.cos((HQ.lat * Math.PI) / 180))) * Math.sin(bearing);
  return { lat: HQ.lat + dLat, lon: HQ.lon + dLon };
}

type LogEntry = { t: number; mag: number; dist: number; verdict: string };

export default function CommandCenter() {
  const [scenarioId, setScenarioId] = useState<string>("city");
  const [selected, setSelected] = useState<string | null>("RK-01");
  const [log, setLog] = useState<LogEntry[]>([]);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const origin = useMemo(() => backProject(scenario.distanceKm), [scenario]);

  const sim = useQuakeSim(
    { lat: origin.lat, lon: origin.lon, magnitude: scenario.magnitude, depthKm: scenario.depthKm },
    HQ,
  );

  useImpactShake(sim);

  const trigger = useCallback(() => {
    sim.run();
    setLog((l) => [
      { t: Math.max(0, sim.pAt - 2), mag: scenario.magnitude, dist: scenario.distanceKm, verdict: "run started" },
      ...l,
    ]);
  }, [sim, scenario]);

  const struckNodes = useMemo(
    () =>
      SENSOR_NODES.map((n) => {
        const d = haversineKm(origin, n);
        return { node: n, d, sAtNode: d / VS, pAtNode: d / VP };
      })
        .filter((x) => x.sAtNode <= sim.sAt + 0.5)
        .sort((a, b) => a.sAtNode - b.sAtNode)
        .slice(0, 6),
    [origin, sim.sAt],
  );

  return (
    <div className="min-h-screen">
      {/* Warning tint. Restrained on purpose — a screen you cannot read is a
          screen nobody acts on. */}
      {sim.warned && (
        <div
          className="pointer-events-none fixed inset-0 z-40 transition-opacity"
          style={{
            boxShadow: sim.impacted
              ? "inset 0 0 170px 6px rgba(255,77,94,0.20)"
              : "inset 0 0 140px 0px rgba(255,176,32,0.07)",
            animation: sim.impacted ? "blink 0.4s steps(2) infinite" : undefined,
          }}
        />
      )}

      {/* ── Control bar ─────────────────────────────────────── */}
      <div className="sticky top-16 z-30 border-b border-line bg-bg-raised/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center gap-x-7 gap-y-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <StatusLamp sim={sim} />
            <div>
              <p className="label leading-none">Network state</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em]">
                {sim.phase === "idle" && "Nominal · network armed"}
                {sim.phase === "running" && sim.warned && "Event in progress"}
                {sim.phase === "running" && sim.impacted && "Strong motion"}
                {sim.phase === "paused" && "Paused"}
                {sim.phase === "settled" && "Event logged · reviewing"}
              </p>
            </div>
          </div>

          <div className="hidden h-8 w-px bg-line lg:block" />

          <ScenarioPicker value={scenarioId} onChange={setScenarioId} disabled={sim.phase === "running"} />

          <div className="hidden items-center gap-5 xl:flex">
            <Fact k="source" v={`${scenario.distanceKm} km NW`} />
            <Fact k="P arrives" v={`+${sim.pAt.toFixed(1)} s`} tone="amber" />
            <Fact k="S arrives" v={`+${sim.sAt.toFixed(1)} s`} tone="red" />
            <Fact k="warning" v={`${sim.warning.toFixed(1)} s`} tone="green" />
          </div>

          <div className="ml-auto">
            {sim.phase === "idle" ? (
              <button onClick={trigger} className="inline-flex btn" style={{ background: "var(--sw)", color: "#fff" }}>
                Trigger event
              </button>
            ) : (
              <button onClick={sim.reset} className="inline-flex btn btn-ghost">
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Readouts ────────────────────────────────────────── */}
      <div
        className="border-b border-line transition-colors"
        style={{ backgroundColor: sim.warned ? "rgba(255,77,94,0.05)" : "transparent" }}
      >
        <div className="mx-auto flex max-w-[1700px] flex-wrap items-center gap-x-10 gap-y-4 px-4 py-5 md:px-6">
          <div className="min-w-[200px]">
            <p className="label">{sim.phase === "idle" ? "Warning budget" : "Time to S-wave"}</p>
            <p
              className="tnum mt-1 text-5xl font-medium leading-none tracking-[-0.03em]"
              style={{
                color: sim.phase === "idle" ? "var(--ink)" : sim.warned ? "var(--sw)" : "var(--ink-3)",
              }}
            >
              {sim.phase === "idle" ? sim.warning.toFixed(1) : sim.countdown > 0 ? sim.countdown.toFixed(1) : "0.0"}
              <span className="ml-1 text-xl font-normal text-ink-3">s</span>
            </p>
          </div>

          <Readout label="Event time" value={`${sim.elapsed >= 0 ? "+" : ""}${sim.elapsed.toFixed(1)} s`} tone={sim.warned ? "hot" : undefined} />
          <Readout label="Magnitude" value={`M ${scenario.magnitude.toFixed(1)}`} />
          <Readout label="Epicentral distance" value={`${scenario.distanceKm} km`} />
          <Readout label="Depth" value={`${scenario.depthKm} km`} />
          <Readout label="Predicted PGA" value={`${sim.pga.toFixed(3)} g`} tone={sim.pga > 0.25 ? "hot" : undefined} />
          <Readout label="Nodes reporting" value={`${struckNodes.length} / ${SENSOR_NODES.length}`} />

          <p className="ml-auto hidden max-w-[300px] text-[13px] leading-relaxed text-ink-2 lg:block">
            {sim.phase === "idle"
              ? scenario.blurb
              : sim.warned
                ? "Drop, cover, hold — or let the plant trip."
                : "Strong motion. Every automatic action already ran."}
          </p>
        </div>
      </div>

      {/* ── Main grid ───────────────────────────────────────── */}
      <div className="mx-auto grid max-w-[1700px] gap-4 p-4 md:p-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <section className="instrument flex min-w-0 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <h2 className="label">Network · India</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
              {SENSOR_NODES.length} nodes · {SENSOR_NODES.filter((n) => n.status === "live").length} streaming
            </span>
          </div>
          <div className="relative grid min-w-0 flex-1 place-items-center bg-bg p-3">
            <NetworkMap
              className="h-auto max-h-[min(70vh,820px)] w-full"
              selectedId={selected}
              onSelect={(n) => setSelected(n.id)}
              origin={
                sim.live
                  ? { lat: origin.lat, lon: origin.lon, pKm: sim.elapsed * VP, sKm: sim.elapsed * VS }
                  : null
              }
            />
            {sim.warned && (
              <div className="pointer-events-none absolute left-3 top-3 rounded border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] backdrop-blur" style={{ borderColor: "rgba(255,97,114,.45)", background: "var(--bg)", color: "var(--sw)" }}>
                Live wavefronts
              </div>
            )}
          </div>
          <div className="flex items-start justify-between gap-4 border-t border-line px-4 py-3">
            <MapLegend />
            <p className="max-w-[320px] text-right font-mono text-[10px] leading-relaxed text-ink-3">
              Amber line — unfractured Central Himalayan segment. Boundary shown
              as claimed by India; zone geometry is indicative.
            </p>
          </div>
        </section>

        <div className="flex min-w-0 flex-col gap-4">
          <section className="instrument min-w-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <h2 className="label">Station trace · vertical component</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                {scenario.distanceKm} km from origin
              </span>
            </div>
            <Seismogram
              elapsed={sim.elapsed}
              pAt={sim.live ? sim.pAt : 999}
              sAt={sim.live ? sim.sAt : 999}
              magnitude={scenario.magnitude}
              stationLabel={HQ.name}
              stationDepth="0 m"
            />
          </section>

          <section className="instrument min-w-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <h2 className="label">Response ladder</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                {sim.ladder.filter((l) => l.done).length} / {sim.ladder.length} executed
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
                  <span className="tnum w-[62px] shrink-0 font-mono text-[11px] text-ink-3">
                    +{step.at.toFixed(1)}
                  </span>
                  <span
                    className="size-2 shrink-0 rounded-full transition-colors"
                    style={{
                      background: step.done
                        ? step.missed ? "var(--pw)" : "var(--accent)"
                        : "var(--line-strong)",
                    }}
                  />
                  <span className="w-[128px] shrink-0 text-[13px] font-medium">{step.actor}</span>
                  <span className="min-w-0 flex-1 truncate text-[13px] text-ink-2">{step.act}</span>
                  <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 sm:block">
                    {step.missed ? "no budget" : step.channel}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* ── Tables ──────────────────────────────────────────── */}
      <div className="mx-auto grid max-w-[1700px] gap-4 px-4 pb-10 md:px-6 xl:grid-cols-2">
        <section className="instrument min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <h2 className="label">Arrival sequence</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
              first six to feel S
            </span>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-line font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                <th className="px-4 py-2 font-normal">Station</th>
                <th className="px-4 py-2 font-normal">Distance</th>
                <th className="px-4 py-2 font-normal">P at</th>
                <th className="px-4 py-2 font-normal">S at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {struckNodes.map(({ node, d, pAtNode, sAtNode }) => (
                <tr
                  key={node.id}
                  onClick={() => setSelected(node.id)}
                  className="cursor-pointer transition-colors hover:bg-surface-2"
                  style={{ backgroundColor: selected === node.id ? "var(--surface-2)" : undefined }}
                >
                  <td className="px-4 py-2">
                    <span className="font-mono text-[11px] text-ink-3">{node.id}</span>{" "}
                    {node.name}
                  </td>
                  <td className="tnum px-4 py-2 text-ink-2">{d.toFixed(0)} km</td>
                  <td className="tnum px-4 py-2" style={{ color: sim.elapsed >= pAtNode ? "var(--pw)" : "var(--ink-2)" }}>
                    +{pAtNode.toFixed(1)} s
                  </td>
                  <td className="tnum px-4 py-2" style={{ color: sim.elapsed >= sAtNode ? "var(--sw)" : "var(--ink-2)" }}>
                    +{sAtNode.toFixed(1)} s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </section>

        <section className="instrument min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <h2 className="label">Structural health</h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">Always on</span>
          </div>
          <ul className="divide-y divide-line">
            {ASSETS.map((a) => (
              <li key={a.name} className="flex items-center gap-4 px-4 py-3">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{
                    background:
                      a.status === "alert" ? "var(--sw)" : a.status === "watch" ? "var(--pw)" : "var(--accent)",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{a.name}</p>
                  <p className="truncate text-[12px] text-ink-3">{a.detail}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="tnum font-mono text-[13px]">{a.value}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">{a.metric}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <EventLog log={log} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StatusLamp({ sim }: { sim: ReturnType<typeof useQuakeSim> }) {
  const color = sim.phase === "idle" ? "var(--accent)" : sim.impacted ? "var(--sw)" : "var(--pw)";
  const blinking = sim.phase !== "idle" && sim.phase !== "settled";
  return (
    <span className="relative flex size-3 items-center justify-center">
      <span className="absolute inset-0 rounded-full" style={{ background: color, opacity: 0.2 }} />
      <span className="size-2 rounded-full" style={{ background: color, animation: blinking ? "blink 0.6s steps(2) infinite" : undefined }} />
    </span>
  );
}

function ScenarioPicker({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  return (
    <div>
      <p className="label leading-none">Scenario</p>
      <div className="mt-1.5 flex rounded border border-line bg-bg p-0.5">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            disabled={disabled}
            onClick={() => onChange(s.id)}
            className="min-h-9 rounded px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors disabled:opacity-40 sm:tracking-[0.08em]"
            style={{
              backgroundColor: value === s.id ? "var(--accent)" : "transparent",
              color: value === s.id ? "var(--on-accent)" : "var(--ink-3)",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Fact({ k, v, tone }: { k: string; v: string; tone?: "amber" | "red" | "green" }) {
  const c = tone === "amber" ? "var(--pw)" : tone === "red" ? "var(--sw)" : tone === "green" ? "var(--accent)" : "var(--ink)";
  return (
    <div>
      <p className="label leading-none">{k}</p>
      <p className="tnum mt-1 font-mono text-[12px]" style={{ color: c }}>{v}</p>
    </div>
  );
}

function Readout({ label, value, tone }: { label: string; value: string; tone?: "hot" }) {
  return (
    <div>
      <p className="label leading-none">{label}</p>
      <p className="tnum mt-1.5 font-mono text-sm" style={{ color: tone === "hot" ? "var(--sw)" : "var(--ink)" }}>
        {value}
      </p>
    </div>
  );
}

function EventLog({ log }: { log: LogEntry[] }) {
  const network = SENSOR_NODES.length;
  const live = SENSOR_NODES.filter((n) => n.status === "live").length;
  return (
    <section className="border-t border-line bg-bg-raised">
      <div className="mx-auto grid max-w-[1700px] gap-8 px-4 py-12 md:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow">Network summary</p>
          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            <Stat value={network} label="nodes deployed" />
            <Stat value={live} label="streaming now" />
            <Stat value={network - live} label="degraded or down" />
            <Stat value={Math.round((live / network) * 100)} suffix="%" label="availability" />
          </div>
        </div>
        <div>
          <p className="eyebrow">Event log · this session</p>
          <div className="mt-5 rounded border border-line bg-bg">
            {log.length === 0 ? (
              <p className="px-4 py-6 text-[13px] leading-relaxed text-ink-3">
                No events yet. Trigger one from the top bar — start with
                Onsite to watch the response ladder run out of budget.
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {log.map((e, i) => (
                  <li key={`${e.t}-${i}`} className="flex items-center gap-4 px-4 py-2.5 font-mono text-[12px]">
                    <span className="tnum text-ink-3">T+{e.t.toFixed(1)}s</span>
                    <span>M {e.mag.toFixed(1)}</span>
                    <span className="text-ink-2">{e.dist} km</span>
                    <span className="ml-auto uppercase tracking-[0.08em] text-accent">{e.verdict}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  return (
    <Reveal className="border-t border-line pt-4">
      <p className="tnum text-4xl font-medium tracking-[-0.03em]">{value}{suffix}</p>
      <p className="label mt-2">{label}</p>
    </Reveal>
  );
}