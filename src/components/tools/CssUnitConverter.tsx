"use client";

import { useId, useState } from "react";
import { formatNumber } from "@/lib/converters";
import { CopyToClipboard } from "../CopyToClipboard";

export type CssMode = "px-to-vh" | "vh-to-px" | "px-to-rem" | "rem-to-px";

interface ModeConfig {
  from: string;
  to: string;
  valueLabel: string;
  contextLabel: string;
  contextDefault: string;
  presets: number[];
  hint: string;
  calc: (value: number, context: number) => number;
  formula: (context: string) => string;
}

const SCREEN_HEIGHTS = [667, 768, 800, 900, 1080, 1440];
const BASE_SIZES = [10, 12, 14, 16, 18, 20];

const MODES: Record<CssMode, ModeConfig> = {
  "px-to-vh": {
    from: "px",
    to: "vh",
    valueLabel: "Pixels (px)",
    contextLabel: "Viewport height in px",
    contextDefault: "1080",
    presets: SCREEN_HEIGHTS,
    hint: "Use the inner height of the screen or browser window you design for.",
    calc: (px, vh) => (px / vh) * 100,
    formula: (c) => `vh = (px ÷ ${c}) × 100`,
  },
  "vh-to-px": {
    from: "vh",
    to: "px",
    valueLabel: "Viewport height units (vh)",
    contextLabel: "Viewport height in px",
    contextDefault: "1080",
    presets: SCREEN_HEIGHTS,
    hint: "Use the inner height of the screen or browser window you design for.",
    calc: (vh, h) => (vh / 100) * h,
    formula: (c) => `px = (vh ÷ 100) × ${c}`,
  },
  "px-to-rem": {
    from: "px",
    to: "rem",
    valueLabel: "Pixels (px)",
    contextLabel: "Base font size in px",
    contextDefault: "16",
    presets: BASE_SIZES,
    hint: "Browsers default to 16px. Change it if your html font-size is different.",
    calc: (px, base) => px / base,
    formula: (c) => `rem = px ÷ ${c}`,
  },
  "rem-to-px": {
    from: "rem",
    to: "px",
    valueLabel: "Root em units (rem)",
    contextLabel: "Base font size in px",
    contextDefault: "16",
    presets: BASE_SIZES,
    hint: "Browsers default to 16px. Change it if your html font-size is different.",
    calc: (rem, base) => rem * base,
    formula: (c) => `px = rem × ${c}`,
  },
};

const input =
  "h-14 w-full rounded-xl border border-line-strong bg-surface px-4 text-lg text-ink shadow-sm transition-colors placeholder:text-muted/60 hover:border-ink/40 focus:border-accent";

const num = (t: string) => {
  const s = t.trim();
  if (s === "" || s === "-" || s === ".") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

export function CssUnitConverter({ mode }: { mode: CssMode }) {
  const m = MODES[mode];
  const uid = useId();
  const [value, setValue] = useState("100");
  const [context, setContext] = useState(m.contextDefault);

  const v = num(value);
  const c = num(context);
  const invalidContext = c === null || c <= 0;
  const result = v !== null && !invalidContext ? formatNumber(Number(m.calc(v, c).toFixed(6))) : "";
  const output = result ? `${result}${m.to}` : "";

  return (
    <section
      aria-label={`${m.from} to ${m.to} converter`}
      className="rounded-3xl border border-line bg-surface p-5 shadow-md sm:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={`${uid}-v`} className="text-sm font-medium text-muted">
            {m.valueLabel}
          </label>
          <input
            id={`${uid}-v`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={input}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${uid}-c`} className="text-sm font-medium text-muted">
            {m.contextLabel}
          </label>
          <input
            id={`${uid}-c`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={context}
            aria-invalid={invalidContext}
            onChange={(e) => setContext(e.target.value)}
            className={input}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">Presets:</span>
        {m.presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setContext(String(p))}
            aria-pressed={context === String(p)}
            className="h-8 rounded-lg border border-line-strong px-2.5 text-xs font-medium text-ink transition-colors hover:bg-surface-2 aria-pressed:border-accent aria-pressed:bg-accent-soft"
          >
            {p}px
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">{m.hint}</p>

      <div className="mt-6 rounded-2xl bg-accent-soft p-5">
        <p className="text-sm text-muted">Result</p>
        <p
          aria-live="polite"
          className="mt-1 break-all font-display text-4xl tracking-tight text-ink sm:text-5xl"
        >
          {output || "—"}
        </p>
        <p className="mt-2 font-mono text-xs text-muted">
          {invalidContext ? "Enter a value greater than 0." : m.formula(context.trim())}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <CopyToClipboard value={output} label={`Copy ${m.to} value`} />
      </div>
    </section>
  );
}
