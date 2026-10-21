import { ChevronDown } from "lucide-react";
import { getRelatedTools, type Tool } from "@/lib/tools";
import { site } from "@/lib/site";
import { AdSlot } from "./AdSlot";
import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";
import { ToolCard } from "./ToolCard";

export function ToolLayout({
  tool,
  children,
}: {
  tool: Tool;
  children: React.ReactNode;
}) {
  const url = `${site.url}/${tool.slug}`;
  const related = getRelatedTools(tool);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "PDF tools", href: "/#tools" },
    { name: tool.name },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: tool.headline,
          description: tool.seoDescription,
          url,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tool.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: site.url },
            { "@type": "ListItem", position: 2, name: "PDF tools", item: `${site.url}/#tools` },
            { "@type": "ListItem", position: 3, name: tool.name, item: url },
          ],
        }}
      />

      <div className="mx-auto max-w-6xl px-5 pb-8 pt-6 sm:px-8">
        <Breadcrumbs items={crumbs} />

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0">
            <header>
              <h1 className="font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
                {tool.headline}
              </h1>
              <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted">
                {tool.intro}
              </p>
            </header>

            {/* 1. Top banner: tablet/desktop only, so mobile users reach the tool without scrolling past an ad. */}
            <AdSlot variant="banner" className="mt-8 hidden md:block" />

            <div className="mt-8">{children}</div>

            {/* 2. In-content ad: between the tool interface and the article. Clear gap from the tool buttons. */}
            <AdSlot variant="inline" className="mt-14" />

            <article className="article-body mt-14">
              <h2>What is {tool.name}?</h2>
              {tool.article.what.map((p) => (
                <p key={p}>{p}</p>
              ))}

              <h2>How to use {tool.name} (step by step)</h2>
              <ol className="mt-6 space-y-6">
                {tool.steps.map((s, i) => (
                  <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
                    <span
                      aria-hidden="true"
                      className="font-display text-4xl leading-none text-accent"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="!mt-0">{s.title}</h3>
                      <p className="!mt-1.5">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <h2>Why use our free {tool.name.toLowerCase()} tool?</h2>
              {tool.article.why.map((w) => (
                <div key={w.title}>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </div>
              ))}

              <h2>Tips for better results</h2>
              <ul className="mt-4 list-disc space-y-3 pl-5 marker:text-accent">
                {tool.article.tips.map((t) => (
                  <li key={t} className="max-w-[68ch] pl-1 leading-relaxed text-muted">
                    {t}
                  </li>
                ))}
              </ul>

              <h2>FAQ</h2>
              <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
                {tool.faqs.map((f) => (
                  <details key={f.q} className="group px-5">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
                      <h3 className="!mt-0 text-[15px]">{f.q}</h3>
                      <ChevronDown
                        size={18}
                        strokeWidth={1.5}
                        className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="!mt-0 pb-5">{f.a}</p>
                  </details>
                ))}
              </div>
            </article>

            <section aria-labelledby="related" className="mt-16">
              <h2 id="related" className="font-display text-3xl tracking-tight">
                More PDF tools
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {related.map((t) => (
                  <ToolCard key={t.slug} tool={t} variant="compact" />
                ))}
              </div>
            </section>
          </div>

          {/* 3. Sidebar ad: desktop only, sticky. */}
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
