import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { ConverterLayout } from "@/components/ConverterLayout";
import { JsonLd } from "@/components/JsonLd";
import { utilityContent, type UtilityContent } from "@/lib/utility-content";

const formulaBox =
  "mt-3 block w-fit max-w-full overflow-x-auto rounded-lg border border-line bg-surface-2 px-3 py-1.5 font-mono text-sm text-ink";
const th = "px-4 py-2.5 text-left font-medium";
const td = "px-4 py-2.5 tabular-nums";

export function getUtility(slug: string): UtilityContent {
  const c = utilityContent[slug];
  if (!c) throw new Error(`No content for ${slug}`);
  return c;
}

/** Use from each route's generateMetadata. */
export function utilityMetadata(slug: string): Metadata {
  const c = getUtility(slug);
  return {
    title: c.seoTitle,
    description: c.seoDescription,
    keywords: c.keywords,
    alternates: { canonical: `/${c.slug}` },
    openGraph: { type: "website", url: `/${c.slug}`, title: c.seoTitle, description: c.seoDescription },
    twitter: { card: "summary_large_image", title: c.seoTitle, description: c.seoDescription },
  };
}

/** Shared route body: tool, ads, and the What / How / Formulas / FAQ article. */
export function UtilityPage({ slug, tool }: { slug: string; tool: React.ReactNode }) {
  const c = getUtility(slug);

  return (
    <>
      {/* FAQPage JSON-LD is built from the same array that renders the visible FAQ. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: c.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `How to use the ${c.name}`,
          step: c.steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.body,
          })),
        }}
      />

      <ConverterLayout
        name={c.name}
        headline={c.name}
        intro={c.intro}
        slug={c.slug}
        description={c.seoDescription}
        tool={tool}
      >
        <h2>{c.what.heading}</h2>
        {c.what.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}

        <h2>How to use this tool</h2>
        <ol className="mt-6 space-y-6">
          {c.steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
              <span aria-hidden="true" className="font-display text-4xl leading-none text-accent">
                {i + 1}
              </span>
              <div>
                <h3 className="!mt-0">{s.title}</h3>
                <p className="!mt-1.5">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2>{c.formulas.heading}</h2>
        {c.formulas.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        {c.formulas.formulas.map((f) => (
          <code key={f} className={formulaBox}>
            {f}
          </code>
        ))}
        {c.formulas.table && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[320px] text-sm">
              <caption className="sr-only">{c.formulas.table.caption}</caption>
              <thead className="bg-surface-2 text-muted">
                <tr>
                  {c.formulas.table.headers.map((h) => (
                    <th key={h} scope="col" className={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {c.formulas.table.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) =>
                      i === 0 ? (
                        <th key={i} scope="row" className={`${td} text-left font-medium`}>
                          {cell}
                        </th>
                      ) : (
                        <td key={i} className={td}>
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2>FAQ</h2>
        <div className="mt-5 divide-y divide-line rounded-2xl border border-line bg-surface">
          {c.faqs.map((f) => (
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
      </ConverterLayout>
    </>
  );
}
