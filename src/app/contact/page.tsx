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
      <h2>Send a message</h2>
      <p>
        The contact form below is the way to reach us. We receive your message directly, use your
        details only to reply, and usually respond within a few working days.
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
          and start your message with “Privacy request”.
        </li>
        <li>
          <strong>Advertising and partnership enquiries.</strong> Use the form to send a short description
          of what you have in mind.
        </li>
        <li>
          <strong>Copyright or content concerns.</strong> Use the form to send the page address and a
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
