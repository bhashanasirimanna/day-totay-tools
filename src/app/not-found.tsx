import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-28 sm:px-8">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-4 font-display text-5xl tracking-tight sm:text-6xl">
        That page doesn’t exist.
      </h1>
      <p className="mt-5 max-w-[48ch] text-lg text-muted">
        The link may be old or mistyped. The tools are all on the home page.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-xl bg-accent px-6 text-[15px] font-medium text-accent-ink transition-colors hover:bg-accent-hover"
      >
        Back to all tools
      </Link>
    </div>
  );
}
