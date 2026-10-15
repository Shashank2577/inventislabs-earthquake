import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

/* A high-contrast editorial serif for display, a technical sans for reading,
   a true mono for every number on the page. */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--f-display",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--f-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--f-mono",
  display: "swap",
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