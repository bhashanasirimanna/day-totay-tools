import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { getTool, tools } from "@/lib/tools";

export function generateStaticParams() {
  return tools.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tool: string }>;
}): Promise<Metadata> {
  const { tool: slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    keywords: tool.keywords,
    alternates: { canonical: `/${tool.slug}` },
    openGraph: {
      type: "website",
      url: `/${tool.slug}`,
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seoTitle,
      description: tool.seoDescription,
    },
  };
}

// The page itself doesn't await `params`, so the shared App Shell isn't tied to one URL.
// Known slugs are still prerendered at build time via generateStaticParams.
export default function ToolPage({
  params,
}: {
  params: Promise<{ tool: string }>;
}) {
  return (
    <Suspense fallback={<ToolSkeleton />}>
      <ToolContent params={params} />
    </Suspense>
  );
}

function ToolSkeleton() {
  return (
    <div
      aria-busy="true"
      className="mx-auto max-w-6xl animate-pulse px-5 pb-8 pt-6 sm:px-8"
    >
      <div className="h-4 w-48 rounded bg-surface-2" />
      <div className="mt-10 h-14 w-3/4 max-w-xl rounded-xl bg-surface-2" />
      <div className="mt-5 h-5 w-full max-w-lg rounded bg-surface-2" />
      <div className="mt-12 h-72 rounded-3xl border border-line bg-surface" />
    </div>
  );
}

async function ToolContent({ params }: { params: Promise<{ tool: string }> }) {
  const { tool: slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  return (
    <ToolLayout tool={tool}>
      <ToolWorkspace
        tool={{
          slug: tool.slug,
          name: tool.name,
          multiple: tool.multiple,
          minFiles: tool.minFiles,
          cta: tool.cta,
          outputLabel: tool.outputLabel,
          option: tool.option,
        }}
      />
    </ToolLayout>
  );
}
