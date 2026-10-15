"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/story", long: "The Story", short: "Story" },
  { href: "/app", long: "Command Center", short: "Center" },
  { href: "/playground", long: "Playground", short: "Play" },
];

const MAIL = "hello@inventislabs.com";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-2 px-4 md:gap-5 md:px-8">
          <Link href="/" className="group -ml-1 flex min-h-9 shrink-0 items-center gap-2.5 pl-1">
            <SeismicGlyph />
            {/* Wordmark drops to the glyph alone on the narrowest screens —
                three nav links plus a theme switch will not fit otherwise. */}
            <span className="hidden text-[15px] font-medium tracking-[-0.01em] sm:inline">
              Inventis&nbsp;Labs
            </span>
            <span className="sr-only sm:hidden">Inventis Labs</span>
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3 md:gap-5">
            <nav aria-label="Primary" className="flex items-center">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className="relative -my-2 flex items-center rounded px-2 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.06em] transition-colors sm:px-3 sm:text-[11px] sm:tracking-[0.08em] md:px-3"
                    style={{ color: active ? "var(--ink)" : "var(--ink-3)" }}
                  >
                    <span className="sm:hidden">{n.short}</span>
                    <span className="hidden sm:inline">{n.long}</span>
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-2 bottom-0 h-px sm:inset-x-3"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <ThemeToggle />

            <a href={`mailto:${MAIL}`} className="btn btn-ghost hidden md:inline-flex">
              Contact
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

/* A two-state segmented control rather than the usual sun/moon switch — the
   label says what it does, and both states are legible at a glance. */
function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  const apply = (next: "light" | "dark") => {
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("il-theme", next);
    } catch {
      /* private mode — the theme just won't persist */
    }
  };

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="flex items-center rounded border border-line bg-surface p-0.5"
    >
      {(["light", "dark"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => apply(t)}
          aria-pressed={theme === t}
          className="min-h-9 rounded-[2px] px-2.5 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.06em] transition-colors sm:tracking-[0.08em]"
          style={{
            backgroundColor: theme === t ? "var(--accent)" : "transparent",
            color: theme === t ? "var(--on-accent)" : "var(--ink-3)",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/** A compact P-wave glyph: compression, then shear. */
export function SeismicGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M1 12h4l2-6 3 13 3-19 3 12 2-4h5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg-raised">
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <SeismicGlyph size={18} />
              <span className="text-sm font-medium">Inventis Labs</span>
            </div>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-2">
              Earthquake early warning and structural health monitoring, built in
              Roorkee for India&apos;s highest-risk seismic zones.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="label">Pages</p>
            <ul className="mt-4 space-y-2.5 text-[15px] text-ink-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
                  >
                    {n.long}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${MAIL}`}
                  className="underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-current"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="label">Where</p>
            <address className="mt-4 space-y-1.5 text-[15px] not-italic text-ink-2">
              <p>Roorkee, Uttarakhand</p>
              <p>CREATE @ IIIT Lucknow</p>
              <p className="text-ink-3">{MAIL}</p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[11px] text-ink-3 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} Inventis Labs</span>
          <span>Demonstration build · all figures computed, none invented</span>
        </div>
      </div>
    </footer>
  );
}