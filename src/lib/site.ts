const FALLBACK_URL = "https://toolbunch.tools";

/** Falls back when the env var is unset, empty, not an http(s) URL, or still the "your-domain" placeholder. Strips trailing slashes. */
function resolveSiteUrl(raw: string | undefined): string {
  const value = raw?.trim().replace(/\/+$/, "");
  if (!value || !/^https?:\/\//.test(value) || value.includes("your-domain")) return FALLBACK_URL;
  return value;
}

export const site = {
  name: "ToolBunch",
  tagline: "Free online tools",
  description:
    "Merge, split and extract PDFs, and convert units and colors, count words and generate passwords online. Free, no signup, no watermarks.",
  // Set NEXT_PUBLIC_SITE_URL in production so canonicals, sitemap and OG URLs resolve correctly.
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  email: "hello@toolbunch.tools",
  // e.g. "ca-pub-1234567890123456". Leave unset to render design placeholders instead of ads.
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
  // Fixed date so builds are deterministic (used for sitemap lastModified and legal pages).
  updated: "2026-10-21",
} as const;
