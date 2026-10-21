"use client";

import { useId, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import {
  categories,
  convert,
  formatNumber,
  type CategoryId,
} from "@/lib/converters";

interface Props {
  category: CategoryId;
  defaultFrom: string;
  defaultTo: string;
  defaultValue?: string;
}

type Side = "a" | "b";

const field =
  "h-14 w-full rounded-xl border border-line-strong bg-surface px-4 text-lg text-ink shadow-sm transition-colors placeholder:text-muted/60 hover:border-ink/40 focus:border-accent";

/** Parses user text; returns null for empty or half-typed input such as "-" or "1.". */
function parse(text: string): number | null {
  const t = text.trim();
  if (t === "" || t === "-" || t === ".") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function DynamicConverter({
  category,
  defaultFrom,
  defaultTo,
  defaultValue = "1",
}: Props) {
  const uid = useId();
  const { units } = categories[category];

  const compute = (text: string, from: string, to: string) => {
    const n = parse(text);
    return n === null ? "" : formatNumber(convert(category, n, from, to));
  };

  const [unitA, setUnitA] = useState(defaultFrom);
  const [unitB, setUnitB] = useState(defaultTo);
  const [valueA, setValueA] = useState(defaultValue);
  const [valueB, setValueB] = useState(() =>
    compute(defaultValue, defaultFrom, defaultTo),
  );

  // Every edit recalculates the *opposite* field, so the two stay bound without loops.
  function editValue(side: Side, text: string) {
    if (side === "a") {
      setValueA(text);
      setValueB(compute(text, unitA, unitB));
    } else {
      setValueB(text);
      setValueA(compute(text, unitB, unitA));
    }
  }

  // Changing a dropdown keeps that side's number and recalculates the other side.
  function editUnit(side: Side, unit: string) {
    if (side === "a") {
      setUnitA(unit);
      setValueB(compute(valueA, unit, unitB));
    } else {
      setUnitB(unit);
      setValueA(compute(valueB, unit, unitA));
    }
  }

  function swap() {
    setUnitA(unitB);
    setUnitB(unitA);
    setValueA(valueB);
    setValueB(valueA);
  }

  const symbolA = units.find((u) => u.id === unitA)?.symbol;
  const symbolB = units.find((u) => u.id === unitB)?.symbol;
  const summary =
    valueA !== "" && valueB !== ""
      ? `${valueA} ${symbolA} = ${valueB} ${symbolB}`
      : "Enter a number to convert.";

  const renderSide = (side: Side) => {
    const value = side === "a" ? valueA : valueB;
    const unit = side === "a" ? unitA : unitB;
    return (
      <div className="space-y-2">
        <label
          htmlFor={`${uid}-${side}-value`}
          className="text-sm font-medium text-muted"
        >
          {side === "a" ? "From" : "To"}
        </label>
        <input
          id={`${uid}-${side}-value`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => editValue(side, e.target.value)}
          placeholder="0"
          className={field}
        />
        <select
          aria-label={`${side === "a" ? "From" : "To"} unit`}
          value={unit}
          onChange={(e) => editUnit(side, e.target.value)}
          className={`${field} h-12 cursor-pointer text-base`}
        >
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <section
      aria-label={`${category} converter`}
      className="rounded-3xl border border-line bg-surface p-5 shadow-md sm:p-8"
    >
      <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
        {renderSide("a")}
        <button
          type="button"
          onClick={swap}
          aria-label="Swap units"
          className="mx-auto flex size-12 items-center justify-center rounded-full border border-line-strong bg-surface-2 text-ink transition-colors hover:bg-accent-soft md:mt-7"
        >
          <ArrowLeftRight size={18} strokeWidth={1.5} className="rotate-90 md:rotate-0" aria-hidden="true" />
        </button>
        {renderSide("b")}
      </div>
      <p
        aria-live="polite"
        className="mt-6 rounded-xl bg-accent-soft px-4 py-3 text-center font-display text-2xl tracking-tight text-ink"
      >
        {summary}
      </p>
    </section>
  );
}
