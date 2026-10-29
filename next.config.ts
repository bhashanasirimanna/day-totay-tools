import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    // Old single-purpose pages now live in two hubs; the query string preselects the matching direction.
    const hub = (source: string, destination: string) => ({ source, destination, permanent: true });
    return [
      { source: "/terms", destination: "/terms-of-service", permanent: true },
      hub("/px-to-rem", "/css-unit-converter?from=px&to=rem"),
      hub("/rem-to-px", "/css-unit-converter?from=rem&to=px"),
      hub("/px-to-vh", "/css-unit-converter?from=px&to=vh"),
      hub("/vh-to-px", "/css-unit-converter?from=vh&to=px"),
      hub("/hex-to-rgb", "/color-converter?from=hex&to=rgb"),
      hub("/rgb-to-hex", "/color-converter?from=rgb&to=hex"),
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
