import type { Metadata } from "next";
import Link from "next/link";
import { SeismicGlyph, SiteFooter, SiteHeader } from "@/components/chrome";
import { Reveal } from "@/components/primitives";
import { WavePair } from "@/components/storyvisuals";
import { COMPANY, PRODUCTS, SENSOR_NODES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Earthquake early warning, built in India",
  description:
    "IoT and AI-powered seismic sensing, earthquake early warning and structural health monitoring. Developed with research guidance from IIT Roorkee.",
};

const LIVE = SENSOR_NODES.filter((n) => n.status === "live").length;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* ── Hero: deliberately off-balance. Type sits high-left, the
            instrument sits low-right, and they overlap rather than mirror. ── */}
        <section className="relative overflow-hidden border-b border-line">
          <div className="grid-wash pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-[1440px] px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
            <p className="eyebrow">
              {COMPANY.hq} · {COMPANY.incubatedAt}
            </p>

            <div className="mt-10 grid items-end gap-x-12 gap-y-14 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h1 className="display">
                  The earth moves
                  <br />
                  in two waves.
                  <br />
                  <em>Only one kills.</em>
                </h1>

                <div className="mt-9 max-w-lg border-l-2 border-accent pl-6">
                  <p className="text-[17px] leading-relaxed text-ink-2 md:text-lg">
                    The primary wave arrives first and is nearly harmless. The
                    secondary wave arrives slower and does all the damage. The
                    gap between them is the only warning that will ever exist —
                    so we build the sensors that measure it and the systems that
                    spend it.
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link href="/story" className="inline-flex btn btn-primary">
                    Read the story
                  </Link>
                  <Link href="/app" className="inline-flex btn btn-ghost">
                    Open Command Center
                  </Link>
                </div>
              </div>

              <div className="lg:pb-4 lg:pl-4">
                <div className="surface overflow-hidden">
                  <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                    <span className="label">Wavefront geometry</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3">
                      schematic · not to scale
                    </span>
                  </div>
                  <WavePair />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Numbers as a ledger, not cards ─────────────────── */}
        <section className="border-b border-line">
          <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 md:py-20">
            <dl className="grid gap-y-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
              {[
                { v: "6.0", u: "km/s", k: "Primary wave", d: "Compression. Fast, and almost harmless on its own." },
                { v: "3.5", u: "km/s", k: "Secondary wave", d: "Shear. Slower, and the reason buildings come down." },
                { v: "2.5", u: "km/s", k: "The gap", d: "Divide any distance by this and you have your warning time." },
                { v: String(LIVE), u: "nodes", k: "Streaming now", d: "Across the northern belt, most on a leased line." },
              ].map((s, i) => (
                <Reveal key={s.k} delay={i * 80} className="border-t border-line pt-5">
                  <dt className="flex items-baseline gap-2">
                    <span
                      className="tnum text-5xl font-medium tracking-[-0.03em]"
                      style={{
                        color:
                          i === 0 ? "var(--pw)" : i === 1 ? "var(--sw)" : "var(--ink)",
                      }}
                    >
                      {s.v}
                    </span>
                    <span className="label">{s.u}</span>
                  </dt>
                  <dd className="mt-3">
                    <p className="text-[15px] font-medium">{s.k}</p>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink-3">{s.d}</p>
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* ── The arithmetic ─────────────────────────────────── */}
        <section className="border-b border-line bg-bg-raised">
          <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <Reveal>
                <p className="eyebrow">The arithmetic</p>
                <h2 className="chapter mt-6">
                  Warning time is
                  <br />
                  not a design
                  <br />
                  <em>decision.</em>
                </h2>
                <p className="mt-7 max-w-md text-[16px] leading-relaxed text-ink-2">
                  It is distance divided by the difference between two wave
                  speeds. Every early warning system on Earth obeys the same
                  line. What differs is how much of it you can reach — and how
                  much you managed to automate before it closed.
                </p>
              </Reveal>

              <Reveal delay={120}>
                <div className="surface raise overflow-hidden">
                  <div className="grid grid-cols-[auto_auto_1fr] gap-x-6 border-b border-line px-5 py-2.5">
                    <span className="label">Distance</span>
                    <span className="label">Warning</span>
                    <span className="label">What it buys</span>
                  </div>
                  {[
                    ["25 km", "3.0 s", "Drop, cover, hold"],
                    ["100 km", "14.3 s", "Stop the machine"],
                    ["200 km", "28.6 s", "Full shutdown ladder"],
                    ["400 km", "57.1 s", "Evacuate with margin"],
                    ["800 km", "114.3 s", "Regional network scale"],
                  ].map(([d, t, act]) => (
                    <div
                      key={d}
                      className="grid grid-cols-[auto_auto_1fr] items-baseline gap-x-6 border-b border-line px-5 py-4 transition-colors last:border-0 hover:bg-surface-2"
                    >
                      <span className="tnum font-mono text-[14px] text-ink-2">{d}</span>
                      <span className="tnum font-mono text-[14px] font-medium text-pwave">
                        {t}
                      </span>
                      <span className="text-[15px] text-ink">{act}</span>
                    </div>
                  ))}
                  <p className="px-5 py-4 font-mono text-[11px] leading-relaxed text-ink-3">
                    Computed at Vp 6.0 km/s, Vs 3.5 km/s. Chapter 05 plots the
                    whole curve.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Products as a numbered ledger. A three-card row is the
            most recognisable AI layout there is; this reads as a spec sheet. ── */}
        <section className="border-b border-line">
          <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="eyebrow">What we build</p>
                  <h2 className="chapter mt-6">Three systems, one clock.</h2>
                </div>
                <p className="max-w-sm text-[15px] leading-relaxed text-ink-2">
                  Detection is the easy half. Everything that matters happens in
                  the seconds after the estimate.
                </p>
              </div>
            </Reveal>

            <ul className="mt-14 border-t border-line">
              {PRODUCTS.map((p, i) => (
                <Reveal as="li" key={p.code} delay={i * 90} className="border-b border-line">
                  <div className="group grid gap-x-8 gap-y-3 py-8 transition-colors md:grid-cols-[auto_1fr_auto] md:items-baseline">
                    <span className="tnum font-mono text-[13px] text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <h3 className="text-xl font-medium tracking-[-0.01em] md:text-2xl">
                          {p.name}
                        </h3>
                        <span className="rounded-[2px] bg-surface-2 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink-2">
                          {p.code}
                        </span>
                      </div>
                      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
                        {p.blurb}
                      </p>
                    </div>

                    <span
                      className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3 transition-colors md:text-right group-hover:text-ink"
                    >
                      {i === 0 && "Regional · site"}
                      {i === 1 && "Detect → actuate"}
                      {i === 2 && "Always on"}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Milestones ────────────────────────────────────── */}
        <section className="border-b border-line bg-bg-raised">
          <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-8 md:py-28">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
              <Reveal>
                <p className="eyebrow">Milestones</p>
                <h2 className="chapter mt-6">
                  Built in Roorkee,
                  <br />
                  <em>not copied from it.</em>
                </h2>
                <p className="mt-7 max-w-md text-[16px] leading-relaxed text-ink-2">
                  Eighteen months of R&amp;D with research guidance from the
                  Department of Earthquake Engineering at IIT Roorkee, incubated
                  at CREATE @ IIIT Lucknow. Selected for the NVIDIA Inception
                  Program and Startupbootcamp India&apos;s Sprint2Frontier
                  cohort.
                </p>
                <p className="mt-8 font-mono text-[11px] leading-relaxed text-ink-3">
                  {COMPANY.research}
                </p>
              </Reveal>

              <dl className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
                {[
                  { v: 170, k: "state sensors already live", s: "Uttarakhand EEWS" },
                  { v: 550, k: "km of unfractured Central Himalaya", s: "the next gap to close" },
                  { v: SENSOR_NODES.length, k: "nodes in this regional layer", s: "pilot deployment" },
                  { v: 1, k: "indigenous EEWS, piloting in Uttar Pradesh", s: "EQ-Alert · MARS" },
                ].map((s, i) => (
                  <Reveal key={s.k} delay={i * 80} className="border-t border-line pt-5">
                    <dt className="tnum text-5xl font-medium tracking-[-0.03em] md:text-6xl">
                      {s.v}
                    </dt>
                    <dd className="mt-3">
                      <p className="max-w-[22ch] text-[15px] leading-snug text-ink-2">{s.k}</p>
                      <p className="label mt-2">{s.s}</p>
                    </dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ── Closing ────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="grid-wash pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-[1440px] px-5 py-24 md:px-8 md:py-32">
            <Reveal>
              <p className="eyebrow">Get in touch</p>
              <h2 className="display mt-7 max-w-5xl">
                Run the countdown
                <br />
                on <em>your own plant.</em>
              </h2>
              <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-ink-2">
                If you operate anything you would rather not drop — a refinery
                stack, a hospital block, a dam, a control room — we can show you
                exactly how many seconds you have, and what your systems could
                do with them.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/playground" className="inline-flex btn btn-primary">
                  Try the Playground
                </Link>
                <Link href="/app" className="inline-flex btn btn-ghost">
                  Command Center
                </Link>
                <a href={`mailto:${COMPANY.hq ? "hello@inventislabs.com" : ""}`} className="inline-flex btn btn-ghost">
                  hello@inventislabs.com
                </a>
              </div>
            </Reveal>

            <div className="mt-20 flex items-center gap-4 border-t border-line pt-8">
              <SeismicGlyph />
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
                Roorkee · Uttarakhand — sensor networks, edge inference and
                hardwired shutdowns
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}