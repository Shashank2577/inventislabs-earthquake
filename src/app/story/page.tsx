import type { Metadata } from "next";
import { SiteHeader, SeismicGlyph } from "@/components/chrome";
import { Reveal } from "@/components/primitives";
import {
  LedGrid,
  MagnitudeLadder,
  NodeSchematic,
  WarningTimeChart,
  WavePair,
} from "@/components/storyvisuals";
import { ClosingCta, PageReceipt, StoryProgress } from "@/components/story";
import { NetworkMap } from "@/components/NetworkMap";
import {
  COMPANY,
  INDIA_FACTS,
  RESPONSE_LADDER,
  STORY_CHAPTERS,
  VP,
  VS,
} from "@/lib/data";

const AMBER = "var(--pw)";
const CRIMSON = "var(--sw)";
const TEAL = "var(--accent)";
const RULE = "var(--line-strong)";

export const metadata: Metadata = {
  title: "From the fault to the floor",
  description:
    "An earthquake gives you seconds. This is where they come from, what they cost, and why a network beats a sensor.",
};

export default function StoryPage() {
  return (
    <>
      <SiteHeader />
      <StoryProgress />

      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section
          id="ch-00"
          data-chapter="00"
          className="relative overflow-hidden border-b border-line"
        >
          <div className="grid-veil pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-[1100px] px-5 pb-20 pt-20 md:px-8 md:pb-28 md:pt-28">
            <p className="label flex items-center gap-2.5">
              <SeismicGlyph size={14} />
              {COMPANY.name} presents
            </p>
            <h1 className="display mt-8">
              From the fault
              <br />
              to the floor.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2 md:text-xl">
              An earthquake does not announce itself. It releases a burst of
              energy that travels through rock in two waves at two speeds, and
              the seconds between their arrivals are the only warning that will
              ever exist. This is where those seconds come from.
            </p>
            <p className="label mt-8">
              {VP.toFixed(1)} km/s &nbsp;·&nbsp; {VS.toFixed(1)} km/s &nbsp;·&nbsp; 9
              chapters &nbsp;·&nbsp; ~8 min
            </p>
          </div>

          <div className="relative mx-auto max-w-[1100px] px-5 pb-16 md:px-8">
            <div className="mx-auto w-full max-w-[680px]">
              <WavePair />
            </div>
          </div>
        </section>

        {/* ── 01 · The rupture ─────────────────────────────── */}
        <Chapter {...STORY_CHAPTERS[0]} id="ch-01" layout="split">
          <Reveal>
            <div className="instrument overflow-hidden p-7 md:p-10">
              <RuptureDiagram />
            </div>
          </Reveal>
        </Chapter>

        {/* ── 02 · Two waves ───────────────────────────────── */}
        <Chapter {...STORY_CHAPTERS[1]} id="ch-02" layout="stack">
          <Reveal>
            <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-rule sm:grid-cols-2">
              {[
                { tag: "P — primary", c: "var(--pw)", v: `${VP.toFixed(1)} km/s`, d: "Longitudinal. Compresses and rarefies the rock ahead of it. Fast, and almost harmless on its own." },
                { tag: "S — secondary", c: "var(--sw)", v: `${VS.toFixed(1)} km/s`, d: "Transverse. Shears the rock side to side. Slower, and the reason buildings fall down." },
              ].map((w) => (
                <div key={w.tag} className="bg-surface p-6">
                  <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: w.c }}>
                    {w.tag}
                  </p>
                  <p className="tnum mt-3 text-4xl font-extrabold tracking-tight">{w.v}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{w.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Chapter>

        {/* ── 03 · The sensor ──────────────────────────────── */}
        <Chapter {...STORY_CHAPTERS[2]} id="ch-03" layout="split">
          <Reveal>
            <div className="instrument p-6 md:p-8">
              <NodeSchematic />
            </div>
          </Reveal>
        </Chapter>

        {/* ── 04 · The estimate ────────────────────────────── */}
        <Chapter {...STORY_CHAPTERS[3]} id="ch-04" layout="aside">
          <Reveal>
            <div className="instrument p-6 md:p-8">
              <MagnitudeLadder />
            </div>
          </Reveal>
        </Chapter>

        {/* ── 05 · The gap ─────────────────────────────────── */}
        <Chapter {...STORY_CHAPTERS[4]} id="ch-05" layout="bleed">
          <Reveal>
            <div className="instrument p-6 md:p-9">
              <WarningTimeChart />
            </div>
          </Reveal>
        </Chapter>

        {/* ── 06 · The siren ───────────────────────────────── */}
        <Chapter {...STORY_CHAPTERS[5]} id="ch-06" layout="split">
          <Reveal>
            <div className="instrument p-6 md:p-8">
              <Channels />
            </div>
          </Reveal>
        </Chapter>

        {/* ── 07 · The action ──────────────────────────────── */}
        <Chapter {...STORY_CHAPTERS[6]} id="ch-07" layout="bleed">
          <Reveal>
            <div className="instrument overflow-hidden">
              <ol className="divide-y divide-line">
                {RESPONSE_LADDER.map((s) => (
                  <li key={s.t} className="flex flex-wrap items-center gap-x-5 gap-y-1 px-5 py-3.5 md:px-7">
                    <span className="tnum w-[72px] shrink-0 font-mono text-[12px] text-ink-3">
                      {s.t}
                    </span>
                    <span className="w-[150px] shrink-0 text-[14px] font-medium">{s.actor}</span>
                    <span className="min-w-0 flex-1 text-[14px] text-ink-2">{s.act}</span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-ink-3">
                      {s.channel}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </Chapter>

        {/* ── 08 · The network ─────────────────────────────── */}
        <Chapter {...STORY_CHAPTERS[7]} id="ch-08" layout="split">
          <Reveal>
            <div className="grid gap-4">
              <div className="instrument overflow-hidden bg-bg">
                <NetworkMap className="mx-auto h-auto w-full max-w-[640px]" />
              </div>
              <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-rule sm:grid-cols-2">
                {INDIA_FACTS.map((f) => (
                  <div key={f.label} className="bg-surface p-6">
                    <dt className="flex items-baseline gap-2">
                      {/* Static, not counted up. These are facts, not flourishes —
                          a count-up that lands mid-flight prints a wrong number. */}
                      <span className="tnum text-4xl font-extrabold tracking-tight text-pwave">
                        {f.value}
                      </span>
                      <span className="label">{f.unit}</span>
                    </dt>
                    <dd className="mt-2.5 text-[14px] leading-relaxed text-ink-2">{f.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Chapter>

        {/* ── 09 · The LED moment ──────────────────────────── */}
        <Chapter {...STORY_CHAPTERS[8]} id="ch-09" layout="stack">
          <Reveal>
            <div className="instrument mx-auto w-full max-w-[900px] p-6 md:p-9">
              <LedGrid />
            </div>
          </Reveal>
        </Chapter>

        {/* ── Receipt ──────────────────────────────────────── */}
        <section className="border-t border-line bg-bg-raised">
          <div className="mx-auto max-w-[1100px] px-5 py-20 md:px-8">
            <p className="label">This page — the receipt</p>
            <h2 className="chapter mt-5 max-w-3xl">
              What it is actually made of.
            </h2>
            <div className="mt-10">
              <PageReceipt />
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-[1100px] px-5 pb-24 md:px-8">
          <ClosingCta />
        </section>
      </main>
    </>
  );
}

/* ------------------------------------------------------------------ */

type Layout = "split" | "bleed" | "stack" | "aside";

/**
 * Four chapter layouts on rotation. The previous version used one shape nine
 * times, which is what made the whole thing read as generated.
 */
function Chapter({
  index,
  kicker,
  title,
  body,
  id,
  layout = "split",
  children,
}: {
  index: string;
  kicker: string;
  title: string;
  body: string;
  id: string;
  layout?: Layout;
  children: React.ReactNode;
}) {
  const shell =
    layout === "bleed"
      ? "max-w-[1440px] xl:pr-20"
      : layout === "aside"
        ? "max-w-[1180px]"
        : "max-w-[1320px]";

  return (
    <section
      id={id}
      data-chapter={index}
      className="scroll-mt-24 border-b border-line py-20 md:py-28"
    >
      <div className={`mx-auto px-5 md:px-8 ${shell}`}>
        {layout === "bleed" ? (
          /* Full-bleed: the visual owns the width, the text sits above it. */
          <>
            <Reveal>
              <div className="max-w-3xl">
                <p className="eyebrow">
                  {index} · {kicker}
                </p>
                <h2 className="chapter mt-6">{title}</h2>
                <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-2">
                  {body}
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>{children}</Reveal>
          </>
        ) : layout === "stack" ? (
          /* Stack: text centred in a narrow measure, visual below, edge to edge. */
          <div className="text-center">
            <Reveal>
              <div className="mx-auto max-w-2xl">
                <p className="eyebrow justify-center">
                  {index} · {kicker}
                </p>
                <h2 className="chapter mt-6">{title}</h2>
                <p className="mt-6 text-[17px] leading-relaxed text-ink-2">{body}</p>
              </div>
            </Reveal>
            <Reveal delay={120}>{children}</Reveal>
          </div>
        ) : (
          /* split / aside: sticky editorial column beside the instrument. */
          <div
            className={`grid gap-10 md:gap-16 ${
              layout === "aside"
                ? "md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]"
                : "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
            }`}
          >
            <Reveal>
              <div className="md:sticky md:top-28">
                <p className="eyebrow">
                  {index} · {kicker}
                </p>
                <h2 className="chapter mt-6">{title}</h2>
                <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-2">
                  {body}
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>{children}</Reveal>
          </div>
        )}
      </div>
    </section>
  );
}

/** Ch 01 — a fault plane under compression, then slipping. */
function RuptureDiagram() {
  return (
    <svg viewBox="0 0 620 320" className="h-auto w-full" role="img" aria-label="A fault plane under stored elastic strain; the lower block slips, releasing the strain as seismic waves">
      <defs>
        <pattern id="hatch" width="9" height="9" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="9" stroke="var(--line-strong)" strokeWidth="1.4" />
        </pattern>
      </defs>

      {/* Overburden */}
      <rect x="20" y="20" width="580" height="118" fill="url(#hatch)" opacity="0.3" />
      <text x="32" y="44" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)">
        OVERBURDEN
      </text>

      {/* Fault plane */}
      <line x1="20" y1="140" x2="600" y2="140" stroke={RULE} strokeWidth="1.5" />
      <text x="32" y="160" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)">
        FAULT PLANE
      </text>

      {/* Hanging wall — compresses, then slips */}
      <g>
        <rect x="20" y="142" width="580" height="112" fill="var(--surface-2)" stroke={RULE} />

        {/* Stored strain: two arrows driving toward each other */}
        <g stroke={AMBER} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M74 206 H146 M146 206 l-12 -8 M146 206 l-12 8" />
          <path d="M546 206 H474 M474 206 l12 -8 M474 206 l12 8" />
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;0 0;-9 0;9 0;0 0"
            keyTimes="0;0.3;0.45;0.6;1"
            dur="4.6s"
            repeatCount="indefinite"
          />
        </g>

        {/* Slip */}
        <g>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;0 0;-18 0;0 0;-18 0"
            keyTimes="0;0.34;0.48;0.62;1"
            dur="4.6s"
            repeatCount="indefinite"
          />
          <text
            x="310"
            y="238"
            textAnchor="middle"
            fontSize="12"
            fill={CRIMSON}
            fontFamily="var(--font-mono)"
          >
            slip — the earthquake
          </text>
        </g>
      </g>

      <text x="310" y="184" textAnchor="middle" fontSize="11" fill={AMBER} fontFamily="var(--font-mono)">
        stored elastic strain
      </text>

      {/* Radiated energy */}
      <g stroke={TEAL} strokeWidth="1.6" fill="none" opacity="0.9">
        <circle cx="310" cy="140" r="30">
          <animate attributeName="r" values="40;330" dur="3.4s" begin="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0" dur="3.4s" begin="1.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="310" cy="140" r="30">
          <animate attributeName="r" values="30;240" dur="3.4s" begin="1.9s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0" dur="3.4s" begin="1.9s" repeatCount="indefinite" />
        </circle>
      </g>

      <text x="310" y="300" textAnchor="middle" fontSize="11" fill="var(--ink-3)" fontFamily="var(--font-mono)">
        radiated as seismic waves
      </text>
    </svg>
  );
}

/** Ch 06 — dissemination channels, ranked by whether they survive the shaking. */
function Channels() {
  const rows = [
    { c: "Hardwired interlock", to: "Gas valves, elevators, plant PLCs", good: true },
    { c: "Outdoor siren array", to: "Campus and city perimeter", good: true },
    { c: "Mobile app push", to: "Anyone who has the app installed", good: false },
    { c: "Control room console", to: "Operators who can still read it", good: false },
  ];
  return (
    <ul className="space-y-3">
      {rows.map((r, i) => (
        <li
          key={r.c}
          className="flex items-start gap-4 rounded border border-line bg-surface-2 p-4"
        >
          <span className="tnum mt-0.5 w-5 shrink-0 font-mono text-[11px] text-ink-3">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-medium">{r.c}</p>
            <p className="mt-1 text-[13px] text-ink-3">{r.to}</p>
          </div>
          <span
            className="shrink-0 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
            style={{
              color: r.good ? "var(--accent)" : "var(--pw)",
              background: r.good
                ? "rgba(0,229,192,0.08)"
                : "rgba(255,176,32,0.08)",
            }}
          >
            {r.good ? "survives" : "fragile"}
          </span>
        </li>
      ))}
      <li className="pt-1 font-mono text-[11px] leading-relaxed text-ink-3">
        Channels are ranked by what still works when the building is moving.
        Only the hardwired layer survives that.
      </li>
    </ul>
  );
}