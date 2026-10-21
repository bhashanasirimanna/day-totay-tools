import type { Metadata } from "next";
import { ProsePage } from "@/components/ProsePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles your files, cookies and advertising data.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <ProsePage
      title="Privacy Policy"
      intro={`Last updated ${site.updated}. This page explains what ${site.name} collects and why.`}
    >
      {/* TODO: have this reviewed and make it match the final processing architecture before launch. */}
      <h2>Your files</h2>
      <p>
        Merge PDF, Split PDF and PDF to JPG run entirely inside your browser, so
        those files are never uploaded. We do not read, keep, sell or share
        uploaded files.
      </p>

      <h2>Information we collect</h2>
      <p>
        We collect basic, aggregated usage data such as pages visited, device
        type and approximate location, to understand which tools are useful and
        to keep the site working. We do not ask you to create an account.
      </p>

      <h2>Cookies and advertising</h2>
      <p>
        {site.name} shows ads served by Google AdSense. Google and its partners
        use cookies to serve ads based on your visits to this and other
        websites. You can opt out of personalized advertising by visiting{" "}
        <a
          className="text-accent underline underline-offset-4"
          href="https://adssettings.google.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          Google Ads Settings
        </a>
        . Visitors from the European Economic Area, the United Kingdom and
        Switzerland are asked for consent before personalized ads are shown.
      </p>

      <h2>Third-party services</h2>
      <p>
        We use third-party providers for hosting, analytics and advertising.
        They process data under their own privacy policies.
      </p>

      <h2>Your choices</h2>
      <p>
        You can block or delete cookies in your browser settings. You may also
        ask us what data we hold about you, and request its deletion, by
        emailing{" "}
        <a className="text-accent underline underline-offset-4" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change how we handle data we will update this page and the date
        above.
      </p>
    </ProsePage>
  );
}
