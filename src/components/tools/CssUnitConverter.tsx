"use client";

import { useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import { formatNumber } from "@/lib/converters";
import { CopyToClipboard } from "../CopyToClipboard";

const UNITS = ["px", "rem", "vh", "vw"] as const;
type Unit = (typeof UNITS)[number];

const UNIT_LABEL: Record<Unit, string> = {
  px: "Pixels (px)",
  rem: "Root em (rem)",
  vh: "Viewport height (vh)",
  vw: "Viewport width (vw)",
};

const SCREEN_HEIGHTS = [667, 768, 800, 900, 1080, 1440];
const SCREEN_WIDTHS = [360, 390, 768, 1024, 1366, 1440, 1920];
const BASE_SIZES = [10, 12, 14, 16, 18, 20];

const isUnit = (v: string | null): v is Unit => UNITS.includes(v as Unit);

const field =
  "h-14 w-full rounded-xl border border-line-strong bg-surface px-4 text-lg text-ink shadow-sm transition-colors placeholder:text-muted/60 hover:border-ink/40 focus:border-accent";

const num = (t: string) => {
  const s = t.trim();
  if (s === "" || s === "-" || s === ".") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

interface Ctx {
  base: number;
  vh: number;
  vw: number;
}

/** Everything converts through pixels. */
const toPx = (v: number, unit: Unit, c: Ctx) =>
  unit === "px" ? v : unit === "rem" ? v * c.base : unit === "vh" ? (v / 100) * c.vh : (v / 100) * c.vw;
const fromPx = (px: number, unit: Unit, c: Ctx) =>
  unit === "px" ? px : unit === "rem" ? px / c.base : unit === "vh" ? (px / c.vh) * 100 : (px / c.vw) * 100;

/** Reads as "px" for the pixel step and as the unit's own factor otherwise. */
function formula(from: Unit, to: Unit, t: { base: string; vh: string; vw: string }) {
  if (from === to) return `${to} = ${from}`;
  const factor = { px: "", rem: t.base, vh: t.vh, vw: t.vw };
  const toPxExpr = (u: Unit) =>
    u === "px" ? "px" : u === "rem" ? `(rem × ${t.base})` : `((${u} ÷ 100) × ${factor[u]})`;
  if (from === "px") return to === "rem" ? `rem = px ÷ ${t.base}` : `${to} = (px ÷ ${factor[to]}) × 100`;
  if (to === "px") return from === "rem" ? `px = rem × ${t.base}` : `px = (${from} ÷ 100) × ${factor[from]}`;
  const px = toPxExpr(from);
  return to === "rem" ? `rem = ${px} ÷ ${t.base}` : `${to} = (${px} ÷ ${factor[to]}) × 100`;
}

function Select({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: Unit;
  onChange: (u: Unit) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as Unit)}
        className={`${field} appearance-none`}
      >
        {UNITS.map((u) => (
          <option key={u} value={u}>
            {UNIT_LABEL[u]}
          </option>
        ))}
      </select>
    </div>
  );
}

function ContextField({
  id,
  label,
  hint,
  value,
  onChange,
  presets,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  presets: number[];
}) {
  const n = num(value);
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-muted">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        aria-invalid={n === null || n <= 0}
        onChange={(e) => onChange(e.target.value)}
        className={field}
      />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted">Presets:</span>
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(String(p))}
            aria-pressed={value === String(p)}
            className="h-8 rounded-lg border border-line-strong px-2.5 text-xs font-medium text-ink transition-colors hover:bg-surface-2 aria-pressed:border-accent aria-pressed:bg-accent-soft"
          >
            {p}px
          </button>
        ))}
      </div>
      <p className="text-xs text-muted">{hint}</p>
    </div>
  );
}

export function CssUnitConverter({
  initialFrom = "px",
  initialTo = "rem",
}: {
  initialFrom?: Unit;
  initialTo?: Unit;
}) {
  const uid = useId();
  const [from, setFrom] = useState<Unit>(initialFrom);
  const [to, setTo] = useState<Unit>(initialTo);
  const [value, setValue] = useState("100");
  const [base, setBase] = useState("16");
  const [vp, setVp] = useState("1080");
  const [vw, setVw] = useState("1440");

  const v = num(value);
  const b = num(base);
  const h = num(vp);
  const w = num(vw);
  const needsBase = from === "rem" || to === "rem";
  const needsVh = from === "vh" || to === "vh";
  const needsVw = from === "vw" || to === "vw";
  const bad = (n: number | null, needed: boolean) => needed && (n === null || n <= 0);
  const invalidContext = bad(b, needsBase) || bad(h, needsVh) || bad(w, needsVw);

  const ctx: Ctx = { base: b ?? 16, vh: h ?? 1080, vw: w ?? 1440 };
  const result =
    v !== null && !invalidContext
      ? formatNumber(Number(fromPx(toPx(v, from, ctx), to, ctx).toFixed(6)))
      : "";
  const output = result ? `${result}${to}` : "";

  return (
    <section aria-label="CSS unit converter" className="rounded-3xl border border-line bg-surface p-5 shadow-md sm:p-8">
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <Select id={`${uid}-from`} label="From" value={from} onChange={setFrom} />
        <button
          type="button"
          aria-label="Swap units"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          className="grid size-14 place-items-center rounded-xl border border-line-strong bg-surface text-ink transition-colors hover:bg-surface-2"
        >
          <ArrowLeftRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <Select id={`${uid}-to`} label="To" value={to} onChange={setTo} />
      </div>

      <div className="mt-5 space-y-2">
        <label htmlFor={`${uid}-v`} className="text-sm font-medium text-muted">
          Value ({from})
        </label>
        <input
          id={`${uid}-v`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={field}
        />
      </div>

      {(needsBase || needsVh || needsVw) && (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {needsBase && (
            <ContextField
              id={`${uid}-b`}
              label="Base font size in px"
              hint="Browsers default to 16px. Change it if your html font-size is different."
              value={base}
              onChange={setBase}
              presets={BASE_SIZES}
            />
          )}
          {needsVh && (
            <ContextField
              id={`${uid}-h`}
              label="Viewport height in px"
              hint="Use the inner height of the screen or browser window you design for."
              value={vp}
              onChange={setVp}
              presets={SCREEN_HEIGHTS}
            />
          )}
          {needsVw && (
            <ContextField
              id={`${uid}-w`}
              label="Viewport width in px"
              hint="Use the inner width of the screen or browser window you design for."
              value={vw}
              onChange={setVw}
              presets={SCREEN_WIDTHS}
            />
          )}
        </div>
      )}

      <div className="mt-6 rounded-2xl bg-accent-soft p-5">
        <p className="text-sm text-muted">Result</p>
        <p aria-live="polite" className="mt-1 break-all font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {output || "—"}
        </p>
        <p className="mt-2 font-mono text-xs text-muted">
          {invalidContext ? "Enter a value greater than 0." : formula(from, to, { base: base.trim(), vh: vp.trim(), vw: vw.trim() })}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <CopyToClipboard value={output} label={`Copy ${to} value`} />
      </div>
    </section>
  );
}

/** Reads ?from=px&to=rem so redirects from the old single-purpose URLs land on the right pair. Needs a Suspense boundary. */
export function CssUnitConverterFromUrl() {
  const params = useSearchParams();
  const from = params.get("from");
  const to = params.get("to");
  const f = isUnit(from) ? from : undefined;
  const t = isUnit(to) ? to : undefined;
  return <CssUnitConverter key={`${f}-${t}`} initialFrom={f} initialTo={t} />;
}
