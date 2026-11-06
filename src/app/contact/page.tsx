import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ProsePage } from "@/components/ProsePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.name} with questions, bug reports, tool requests, privacy requests or advertising enquiries.`,
  alternates: { canonical: "/contact" },
};

const link = "text-accent underline underline-offset-4";

export default function ContactPage() {
  return (
    <ProsePage
      title="Contact Us"
      intro="Questions, bug reports and ideas for new tools are all welcome. We read every message."
    >
      <h2>Email</h2>
      <p>
        The fastest way to reach us is by email at{" "}
        <a className={link} href={`mailto:${site.email}`}>
          {site.email}
        </a>
        . We usually reply within a few working days.
      </p>

      <h2>Send a message</h2>
      <p>
        Fill in the form below and your email app will open with the message ready to send. Nothing
        is stored on our servers by the form itself.
      </p>
      <ContactForm />

      <h2>What to contact us about</h2>
      <ul>
        <li>
          <strong>Bugs and wrong results.</strong> Tell us which tool you used, what you expected
          and what happened instead. The browser and device you used help us find the cause faster.
        </li>
        <li>
          <strong>Tool requests and feedback.</strong> Tell us what you were trying to do and where
          the site fell short.
        </li>
        <li>
          <strong>Privacy requests.</strong> To ask what data we hold, or to request deletion, see
          the{" "}
          <Link href="/privacy-policy" className={link}>
            privacy policy
          </Link>{" "}
          and email us with the subject line “Privacy request”.
        </li>
        <li>
          <strong>Advertising and partnership enquiries.</strong> Email us with a short description
          of what you have in mind.
        </li>
        <li>
          <strong>Copyright or content concerns.</strong> Email us with the page address and a
          description of the issue and we will respond promptly.
        </li>
      </ul>

      <h2>Before you write</h2>
      <p>
        Please do not attach private documents or paste passwords, financial details or other
        sensitive information into your message. We will never ask you for them. Answers to common
        questions are also on each tool page, in its FAQ section.
      </p>
    </ProsePage>
  );
}
