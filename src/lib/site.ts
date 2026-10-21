export const site = {
  name: "Folio",
  tagline: "Free online PDF tools",
  description:
    "Merge, split and extract PDFs online. Free, no signup, no watermarks.",
  // Set NEXT_PUBLIC_SITE_URL in production so canonicals, sitemap and OG URLs resolve correctly.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://folio-tools.example",
  email: "hello@folio-tools.example",
  // e.g. "ca-pub-1234567890123456". Leave unset to render design placeholders instead of ads.
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
  // Fixed date so builds are deterministic (used for sitemap lastModified and legal pages).
  updated: "2026-10-21",
} as const;
