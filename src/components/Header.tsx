"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { converterNav } from "@/lib/converter-nav";
import { tools } from "@/lib/tools";
import { site } from "@/lib/site";
import { ToolIcon } from "./ToolIcon";

/** Add a new group (or tool) here and the mega menu grows by itself. */
const toolGroups = [
  { heading: "PDF tools", items: tools },
  { heading: "Unit converters", items: converterNav },
];

export function Wordmark() {
  return (
    <Link
      href="/"
      className="font-display text-[1.65rem] leading-none tracking-tight"
      aria-label={`${site.name} home`}
    >
      {site.name}
      <span className="text-accent">.</span>
    </Link>
  );
}

export function Header() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Close the dropdown on outside click / Escape.
  useEffect(() => {
    if (!toolsOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setToolsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setToolsOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [toolsOpen]);

  // Lock scroll and handle Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const close = () => {
    setToolsOpen(false);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Wordmark />

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <div ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={toolsOpen}
              aria-controls={panelId}
              onClick={() => setToolsOpen((o) => !o)}
              className="inline-flex h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium text-muted transition-colors duration-150 hover:text-ink"
            >
              Tools
              <ChevronDown
                size={15}
                strokeWidth={1.75}
                className={`transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {toolsOpen && (
              <div
                id={panelId}
                className="absolute inset-x-0 top-full border-b border-line bg-surface shadow-md"
              >
                <div className="mx-auto grid max-h-[calc(100vh-5rem)] max-w-6xl gap-x-10 gap-y-6 overflow-y-auto px-5 py-6 sm:px-8 [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))]">
                  {toolGroups.map((group) => (
                    <div key={group.heading}>
                      <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted">
                        {group.heading}
                      </p>
                      {group.items.map((t) => (
                        <Link
                          key={t.slug}
                          href={`/${t.slug}`}
                          onClick={close}
                          className="flex items-start gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-surface-2"
                        >
                          <span className="mt-0.5 text-accent">
                            <ToolIcon name={t.icon} size={18} />
                          </span>
                          <span>
                            <span className="block text-sm font-medium">{t.name}</span>
                            <span className="mt-0.5 block text-xs leading-snug text-muted">
                              {t.shortDescription}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link
            href="/about"
            className="inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium text-muted transition-colors duration-150 hover:text-ink"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium text-muted transition-colors duration-150 hover:text-ink"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="inline-flex size-11 items-center justify-center rounded-lg text-ink md:hidden"
        >
          <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile slide-over */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={close}
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-200 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col border-l border-line bg-bg p-5 shadow-md transition-transform duration-200 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={close}
              tabIndex={menuOpen ? 0 : -1}
              className="inline-flex size-11 items-center justify-center rounded-lg"
            >
              <X size={22} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-4 flex flex-col">
            {[...tools, ...converterNav].map((t) => (
              <Link
                key={t.slug}
                href={`/${t.slug}`}
                onClick={close}
                tabIndex={menuOpen ? 0 : -1}
                className="flex min-h-14 items-center gap-3 border-b border-line text-lg font-display tracking-tight"
              >
                <span className="text-accent">
                  <ToolIcon name={t.icon} size={20} />
                </span>
                {t.name}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={close}
              tabIndex={menuOpen ? 0 : -1}
              className="flex min-h-12 items-center text-sm text-muted"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={close}
              tabIndex={menuOpen ? 0 : -1}
              className="flex min-h-12 items-center text-sm text-muted"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
