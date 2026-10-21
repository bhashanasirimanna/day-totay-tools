import type { IconName } from "./tools";
import type { CategoryId } from "./converters";

/** Lightweight listing used by the header, footer, home page and sitemap. Page content lives in converter-content.ts. */
export interface ConverterNav {
  slug: string;
  category: CategoryId;
  name: string;
  shortDescription: string;
  icon: IconName;
}

export const converterNav: ConverterNav[] = [
  {
    slug: "length-converter",
    category: "length",
    name: "Length Converter",
    shortDescription: "Convert cm to feet, inches to cm, meters to yards, km to miles and more.",
    icon: "ruler",
  },
  {
    slug: "weight-converter",
    category: "weight",
    name: "Weight Converter",
    shortDescription: "Convert kg to lbs, pounds to kg, grams to ounces and stone instantly.",
    icon: "scale",
  },
  {
    slug: "temperature-converter",
    category: "temperature",
    name: "Temperature Converter",
    shortDescription: "Convert Celsius, Fahrenheit and Kelvin with the formula shown.",
    icon: "thermometer",
  },
  {
    slug: "area-converter",
    category: "area",
    name: "Area Converter",
    shortDescription: "Convert square feet to square meters, acres to hectares and more.",
    icon: "area",
  },
];
