import type { Metadata } from "next";
import { ProsePage } from "@/components/ProsePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that apply when you use ${site.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ProsePage
      title="Terms of Use"
      intro={`Last updated ${site.updated}. By using ${site.name} you agree to these terms.`}
    >
      {/* TODO: have this reviewed by a lawyer before launch. */}
      <h2>Using the service</h2>
      <p>
        {site.name} is provided free of charge for personal and commercial use.
        You agree not to misuse it, including by attempting to disrupt the
        service, overload it with automated requests, or process files you
        don’t have the right to use.
      </p>

      <h2>Your content</h2>
      <p>
        You keep all rights to the files you process. You are responsible for
        making sure you are allowed to convert, merge or split them.
      </p>

      <h2>No warranty</h2>
      <p>
        The tools are provided “as is”. Conversion results can vary with the
        complexity of the source file, so always check the output before relying
        on it. To the extent permitted by law, we are not liable for any loss
        arising from use of the service.
      </p>

      <h2>Advertising and links</h2>
      <p>
        The site displays third-party advertising. We are not responsible for
        the content of advertisers or other sites linked from {site.name}.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the site
        after a change means you accept the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a className="text-accent underline underline-offset-4" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        .
      </p>
    </ProsePage>
  );
}
