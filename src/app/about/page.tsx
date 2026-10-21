import type { Metadata } from "next";
import { ProsePage } from "@/components/ProsePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} offers free, simple PDF tools: merge, split and extract pages with no signup and no watermark.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ProsePage
      title="About"
      intro={`${site.name} is a small set of PDF tools that do one job each and do it without fuss.`}
    >
      <h2>Why this exists</h2>
      <p>
        Most people only need a PDF tool a few times a year, usually in a hurry.
        Too many sites make that moment harder than it should be with sign-up
        walls, watermarks on the output and layouts crowded with buttons. We
        wanted a place where you can open a page, finish the job and close the
        tab.
      </p>

      <h2>What you can do here</h2>
      <p>
        Convert PDFs to JPG, merge several PDFs into one, and split a document
        into the pages you need. We add tools carefully, and only when we can
        make them work well.
      </p>

      <h2>How it’s paid for</h2>
      <p>
        {site.name} is free to use and supported by advertising. Ads are kept
        clear of the tools themselves so they don’t get in the way of your work.
        Read more in our privacy policy.
      </p>

      <h2>Get in touch</h2>
      <p>
        Found a bug or want a tool added? Write to us at{" "}
        <a className="text-accent underline underline-offset-4" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>
    </ProsePage>
  );
}
