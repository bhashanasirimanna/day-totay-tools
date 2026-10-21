"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

async function writeClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts and older browsers.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      document.body.removeChild(ta);
    }
  }
}

interface Props {
  value: string;
  label?: string;
  toastText?: string;
  /** "primary" is the prominent filled button; "secondary" is outlined. */
  variant?: "primary" | "secondary";
  className?: string;
}

export function CopyToClipboard({
  value,
  label = "Copy to clipboard",
  toastText = "Copied!",
  variant = "primary",
  className = "",
}: Props) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    if (!value) return;
    setState((await writeClipboard(value)) ? "copied" : "failed");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  const styles =
    variant === "primary"
      ? "bg-accent text-accent-ink shadow-sm hover:bg-accent-hover"
      : "border border-line-strong bg-surface text-ink hover:bg-surface-2";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        disabled={!value}
        className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
      >
        {state === "copied" ? (
          <Check size={18} strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Copy size={18} strokeWidth={1.5} aria-hidden="true" />
        )}
        {state === "copied" ? "Copied" : label}
      </button>

      {/* Toast: always mounted so screen readers announce the change. */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-5 transition-all duration-200 ${
          state === "idle" ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium shadow-md ${
            state === "failed" ? "bg-danger text-bg" : "bg-ink text-bg"
          }`}
        >
          {state === "failed" ? (
            "Couldn’t copy. Select the text and press Ctrl+C."
          ) : state === "copied" ? (
            <>
              <Check size={16} strokeWidth={2} aria-hidden="true" />
              {toastText}
            </>
          ) : null}
        </span>
      </div>
    </>
  );
}
