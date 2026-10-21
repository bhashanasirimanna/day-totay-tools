import type { Metadata } from "next";
import { ProsePage } from "@/components/ProsePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name} with questions, bug reports or tool requests.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <ProsePage
      title="Contact"
      intro="Questions, bug reports and ideas for new tools are all welcome."
    >
      <h2>Email</h2>
      <p>
        The fastest way to reach us is by email at{" "}
        <a className="text-accent underline underline-offset-4" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        . We read every message and usually reply within a few working days.
      </p>

      <h2>When reporting a problem</h2>
      <p>
        Tell us which tool you were using, what you expected to happen and what
        happened instead. The browser and device you used also help us find the
        cause faster. Please don’t attach private documents to your message.
      </p>
    </ProsePage>
  );
}
