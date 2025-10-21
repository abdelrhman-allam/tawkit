import type { NextConfig } from "next";

// Configure static export suitable for GitHub Pages.
// Base path is set via env for repo pages (e.g., /REPO_NAME).
const isGH = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePathEnv = process.env.NEXT_PUBLIC_BASE_PATH;
const basePath = basePathEnv ?? (isGH && repoName ? `/${repoName}` : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

export default nextConfig;
