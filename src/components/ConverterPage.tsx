import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { ConverterLayout } from "@/components/ConverterLayout";
import { DynamicConverter } from "@/components/DynamicConverter";
import { StructuredData } from "@/components/StructuredData";
import { convert, formatFixed, getUnit } from "@/lib/converters";
import type { ConverterContent, QuickTable } from "@/lib/converter-content";

const formulaBox =
  "mt-4 inline-block rounded-lg border border-line bg-surface-2 px-3 py-1.5 font-mono text-sm text-ink";
const th = "px-4 py-2.5 text-left font-medium";
const td = "px-4 py-2.5 tabular-nums";
const tableWrap = "mt-5 overflow-x-auto rounded-2xl border border-line bg-surface";

export function converterMetadata(c: ConverterContent): Metadata {
  return {
    title: c.seoTitle,
    description: c.seoDescription,
    keywords: c.keywords,
    alternates: { canonical: `/${c.slug}` },
    openGraph: { type: "website", url: `/${c.slug}`, title: c.seoTitle, description: c.seoDescription },
    twitter: { card: "summary_large_image", title: c.seoTitle, description: c.seoDescription },
  };
}

function QuickConversionTable({ category, t }: { category: ConverterContent["category"]; t: QuickTable }) {
  const from = getUnit(category, t.from);
  const to = t.to.map((id) => getUnit(category, id));
  return (
    <div className={tableWrap}>
      <table className="w-full min-w-[420px] text-sm">
        <caption className="sr-only">{t.caption}</caption>
        <thead className="bg-surface-2 text-muted">
          <tr>
            <th scope="col" className={th}>{from.label}</th>
            {to.map((u) => (
              <th key={u.id} scope="col" className={th}>{u.label}</th>
            ))}
            {t.extra && <th scope="col" className={th}>{t.extra.header}</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {t.values.map((v) => (
            <tr key={v}>
              <th scope="row" className={`${td} text-left font-medium`}>
                {formatFixed(v, 2)} {from.symbol}
              </th>
              {to.map((u) => (
                <td key={u.id} className={td}>
                  {formatFixed(convert(category, v, from.id, u.id), 4)} {u.symbol}
                </td>
              ))}
              {t.extra && <td className={td}>{t.extra.format(v)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Whole converter route: tool, ads and keyword-targeted article, all driven by one content object. */
export function ConverterPage({ content: c }: { content: ConverterContent }) {
  return (
    <>
      {/* FAQPage JSON-LD is built from the same array that renders the visible FAQ, so markup and page text always match. */}
      <StructuredData type="FAQPage" faqs={c.faqs} />


      <ConverterLayout
        name={c.name}
        headline={c.name}
        intro={c.intro}
        slug={c.slug}
        description={c.seoDescription}
        tool={
          <DynamicConverter category={c.category} defaultFrom={c.defaultFrom} defaultTo={c.defaultTo} />
        }
      >
        <h2>Popular {c.name.replace(" Converter", "")} Conversions</h2>
        <p>{c.popularIntro}</p>
        {c.popular.map((p) => (
          <div key={p.id}>
            <h3 id={p.id}>{p.title}</h3>
            <p>{p.body}</p>
            <code className={formulaBox}>{p.formula}</code>
          </div>
        ))}

        <h2>Quick Conversion Table</h2>
        <p>{c.quickIntro}</p>
        {c.quickTables.map((t) => (
          <QuickConversionTable key={t.caption} category={c.category} t={t} />
        ))}

        <h2>{c.name.replace(" Converter", "")} Units Compared</h2>
        <p>{c.referenceIntro}</p>
        <div className={tableWrap}>
          <table className="w-full min-w-[420px] text-sm">
            <caption className="sr-only">Reference equivalents</caption>
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th scope="col" className={th}>Unit</th>
                <th scope="col" className={th}>Equals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {c.reference.map(([unit, value]) => (
                <tr key={unit}>
                  <th scope="row" className={`${td} text-left font-medium`}>{unit}</th>
                  <td className={td}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Frequently Asked Questions</h2>
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
