import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles your files, text, cookies, analytics and advertising data, and the choices you have.`,
  alternates: { canonical: "/privacy-policy" },
};

const link = "text-accent underline underline-offset-4";

export default function PrivacyPage() {
  return (
    <ProsePage
      title="Privacy Policy"
      intro={`Last updated ${site.updated}. This page explains what ${site.name} (${site.url.replace(/^https?:\/\//, "")}) collects, why, and the choices you have.`}
    >
      <h2>Summary</h2>
      <p>
        You do not need an account to use {site.name}. Most tools process your files inside your
        browser and never upload them. The AI Humanizer is the exception and sends your text to an AI
        provider to generate a rewrite. We show ads, which means advertising partners may use
        cookies. The sections below give the detail.
      </p>

      <h2>Your files and text</h2>
      <h3>Tools that run in your browser</h3>
      <p>
        Merge PDF, Split PDF, PDF to JPG, the Background Remover, Image Flipper and Rotator, Image
        Color Picker, the unit and color converters, the Word Counter and the Password Generator
        process everything locally on your device. Your files and the values you type are not
        uploaded to our servers. Generated passwords are created in your browser and are never
        transmitted or stored by us.
      </p>
      <h3>The AI Humanizer</h3>
      <p>
        The AI Humanizer needs a language model, so the text you submit is sent over an encrypted
        connection to our server and on to a third party AI provider (currently Groq) solely to
        produce the rewrite. We do not store the text or the result in a database and we do not use
        them to build profiles. Our server and the provider may keep short lived technical logs, such
        as request time and size, for security and abuse prevention. Please do not submit passwords,
        confidential business information or sensitive personal data.
      </p>
      <h3>Files you share with us</h3>
      <p>
        If you send us a file or message, we use it only to respond to you and delete it when the
        matter is resolved.
      </p>

      <h2>Information we collect</h2>
      <p>We do not ask you to register or provide your name. We may collect:</p>
      <ul>
        <li>
          Aggregated usage data such as pages visited, referring page, browser type, device type,
          screen size, country level location and approximate performance timings, through Vercel
          Analytics and Vercel Speed Insights.
        </li>
        <li>
          Technical data such as your IP address, which is processed by our hosting provider to
          deliver the site and protect it from abuse.
        </li>
        <li>
          Information you choose to send us, such as your name, email address and message when you
          use the contact form. The form is processed by Web3Forms, which delivers the message to us
          by email.
        </li>
        <li>Your light or dark theme choice, stored in your browser so the site remembers it.</li>
      </ul>

      <h2>How we use information</h2>
      <p>
        We use this information to operate and secure the site, understand which tools are useful,
        fix errors, improve performance, respond to messages and show advertising that keeps the
        tools free. We do not sell personal information.
      </p>

      <h2>Cookies and advertising</h2>
      <p>
        {site.name} shows ads served by Google AdSense and its partners. Third party vendors,
        including Google, use cookies to serve ads based on your previous visits to this and other
        websites. Google’s use of advertising cookies enables it and its partners to serve ads to
        you based on your visit to our site and to other sites on the internet.
      </p>
      <ul>
        <li>
          You can opt out of personalized advertising at{" "}
          <a
            className={link}
            href="https://adssettings.google.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Google Ads Settings
          </a>
          , or visit{" "}
          <a
            className={link}
            href="https://www.aboutads.info"
            rel="noopener noreferrer"
            target="_blank"
          >
            aboutads.info
          </a>{" "}
          to opt out of some third party vendors’ use of cookies for personalized advertising.
        </li>
        <li>
          Visitors from the European Economic Area, the United Kingdom and Switzerland are asked for
          consent before personalized ads are shown.
        </li>
        <li>
          You can learn how Google uses data from sites that use its services at{" "}
          <a
            className={link}
            href="https://policies.google.com/technologies/partner-sites"
            rel="noopener noreferrer"
            target="_blank"
          >
            policies.google.com/technologies/partner-sites
          </a>
          .
        </li>
      </ul>

      <h2>Third party services</h2>
      <p>
        We rely on providers for hosting and analytics (Vercel), advertising (Google AdSense) AI
        text processing (Groq) and contact form delivery (Web3Forms). Each processes data under its own privacy policy, and we encourage
        you to read them. Links from our site to other websites are not covered by this policy.
      </p>

      <h2>Retention and security</h2>
      <p>
        Browser based tools keep nothing on our side. Aggregated analytics are retained for as long as
        the analytics provider’s standard settings allow. Messages you send us are kept for as long as
        needed to handle your request. The site is served over HTTPS and we limit the data we handle,
        but no method of transmission or storage is completely secure.
      </p>

      <h2>Your rights and choices</h2>
      <p>
        Depending on where you live, you may have the right to access, correct or delete personal
        data we hold about you, to object to or restrict its processing, and to withdraw consent. You
        can block or delete cookies in your browser settings. To make a request, use our{" "}
        <Link href="/contact" className={link}>
          contact form
        </Link>{" "}
        and start your message with “Privacy request”. We will respond within a reasonable time.
      </p>

      <h2>Children’s privacy</h2>
      <p>
        {site.name} is not directed at children under 13 and we do not knowingly collect personal
        information from them. If you believe a child has sent us personal information, contact us
        and we will delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change how we handle data we will update this page and the date above. Please also read
        our{" "}
        <Link href="/terms-of-service" className={link}>
          terms of service
        </Link>
        .
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent through our{" "}
        <Link href="/contact" className={link}>
          contact page
        </Link>
        .
      </p>
    </ProsePage>
  );
}
