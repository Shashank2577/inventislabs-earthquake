import type { NextConfig } from "next";

/**
 * GitHub Pages serves a project site from /<repo>/, so the base path has to be
 * injected at build time. Left empty locally so `next dev` is untouched.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /* `next dev` and `next build` share one .next directory, so running a build
     while the dev server is live leaves it serving references to chunks that
     no longer exist — random MODULE_NOT_FOUND 500s on routes that were fine a
     second earlier. Separate output directories remove the whole class. */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
