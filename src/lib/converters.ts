export type CategoryId = "length" | "weight" | "temperature" | "area";

export interface Unit {
  id: string;
  /** Dropdown label, e.g. "Centimeters (cm)". */
  label: string;
  /** Short symbol used in tables and prose. */
  symbol: string;
  /** Value in this unit -> base unit. */
  toBase: (v: number) => number;
  /** Base unit -> value in this unit. */
  fromBase: (v: number) => number;
}

export interface Category {
  id: CategoryId;
  baseUnit: string;
  units: Unit[];
}

/** Linear units: `factor` is how many base units make one of this unit. */
const linear = (id: string, label: string, symbol: string, factor: number): Unit => ({
  id,
  label,
  symbol,
  toBase: (v) => v * factor,
  fromBase: (v) => v / factor,
});

export const categories: Record<CategoryId, Category> = {
  // Base unit: meter. All factors are exact international definitions.
  length: {
    id: "length",
    baseUnit: "m",
    units: [
      linear("mm", "Millimeters (mm)", "mm", 0.001),
      linear("cm", "Centimeters (cm)", "cm", 0.01),
      linear("m", "Meters (m)", "m", 1),
      linear("km", "Kilometers (km)", "km", 1000),
      linear("in", "Inches (in)", "in", 0.0254),
      linear("ft", "Feet (ft)", "ft", 0.3048),
      linear("yd", "Yards (yd)", "yd", 0.9144),
      linear("mi", "Miles (mi)", "mi", 1609.344),
    ],
  },
  // Base unit: kilogram.
  weight: {
    id: "weight",
    baseUnit: "kg",
    units: [
      linear("mg", "Milligrams (mg)", "mg", 1e-6),
      linear("g", "Grams (g)", "g", 0.001),
      linear("kg", "Kilograms (kg)", "kg", 1),
      linear("t", "Metric tons (t)", "t", 1000),
      linear("oz", "Ounces (oz)", "oz", 0.028349523125),
      linear("lb", "Pounds (lb)", "lb", 0.45359237),
      linear("st", "Stone (st)", "st", 6.35029318),
    ],
  },
  // Base unit: degrees Celsius. Not linear through zero, so each unit carries its own formulas.
  temperature: {
    id: "temperature",
    baseUnit: "°C",
    units: [
      linear("c", "Celsius (°C)", "°C", 1),
      {
        id: "f",
        label: "Fahrenheit (°F)",
        symbol: "°F",
        toBase: (v) => ((v - 32) * 5) / 9,
        fromBase: (v) => (v * 9) / 5 + 32,
      },
      {
        id: "k",
        label: "Kelvin (K)",
        symbol: "K",
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    ],
  },
  // Base unit: square meter.
  area: {
    id: "area",
    baseUnit: "m²",
    units: [
      linear("mm2", "Square millimeters (mm²)", "mm²", 1e-6),
      linear("cm2", "Square centimeters (cm²)", "cm²", 1e-4),
      linear("m2", "Square meters (m²)", "m²", 1),
      linear("ha", "Hectares (ha)", "ha", 10000),
      linear("km2", "Square kilometers (km²)", "km²", 1e6),
      linear("in2", "Square inches (in²)", "in²", 0.00064516),
      linear("ft2", "Square feet (ft²)", "ft²", 0.09290304),
      linear("yd2", "Square yards (yd²)", "yd²", 0.83612736),
      linear("ac", "Acres (ac)", "ac", 4046.8564224),
      linear("mi2", "Square miles (mi²)", "mi²", 2589988.110336),
    ],
  },
};

export function getUnit(category: CategoryId, unitId: string): Unit {
  const unit = categories[category].units.find((u) => u.id === unitId);
  if (!unit) throw new Error(`Unknown ${category} unit: ${unitId}`);
  return unit;
}

/** Convert through the category's base unit: from -> base -> to. */
export function convert(
  category: CategoryId,
  value: number,
  fromId: string,
  toId: string,
): number {
  if (fromId === toId) return value;
  return getUnit(category, toId).fromBase(getUnit(category, fromId).toBase(value));
}

/**
 * Round to 10 significant digits (hides float noise such as 0.30000000000000004)
 * and print without trailing zeros. Never uses thousands separators, so the
 * output can be pasted straight back into an input.
 */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return "";
  const rounded = Number(n.toPrecision(10));
  if (rounded === 0) return "0";
  const abs = Math.abs(rounded);
  if (abs >= 1e15 || abs < 1e-9) return rounded.toExponential(4);
  return rounded.toString();
}

/** Display rounding for static tables: up to `digits` decimals, no trailing zeros. */
export function formatFixed(n: number, digits = 4): string {
  return Number(n.toFixed(digits)).toLocaleString("en-US", {
    maximumFractionDigits: digits,
  });
}
