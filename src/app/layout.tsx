import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* A high-contrast editorial serif for display, a technical sans for reading,
   a true mono for every number on the page.
   Self-hosted rather than fetched from Google at build time — `next/font/google`
   makes the whole deploy depend on a third party being up, and it took a CI
   run down with "Cannot read properties of null (reading '1')" in next/font.
   Latin subset only; the site is English-only. 91 kB total. */
const display = localFont({
  src: [
    { path: "./fonts/InstrumentSerif-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/InstrumentSerif-400i.woff2", weight: "400", style: "italic" },
  ],
  variable: "--f-display",
  display: "swap",
  fallback: ["ui-serif", "Georgia", "serif"],
});

const sans = localFont({
  src: [{ path: "./fonts/IBMPlexSans-var.woff2", weight: "100 700", style: "normal" }],
  variable: "--f-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const mono = localFont({
  src: [
    { path: "./fonts/IBMPlexMono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexMono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--f-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const metadata: Metadata = {
  // `||` not `??` — an empty-string env var still reaches `new URL` and throws
  // "Invalid URL" during static export, which is what CI hits when a repo
  // variable has not been created yet.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://inventislabs.github.io/inventislabs-web",
  ),
  title: {
    default: "Inventis Labs — earthquake early warning, built in Roorkee",
    template: "%s · Inventis Labs",
  },
  description:
    "IoT and AI seismic sensing, earthquake early warning and structural health monitoring. Developed with research guidance from IIT Roorkee.",
  openGraph: {
    title: "Inventis Labs",
    description:
      "Earthquake early warning and structural health monitoring, built in Roorkee for high-risk seismic zones.",
    type: "website",
    images: ["/og.svg"],
    url: "/",
  },
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eceae3" },
    { media: "(prefers-color-scheme: dark)", color: "#131210" },
  ],
  colorScheme: "light dark",
};

/* Runs before first paint so the theme never flashes the wrong way round. */
const THEME_BOOTSTRAP = `
(function(){try{
  var stored = localStorage.getItem('il-theme');
  var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', stored || (dark ? 'dark' : 'light'));
}catch(e){document.documentElement.setAttribute('data-theme','light');}})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>{children}</body>
    </html>
  );
}