import Link from "next/link";
import { tools } from "@/lib/tools";
import { site } from "@/lib/site";
import { Wordmark } from "./Header";

const legal = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
];

const linkClass =
  "inline-flex min-h-9 items-center text-sm text-muted transition-colors duration-150 hover:text-ink";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Plain, fast PDF tools. No account, no watermark, and no software to
            install.
          </p>
        </div>

        <nav aria-label="Tools" className="md:col-span-3 md:col-start-7">
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
            Tools
          </h2>
          <ul className="mt-3">
            {tools.map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}`} className={linkClass}>
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company" className="md:col-span-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
            Company
          </h2>
          <ul className="mt-3">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {new Date(site.updated).getFullYear()} {site.name}. All rights reserved.</p>
          <p>Free to use. Supported by advertising.</p>
        </div>
      </div>
    </footer>
  );
}
