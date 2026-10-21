import { site } from "@/lib/site";
import { AdSlot } from "./AdSlot";
import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";

/**
 * Page chrome shared by every converter route: breadcrumbs, H1, the three ad
 * positions (top, between tool and article, sticky sidebar) and base JSON-LD.
 * Route-specific SEO content is passed as `children` (rendered inside <article>).
 */
export function ConverterLayout({
  name,
  headline,
  intro,
  slug,
  description,
  tool,
  children,
}: {
  name: string;
  headline: string;
  intro: string;
  slug: string;
  description: string;
  tool: React.ReactNode;
  children: React.ReactNode;
}) {
  const url = `${site.url}/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: headline,
          description,
          url,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name, item: url },
          ],
        }}
      />

      <div className="mx-auto max-w-6xl px-5 pb-8 pt-6 sm:px-8">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name }]} />

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <header>
              <h1 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
                {headline}
              </h1>
              <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted">{intro}</p>
            </header>

            {/* Top banner: tablet/desktop only, so phone users reach the converter without scrolling past an ad. */}
            <AdSlot variant="banner" className="mt-8 hidden md:block" />

            <div className="mt-8">{tool}</div>

            {/* Between the converter and the article, with a clear gap from the inputs to avoid misclicks. */}
            <AdSlot variant="inline" className="mt-14" />

            <article className="article-body mt-14">{children}</article>
          </div>

          <aside className="hidden lg:block" aria-label="Sidebar">
            <div className="sticky top-24">
              <AdSlot variant="sidebar" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
