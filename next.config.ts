import type { NextConfig } from "next";

/**
 * GitHub Pages serves a project site from /<repo>/, so the base path has to be
 * injected at build time. Left empty locally so `next dev` is untouched.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
