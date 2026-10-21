"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

export type AdVariant = "banner" | "sidebar" | "inline";

/**
 * Fixed heights reserve the space up front so a late-loading ad never shifts the page (CLS ~ 0).
 * Replace the `slot` ids with the ad units created in your AdSense dashboard.
 */
const VARIANTS: Record<
  AdVariant,
  { box: string; slot: string; format: string; label: string }
> = {
  banner: {
    box: "min-h-[110px] w-full",
    slot: "0000000001",
    format: "horizontal",
    label: "Leaderboard 728×90",
  },
  sidebar: {
    box: "min-h-[600px] w-full",
    slot: "0000000002",
    format: "vertical",
    label: "Skyscraper 300×600",
  },
  inline: {
    box: "min-h-[280px] w-full",
    slot: "0000000003",
    format: "rectangle",
    label: "Rectangle 336×280",
  },
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({
  variant,
  className = "",
}: {
  variant: AdVariant;
  className?: string;
}) {
  const v = VARIANTS[variant];
  const pushed = useRef(false);
  const live = Boolean(site.adsenseClient);

  useEffect(() => {
    if (!live || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers and policy errors must never break the page.
    }
  }, [live]);

  return (
    <aside aria-label="Advertisement" className={className}>
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted/80">
        Advertisement
      </p>
      {live ? (
        <ins
          className={`adsbygoogle block ${v.box}`}
          data-ad-client={site.adsenseClient}
          data-ad-slot={v.slot}
          data-ad-format={v.format}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          className={`${v.box} flex items-center justify-center rounded-xl border border-dashed border-line-strong bg-surface-2/60 text-xs text-muted`}
        >
          Ad space · {v.label}
        </div>
      )}
    </aside>
  );
}
