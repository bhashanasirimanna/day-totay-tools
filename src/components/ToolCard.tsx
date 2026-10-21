import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/tools";

export type CardItem = Pick<Tool, "slug" | "name" | "shortDescription" | "icon">;
import { ToolIconTile } from "./ToolIcon";

const base =
  "group relative flex flex-col rounded-2xl border border-line bg-surface shadow-sm transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong hover:shadow-md";

export function ToolCard({
  tool,
  variant = "default",
}: {
  tool: CardItem;
  variant?: "default" | "featured" | "compact";
}) {
  if (variant === "featured") {
    return (
      <Link
        href={`/${tool.slug}`}
        className={`${base} justify-between gap-12 overflow-hidden p-7 sm:p-8`}
      >
        <div>
          <div className="flex items-start justify-between">
            <ToolIconTile name={tool.icon} large />
            <span className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-muted">
              Most used
            </span>
          </div>
          <h3 className="mt-8 font-display text-4xl leading-none tracking-tight sm:text-5xl">
            {tool.name}
          </h3>
          <p className="mt-4 max-w-[44ch] text-[15px] leading-relaxed text-muted">
            {tool.shortDescription}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          Open tool
          <ArrowUpRight
            size={16}
            strokeWidth={1.75}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/${tool.slug}`} className={`${base} gap-3 p-4`}>
        <div className="flex items-center gap-3">
          <ToolIconTile name={tool.icon} />
          <h3 className="text-[15px] font-semibold tracking-tight">{tool.name}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted">{tool.shortDescription}</p>
      </Link>
    );
  }

  return (
    <Link href={`/${tool.slug}`} className={`${base} gap-6 p-6`}>
      <div className="flex items-start justify-between">
        <ToolIconTile name={tool.icon} />
        <ArrowUpRight
          size={18}
          strokeWidth={1.5}
          className="text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
      <div>
        <h3 className="font-display text-2xl tracking-tight">{tool.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{tool.shortDescription}</p>
      </div>
    </Link>
  );
}
