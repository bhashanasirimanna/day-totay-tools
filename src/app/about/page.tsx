import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `${site.name} offers free PDF tools, unit converters, image tools and an AI text humanizer. No sign-up, no watermarks. Learn who we are and how the site is run.`,
  alternates: { canonical: "/about" },
};

const link = "text-accent underline underline-offset-4";

export default function AboutPage() {
  return (
    <ProsePage
      title="About Us"
      intro={`${site.name} is a collection of free online tools that each do one job well, without accounts, watermarks or clutter.`}
    >
      <h2>Why {site.name} exists</h2>
      <p>
        Most people reach for a utility tool in a hurry: merge two PDFs before a deadline, convert
        pixels to rem while styling a page, or tidy a draft before sending it. Too many sites make
        that moment harder than it should be with sign-up walls, watermarks on the output, and pages
        so crowded with buttons that the actual tool is hard to find. We built {site.name} as the
        alternative: open a page, finish the job, and close the tab.
      </p>

      <h2>What you can do here</h2>
      <p>The site currently covers four groups of tools:</p>
      <ul>
        <li>
          <strong>PDF tools.</strong> Merge several PDFs into one, split a document into the pages
          you need, convert PDF pages to JPG images, and convert PDF to Word.
        </li>
        <li>
          <strong>Unit and CSS converters.</strong> Length, weight, area and temperature
          converters, plus a CSS unit converter for px, rem, vh and vw and a HEX to RGB color
          converter for designers and developers.
        </li>
        <li>
          <strong>Image tools.</strong> Remove an image background, flip and rotate pictures, and
          pick exact colors from any image.
        </li>
        <li>
          <strong>Writing and security tools.</strong> A word counter, a password generator and an{" "}
          <Link href="/ai-humanizer" className={link}>
            AI Humanizer
          </Link>{" "}
          that helps you edit machine written drafts into natural prose.
        </li>
      </ul>

      <h2>How our tools work</h2>
      <p>
        Wherever it is practical, processing happens inside your browser, so your files and
        text never leave your device. The PDF, image and converter tools work this way. The AI
        Humanizer is the exception: it needs a language model, so the text you submit is sent
        securely to an AI provider to generate the rewrite and is not stored by us. Each tool page
        explains in plain language what the tool does, how to use it, and what its limits are. Our{" "}
        <Link href="/privacy-policy" className={link}>
          privacy policy
        </Link>{" "}
        describes data handling in full.
      </p>

      <h2>Our principles</h2>
      <ul>
        <li>
          <strong>Free and honest.</strong> The tools are free to use. We do not hide results behind
          paywalls or add watermarks to your output.
        </li>
        <li>
          <strong>Privacy first.</strong> No account is needed, and we keep data collection to the
          minimum required to run and improve the site.
        </li>
        <li>
          <strong>Accurate and explained.</strong> Converters use standard published formulas, and
          we show the formula so you can check the result yourself.
        </li>
        <li>
          <strong>Responsible AI.</strong> We describe what our AI tool can and cannot do, we do not
          promise results no tool can guarantee, and we encourage using it in line with the rules of
          your school, workplace or publisher.
        </li>
      </ul>

      <h2>How the site is paid for</h2>
      <p>
        {site.name} is free to use and supported by advertising, including Google AdSense. Ads are
        kept clear of the tools themselves so they do not get in the way of your work, and they are
        always separate from our content. We do not sell your files or personal data. For details
        on cookies and ad personalization, read the{" "}
        <Link href="/privacy-policy" className={link}>
          privacy policy
        </Link>
        .
      </p>

      <h2>Quality and corrections</h2>
      <p>
        We test each tool before release and review its explanatory content for accuracy. If you
        find a bug, a wrong result or an unclear explanation, tell us and we will look into it. New
        tools are added carefully, and only when we can make them work well.
      </p>

      <h2>Get in touch</h2>
      <p>
        Found a bug or want a tool added? Visit the{" "}
        <Link href="/contact" className={link}>
          contact page
        </Link>{" "}
        to send us a message.
      </p>
    </ProsePage>
  );
}
