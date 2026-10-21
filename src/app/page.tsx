import type { Metadata } from "next";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { site } from "@/lib/site";
import { tools } from "@/lib/tools";

export const metadata: Metadata = {
  title: { absolute: "Free Online PDF Tools – Merge & Split | Folio" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Free Online PDF Tools – Merge & Split",
    description: site.description,
  },
};

const principles = [
  {
    title: "Nothing to sign up for",
    body: "Open a tool, use it, leave. There is no account, no trial and no email wall.",
  },
  {
    title: "No watermark, ever",
    body: "What you download is your document and nothing else.",
  },
  {
    title: "Built for every screen",
    body: "The same tools work on a phone in a queue or a desktop with twenty files open.",
  },
];

export default function Home() {
  const featured = tools.find((t) => t.featured) ?? tools[0];
  const rest = tools.filter((t) => t.slug !== featured.slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
          description: site.description,
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="hero-grid absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
          <p className="text-sm font-medium text-accent">Free PDF tools</p>
          <h1 className="mt-5 max-w-3xl font-display text-[2.9rem] leading-[1.02] tracking-tight sm:text-7xl">
            Every PDF job, handled in a few clicks.
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted">
            Merge, split and extract pages. Free to use, no account, and no
            watermark on your files.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#tools"
              className="inline-flex h-12 items-center rounded-xl bg-accent px-6 text-[15px] font-medium text-accent-ink shadow-sm transition-colors duration-150 hover:bg-accent-hover"
            >
              Choose a tool
            </a>
            <span className="text-sm text-muted">
              {tools.length} tools · more on the way
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Banner ad: tablet/desktop only */}
        <AdSlot variant="banner" className="mt-10 hidden md:block" />

        {/* Tools */}
        <section id="tools" aria-labelledby="tools-heading" className="scroll-mt-24 pt-16">
          <div className="flex items-end justify-between gap-4">
            <h2
              id="tools-heading"
              className="font-display text-4xl tracking-tight sm:text-5xl"
            >
              PDF tools
            </h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-12">
            <div
              style={{ "--n": rest.length } as React.CSSProperties}
              className="lg:col-span-7 lg:row-[span_var(--n)] [&>a]:h-full"
            >
              <ToolCard tool={featured} variant="featured" />
            </div>
            {rest.map((t) => (
              <div key={t.slug} className="lg:col-span-5 [&>a]:h-full">
                <ToolCard tool={t} />
              </div>
            ))}
          </div>
        </section>

        {/* Why */}
        <section aria-labelledby="why-heading" className="pt-24">
          <div className="grid gap-10 lg:grid-cols-12">
            <h2
              id="why-heading"
              className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:col-span-5"
            >
              Small tools,
              <br />
              done properly.
            </h2>
            <ol className="divide-y divide-line border-y border-line lg:col-span-7">
              {principles.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                  <span className="font-display text-2xl text-accent" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                    <p className="mt-1.5 max-w-[56ch] leading-relaxed text-muted">{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Text content */}
        <section className="article-body pt-24" aria-labelledby="about-tools">
          <h2 id="about-tools">What can you do with Folio?</h2>
          <p>
            PDF is the format people trust for contracts, invoices and reports
            because it looks the same everywhere. That same rigidity makes it
            awkward the moment you need to change something. Folio gives you the
            handful of PDF jobs most people actually run into, each on its own
            page, so you can get to the right tool straight from a search.
          </p>
          <p>
            Join several files into one, pull out just the pages you need, or
            export pages as images for slides and social posts. Every tool is
            free, and none of them asks you to create an account first.
          </p>
        </section>
      </div>
    </>
  );
}
