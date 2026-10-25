import { site } from "@/lib/site";
import { JsonLd } from "./JsonLd";

type Faq = { q: string; a: string };

type StructuredDataProps =
  | {
      type: "SoftwareApplication";
      name: string;
      description: string;
      /** Route path without a leading slash, e.g. "length-converter". */
      slug: string;
      category?: string;
    }
  | { type: "FAQPage"; faqs: Faq[] };

/**
 * Server component that injects schema.org JSON-LD. Pass the same arrays that render the
 * visible page (e.g. the FAQ list) so markup and on-page text can never drift apart.
 */
export function StructuredData(props: StructuredDataProps) {
  if (props.type === "FAQPage") {
    return (
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: props.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
    );
  }

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: props.name,
        description: props.description,
        url: `${site.url}/${props.slug}`,
        applicationCategory: props.category ?? "UtilitiesApplication",
        operatingSystem: "Any (web browser)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }}
    />
  );
}
