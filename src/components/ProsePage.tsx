import { Breadcrumbs } from "./Breadcrumbs";

export function ProsePage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-8 pt-6 sm:px-8">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: title }]} />
      <h1 className="mt-8 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl">
        {title}
      </h1>
      {intro && <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted">{intro}</p>}
      <div className="article-body mt-12">{children}</div>
    </div>
  );
}
