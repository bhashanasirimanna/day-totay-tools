"use client";

import { useId, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CopyToClipboard } from "../CopyToClipboard";

const input =
  "h-14 w-full rounded-xl border border-line-strong bg-surface px-4 text-lg text-ink shadow-sm transition-colors placeholder:text-muted/60 hover:border-ink/40 focus:border-accent";
const picker =
  "size-14 shrink-0 cursor-pointer rounded-xl border border-line-strong bg-surface p-1";
const card = "rounded-3xl border border-line bg-surface p-5 shadow-md sm:p-8";

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Accepts #rgb, #rgba, #rrggbb and #rrggbbaa, with or without the leading #. */
function parseHex(text: string): Rgba | null {
  let h = text.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]+$/.test(h) || ![3, 4, 6, 8].includes(h.length)) return null;
  if (h.length <= 4) h = [...h].map((ch) => ch + ch).join("");
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
  return {
    r: n(0),
    g: n(2),
    b: n(4),
    a: h.length === 8 ? Math.round((n(6) / 255) * 100) / 100 : 1,
  };
}

const hx = (n: number) => n.toString(16).padStart(2, "0");
const toHex = (r: number, g: number, b: number) => `#${hx(r)}${hx(g)}${hx(b)}`;

const rgbString = ({ r, g, b, a }: Rgba) =>
  a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;

/** Color chip on a checkerboard so transparent colors stay visible. */
function Swatch({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="size-14 shrink-0 rounded-xl border border-line-strong"
      style={{
        backgroundColor: color,
        backgroundImage:
          "linear-gradient(45deg,#8883 25%,transparent 25%,transparent 75%,#8883 75%),linear-gradient(45deg,#8883 25%,transparent 25%,transparent 75%,#8883 75%)",
        backgroundSize: "12px 12px",
        backgroundPosition: "0 0, 6px 6px",
      }}
    />
  );
}

type ColorMode = "hex-to-rgb" | "rgb-to-hex";

const TABS: { mode: ColorMode; label: string }[] = [
  { mode: "hex-to-rgb", label: "HEX to RGB" },
  { mode: "rgb-to-hex", label: "RGB to HEX" },
];

export function ColorConverter({ initialMode = "hex-to-rgb" }: { initialMode?: ColorMode }) {
  const uid = useId();
  const [mode, setMode] = useState<ColorMode>(initialMode);

  return (
    <div>
      <div role="tablist" aria-label="Conversion direction" className="mb-4 inline-flex rounded-xl border border-line-strong bg-surface p-1">
        {TABS.map((t) => (
          <button
            key={t.mode}
            type="button"
            role="tab"
            id={`${uid}-${t.mode}-tab`}
            aria-selected={mode === t.mode}
            aria-controls={`${uid}-panel`}
            onClick={() => setMode(t.mode)}
            className="h-10 rounded-lg px-4 text-sm font-medium text-muted transition-colors hover:text-ink aria-selected:bg-accent aria-selected:text-accent-ink"
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-${mode}-tab`}>
        {mode === "hex-to-rgb" ? <HexToRgb /> : <RgbToHex />}
      </div>
    </div>
  );
}

/** Reads ?from=rgb&to=hex so redirects from the old single-purpose URLs land on the right direction. Needs a Suspense boundary. */
export function ColorConverterFromUrl() {
  const params = useSearchParams();
  const mode: ColorMode = params.get("from") === "rgb" ? "rgb-to-hex" : "hex-to-rgb";
  return <ColorConverter key={mode} initialMode={mode} />;
}

function HexToRgb() {
  const uid = useId();
  const [hex, setHex] = useState("#2563eb");
  const rgba = parseHex(hex);
  const output = rgba ? rgbString(rgba) : "";

  return (
    <section aria-label="HEX to RGB converter" className={card}>
      <label htmlFor={`${uid}-hex`} className="text-sm font-medium text-muted">
        HEX color
      </label>
      <div className="mt-2 flex items-center gap-3">
        <input
          id={`${uid}-hex`}
          type="text"
          autoComplete="off"
          spellCheck={false}
          value={hex}
          aria-invalid={!rgba}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#ff5733"
          className={`${input} font-mono`}
        />
        <input
          type="color"
          aria-label="Pick a color"
          value={rgba ? toHex(rgba.r, rgba.g, rgba.b) : "#000000"}
          onChange={(e) => setHex(e.target.value)}
          className={picker}
        />
      </div>
      {!rgba && (
        <p className="mt-2 text-sm text-danger">
          Enter 3, 4, 6 or 8 hex digits, such as #fff or #ff5733.
        </p>
      )}

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-accent-soft p-5">
        <Swatch color={output || "transparent"} />
        <div className="min-w-0">
          <p className="text-sm text-muted">RGB</p>
          <p
            aria-live="polite"
            className="break-all font-display text-3xl tracking-tight text-ink sm:text-4xl"
          >
            {output || "—"}
          </p>
          {rgba && (
            <p className="mt-1 font-mono text-xs text-muted">
              R {rgba.r} · G {rgba.g} · B {rgba.b}
              {rgba.a < 1 ? ` · A ${rgba.a}` : ""}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <CopyToClipboard value={output} label="Copy RGB" />
        {rgba && (
          <CopyToClipboard
            variant="secondary"
            value={`${rgba.r}, ${rgba.g}, ${rgba.b}`}
            label="Copy values only"
          />
        )}
      </div>
    </section>
  );
}

const CHANNELS = [
  { key: "r", label: "Red" },
  { key: "g", label: "Green" },
  { key: "b", label: "Blue" },
] as const;

function RgbToHex() {
  const uid = useId();
  const [vals, setVals] = useState({ r: "37", g: "99", b: "235" });

  const parsed = CHANNELS.map(({ key }) => {
    const t = vals[key].trim();
    const n = Number(t);
    return t !== "" && Number.isInteger(n) && n >= 0 && n <= 255 ? n : null;
  });
  const [r, g, b] = parsed;
  const output = r !== null && g !== null && b !== null ? toHex(r, g, b) : "";

  return (
    <section aria-label="RGB to HEX converter" className={card}>
      <div className="grid grid-cols-3 gap-3 sm:gap-5">
        {CHANNELS.map(({ key, label }, i) => (
          <div key={key} className="space-y-2">
            <label htmlFor={`${uid}-${key}`} className="text-sm font-medium text-muted">
              {label} (0–255)
            </label>
            <input
              id={`${uid}-${key}`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={vals[key]}
              aria-invalid={parsed[i] === null}
              onChange={(e) => setVals((p) => ({ ...p, [key]: e.target.value }))}
              className={input}
            />
          </div>
        ))}
      </div>
      {!output && (
        <p className="mt-2 text-sm text-danger">Each value must be a whole number from 0 to 255.</p>
      )}

      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-accent-soft p-5">
        <Swatch color={output || "transparent"} />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted">HEX</p>
          <p
            aria-live="polite"
            className="break-all font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl"
          >
            {output || "—"}
          </p>
        </div>
        <input
          type="color"
          aria-label="Pick a color"
          value={output || "#000000"}
          onChange={(e) => {
            const c = parseHex(e.target.value);
            if (c) setVals({ r: String(c.r), g: String(c.g), b: String(c.b) });
          }}
          className={picker}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <CopyToClipboard value={output} label="Copy HEX" />
        {output && (
          <CopyToClipboard variant="secondary" value={output.slice(1)} label="Copy without #" />
        )}
      </div>
    </section>
  );
}
