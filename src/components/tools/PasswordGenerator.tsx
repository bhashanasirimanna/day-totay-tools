"use client";

import { useEffect, useId, useState } from "react";
import { RefreshCw } from "lucide-react";
import { CopyToClipboard } from "../CopyToClipboard";

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
} as const;

type SetKey = keyof typeof SETS;

const OPTIONS: { key: SetKey; label: string; sample: string }[] = [
  { key: "upper", label: "Uppercase", sample: "A–Z" },
  { key: "lower", label: "Lowercase", sample: "a–z" },
  { key: "numbers", label: "Numbers", sample: "0–9" },
  { key: "symbols", label: "Symbols", sample: "!@#$" },
];

/** Uniform random integer in [0, max) using rejection sampling, so there is no modulo bias. */
function randomInt(max: number) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % max;
}

function generate(length: number, enabled: Record<SetKey, boolean>) {
  const active = (Object.keys(SETS) as SetKey[]).filter((k) => enabled[k]).map((k) => SETS[k]);
  if (!active.length) return "";
  const pool = active.join("");
  // Guarantee one character from every selected set, then fill the rest from the full pool.
  const chars = active.map((set) => set[randomInt(set.length)]);
  while (chars.length < length) chars.push(pool[randomInt(pool.length)]);
  // Fisher-Yates shuffle so the guaranteed characters don't sit at the front.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, length).join("");
}

function strength(length: number, poolSize: number) {
  const bits = Math.round(length * Math.log2(Math.max(poolSize, 2)));
  if (bits < 40) return { label: "Weak", bits, pct: 25, color: "bg-danger" };
  if (bits < 60) return { label: "Fair", bits, pct: 50, color: "bg-warn-ink" };
  if (bits < 90) return { label: "Strong", bits, pct: 75, color: "bg-accent" };
  return { label: "Very strong", bits, pct: 100, color: "bg-accent" };
}

export function PasswordGenerator() {
  const uid = useId();
  const [length, setLength] = useState(16);
  const [enabled, setEnabled] = useState<Record<SetKey, boolean>>({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  // Empty on the server: the password is random, so it is created after hydration.
  const [password, setPassword] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPassword(generate(16, { upper: true, lower: true, numbers: true, symbols: true }));
  }, []);

  const poolSize = OPTIONS.reduce((n, o) => n + (enabled[o.key] ? SETS[o.key].length : 0), 0);
  const s = strength(length, poolSize);
  const activeCount = OPTIONS.filter((o) => enabled[o.key]).length;

  function update(nextLength: number, nextEnabled: Record<SetKey, boolean>) {
    setLength(nextLength);
    setEnabled(nextEnabled);
    setPassword(generate(nextLength, nextEnabled));
  }

  return (
    <section
      aria-label="Password generator"
      className="rounded-3xl border border-line bg-surface p-5 shadow-md sm:p-8"
    >
      <div className="flex items-stretch gap-3">
        <output
          aria-live="polite"
          className="flex min-h-16 min-w-0 flex-1 items-center break-all rounded-xl border border-line-strong bg-surface-2 px-4 py-3 font-mono text-xl text-ink sm:text-2xl"
        >
          {password || "…"}
        </output>
        <button
          type="button"
          onClick={() => setPassword(generate(length, enabled))}
          aria-label="Generate a new password"
          className="inline-flex w-14 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-surface text-ink transition-colors hover:bg-surface-2"
        >
          <RefreshCw size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4" aria-label={`Password strength: ${s.label}`}>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className={`h-full rounded-full transition-all duration-300 ${s.color}`}
            style={{ width: `${s.pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted">
          {s.label} · about {s.bits} bits of entropy
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <label htmlFor={`${uid}-len`} className="text-sm font-medium text-muted">
            Length
          </label>
          <span className="font-display text-2xl tabular-nums">{length}</span>
        </div>
        <input
          id={`${uid}-len`}
          type="range"
          min={4}
          max={64}
          value={length}
          onChange={(e) => update(Number(e.target.value), enabled)}
          className="mt-2 w-full accent-[var(--accent)]"
        />
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-muted">Include</legend>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {OPTIONS.map((o) => {
            const checked = enabled[o.key];
            return (
              <label
                key={o.key}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line-strong px-3 transition-colors hover:bg-surface-2 has-[:checked]:border-accent has-[:checked]:bg-accent-soft"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  // The last selected set can't be unchecked, otherwise there would be nothing to generate from.
                  disabled={checked && activeCount === 1}
                  onChange={(e) => update(length, { ...enabled, [o.key]: e.target.checked })}
                  className="size-4 accent-[var(--accent)]"
                />
                <span className="text-sm">
                  {o.label}
                  <span className="ml-1.5 text-xs text-muted">{o.sample}</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-wrap gap-3">
        <CopyToClipboard value={password} label="Copy password" toastText="Password copied!" />
        <button
          type="button"
          onClick={() => setPassword(generate(length, enabled))}
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-line-strong bg-surface px-5 text-[15px] font-medium transition-colors hover:bg-surface-2"
        >
          <RefreshCw size={18} strokeWidth={1.5} aria-hidden="true" />
          Generate new
        </button>
      </div>
    </section>
  );
}
