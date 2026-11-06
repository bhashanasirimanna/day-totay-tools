import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms and conditions that apply when you use ${site.name}, including acceptable use, AI tool guidance, disclaimers and limits of liability.`,
  alternates: { canonical: "/terms-of-service" },
};

const link = "text-accent underline underline-offset-4";

export default function TermsOfServicePage() {
  return (
    <ProsePage
      title="Terms & Conditions"
      intro={`Last updated ${site.updated}. By accessing or using ${site.name} you agree to these terms. If you do not agree, please do not use the site.`}
    >
      <h2>1. The service</h2>
      <p>
        {site.name} provides free online tools, including PDF tools, unit and color converters,
        image tools, a word counter, a password generator and an AI text humanizer. We may add,
        change or remove tools, or limit usage, at any time and without notice.
      </p>

      <h2>2. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the service for anything unlawful, or to process content you have no right to use;</li>
        <li>disrupt, overload or attempt to gain unauthorized access to the service or its systems;</li>
        <li>use bots, scrapers or other automated means to send large volumes of requests;</li>
        <li>
          interfere with advertising, or click on ads in a way that is artificial or intended to
          generate invalid activity;
        </li>
        <li>use the service to produce content that is harmful, defamatory, deceptive or infringing.</li>
      </ul>

      <h2>3. Your content</h2>
      <p>
        You keep all rights to the files and text you process. You are responsible for making sure
        you are allowed to convert, merge, edit or rewrite them. We do not claim ownership of your
        content and use it only to provide the tool you asked for, as described in our{" "}
        <Link href="/privacy-policy" className={link}>
          privacy policy
        </Link>
        .
      </p>

      <h2>4. AI Humanizer and responsible use</h2>
      <p>
        The AI Humanizer rewrites text using a third party language model. Output may contain
        errors, omissions or changes of nuance, so you must review it before relying on it. We do not
        guarantee that any text will or will not be identified by an AI detector, and we make no
        promise about any particular result.
      </p>
      <p>
        You are solely responsible for how you use the output. You must follow the academic integrity
        rules, workplace policies, publisher requirements and laws that apply to you, including any
        duty to disclose AI assistance. We do not permit use of the tool to impersonate others, to
        deceive where honesty is required, to commit fraud, or to generate spam or unlawful content.
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        The site, its design, text, code and branding are owned by {site.name} or its licensors and
        are protected by copyright and other laws. You may use the tools for personal and commercial
        purposes, but you may not copy, resell or republish our site content or software without
        permission.
      </p>

      <h2>6. No warranty</h2>
      <p>
        The service is provided “as is” and “as available”, without warranties of any kind, express
        or implied, including accuracy, fitness for a particular purpose and non infringement.
        Results can vary with the complexity of the source file or text, so always check the output
        before relying on it, especially for legal, medical, financial or academic purposes.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {site.name} and its operators are not liable for any
        indirect, incidental, special or consequential damages, or for any loss of data, profits or
        reputation, arising from your use of or inability to use the service.
      </p>

      <h2>8. Advertising and third party links</h2>
      <p>
        The site displays third party advertising and may link to other websites. We do not control
        and are not responsible for the content, products or practices of advertisers or other
        sites. Your dealings with them are between you and them.
      </p>

      <h2>9. Suspension and termination</h2>
      <p>
        We may block or restrict access to the service for anyone who breaches these terms or who
        puts the service or other users at risk.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The date at the top shows when they were last
        changed. Continued use of the site after a change means you accept the updated terms.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws of the country in which the site operator is based,
        without regard to conflict of law rules. Nothing here limits any mandatory consumer rights you
        have under the law where you live.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a className={link} href={`mailto:${site.email}`}>
          {site.email}
        </a>{" "}
        or through our{" "}
        <Link href="/contact" className={link}>
          contact page
        </Link>
        .
      </p>
    </ProsePage>
  );
}
