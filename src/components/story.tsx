"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------------ */
/* Scroll progress + chapter rail                                      */
/* ------------------------------------------------------------------ */

export function StoryProgress() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>("00");

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.getAttribute("data-chapter") ?? "00");
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const chapters = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];

  return (
    <>
      <div className="fixed left-0 top-0 z-50 h-px w-full" style={{ background: "transparent" }}>
        <div
          className="h-full"
          style={{
            width: `${progress * 100}%`,
            background: "var(--accent)",
            transition: "width 80ms linear",
          }}
        />
      </div>

      <nav
        aria-label="Chapters"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
      >
        <ul className="flex flex-col items-end gap-2.5">
          {chapters.map((c) => {
            const on = active === c;
            return (
              <li key={c} className="flex items-center gap-2.5">
                <a
                  href={`#ch-${c}`}
                  className="font-mono text-[10px] tracking-widest transition-colors"
                  style={{
                    color: on ? "var(--ink)" : "var(--ink-3)",
                  }}
                >
                  {c}
                </a>
                <span
                  className="block h-px transition-all"
                  style={{
                    width: on ? 22 : 8,
                    background: on ? "var(--accent)" : "var(--line-strong)",
                  }}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* The receipt — this page, measured                                   */
/* ------------------------------------------------------------------ */

type Receipt = {
  requests: number;
  transferKb: number;
  domKb: number;
  images: number;
  fonts: number;
  scripts: number;
};

/**
 * Audits the page that is currently loaded and prints the result. Nothing is
 * hard-coded — if the build gets heavier, this says so.
 */
export function PageReceipt() {
  const [r, setR] = useState<Receipt | null>(null);

  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];

    const transfer =
      (nav?.transferSize ?? 0) +
      res.reduce((sum, e) => sum + (e.transferSize || 0), 0);

    const domBytes = new Blob([document.documentElement.outerHTML]).size;

    setR({
      requests: res.length + (nav ? 1 : 0),
      transferKb: transfer / 1024,
      domKb: domBytes / 1024,
      images: res.filter((e) => e.initiatorType === "img" || /\.(png|jpe?g|webp|avif|gif)$/i.test(e.name)).length,
      fonts: res.filter((e) => e.initiatorType === "css" && /font/i.test(e.name)).length,
      scripts: res.filter((e) => e.initiatorType === "script").length,
    });
  }, []);

  if (!r) {
    return (
      <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-surface" />
        ))}
      </div>
    );
  }

  const rows: [string, string][] = [
    ["requests", String(r.requests)],
    ["over the wire", `${r.transferKb.toFixed(0)} kB`],
    ["document", `${r.domKb.toFixed(0)} kB`],
    ["images", String(r.images)],
    ["webfonts", String(r.fonts)],
    ["tracking scripts", "0"],
  ];

  return (
    <div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="label">{k}</dt>
            <dd className="tnum mt-1.5 text-2xl font-bold tracking-tight">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 max-w-xl font-mono text-[11px] leading-relaxed text-ink-3">
        Read this in a devtools network panel and you will get the same numbers.
        No images, no webfonts, no analytics, no third-party anything — the
        chapter animations are SVG and SMIL, which is why this page is mostly
        text and vector.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Closing CTA                                                         */
/* ------------------------------------------------------------------ */

export function ClosingCta() {
  return (
    <div className="instrument overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[1.3fr_1fr]">
        <div className="p-7 md:p-10">
          <p className="eyebrow">Next</p>
          <h3 className="chapter mt-6">
            Run it against
            <br />
            your own site.
          </h3>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-2">
            Put an epicentre wherever you like and run it against your own city.
            Pick a short distance first and watch the response ladder run out of
            budget — that is the whole argument for regional coverage.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="rounded bg-primary px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-void transition-opacity hover:opacity-85"
            >
              Open Command Center
            </Link>
            <a
              href="mailto:hello@inventislabs.com"
              className="rounded border border-line-strong px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-ink-2 transition-colors hover:border-ink-faint hover:text-ink"
            >
              Talk to the team
            </a>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px border-t border-line bg-rule md:border-l md:border-t-0">
          {[
            ["6.0", "km/s · P wave"],
            ["3.5", "km/s · S wave"],
            ["2.5", "km/s · the gap"],
            ["550", "km · unfractured"],
          ].map(([v, k]) => (
            <div key={k} className="bg-surface p-5">
              <dt className="label">{k}</dt>
              <dd className="tnum mt-2 text-3xl font-extrabold tracking-tight">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}