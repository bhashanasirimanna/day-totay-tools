import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { converterNav } from "@/lib/converter-nav";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(site.updated);

  return [
    { url: site.url, lastModified, changeFrequency: "weekly", priority: 1 },
    ...tools.map((t) => ({
      url: `${site.url}/${t.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...converterNav.map((c) => ({
      url: `${site.url}/${c.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...["about", "contact", "privacy-policy", "terms"].map((p) => ({
      url: `${site.url}/${p}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
