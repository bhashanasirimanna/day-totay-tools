import { convert, formatFixed, type CategoryId } from "./converters";

export interface PopularConversion {
  id: string;
  /** H3 text, written as the phrase people search for. */
  title: string;
  /** Formula chip under the explanation. */
  formula: string;
  body: string;
}

export interface QuickTable {
  caption: string;
  intro?: string;
  from: string;
  to: string[];
  values: number[];
  /** Optional extra column computed from the value in the `from` unit. */
  extra?: { header: string; format: (v: number) => string };
}

export interface ConverterContent {
  category: CategoryId;
  slug: string;
  name: string;
  /** <title>; the site template appends the brand. */
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  intro: string;
  defaultFrom: string;
  defaultTo: string;
  popularIntro: string;
  popular: PopularConversion[];
  quickIntro: string;
  quickTables: QuickTable[];
  referenceIntro: string;
  reference: [string, string][];
  faqs: { q: string; a: string }[];
}

// Every figure in the copy comes from the same unit table the live tool uses, so text can't drift from the maths.
const n = (cat: CategoryId, v: number, from: string, to: string, digits = 2) =>
  formatFixed(convert(cat, v, from, to), digits);

/** 175 cm -> `5′ 8.9″` */
function feetAndInches(cm: number) {
  let ft = Math.floor(convert("length", cm, "cm", "ft") + 1e-9);
  let inch = Math.round((convert("length", cm, "cm", "in") - ft * 12) * 10) / 10;
  if (inch >= 12) {
    ft += 1;
    inch = 0;
  }
  return `${ft}′ ${inch}″`;
}

const length: ConverterContent = {
  category: "length",
  slug: "length-converter",
  name: "Length Converter",
  seoTitle: "Length Converter: CM to Feet, Inches to CM",
  seoDescription:
    "Free length converter with instant results. Convert cm to feet, inches to cm, meters to yards, km to miles and more, with formulas and conversion tables.",
  keywords: ["length converter", "cm to feet", "cm to feet converter", "inches to cm", "meters to yards", "km to miles", "feet to meters"],
  intro:
    "Convert between centimeters, inches, feet, meters, yards, kilometers and miles. Type in either box or change a unit and the other side updates as you go.",
  defaultFrom: "cm",
  defaultTo: "ft",
  popularIntro:
    "The converter above handles any pair of units. These are the conversions people look up most, with the formula behind each so you can check the maths yourself.",
  popular: [
    {
      id: "cm-to-feet",
      title: "CM to Feet Converter",
      formula: "feet = cm ÷ 30.48",
      body: `To convert centimeters to feet, divide the length in cm by 30.48, because one foot is exactly 30.48 cm. A height of 170 cm is ${n("length", 170, "cm", "ft")} ft, or ${feetAndInches(170)} in feet and inches. For feet and inches, take the whole number of feet and multiply the remainder by 12.`,
    },
    {
      id: "inches-to-cm",
      title: "Inches to CM",
      formula: "cm = inches × 2.54",
      body: `To convert inches to centimeters, multiply the inches by 2.54. This factor is exact by definition, so there is no rounding in the formula itself. A 15.6-inch laptop screen measures ${n("length", 15.6, "in", "cm", 1)} cm across the diagonal. To go the other way, divide centimeters by 2.54.`,
    },
    {
      id: "meters-to-yards",
      title: "Meters to Yards",
      formula: "yards = meters ÷ 0.9144",
      body: `One yard is exactly 0.9144 meters, so divide meters by 0.9144, or multiply by 1.0936, to get yards. A 100 m sprint is ${n("length", 100, "m", "yd")} yards. Yards are still used for sports fields and fabric, which is why this is a common conversion.`,
    },
    {
      id: "feet-to-meters",
      title: "Feet to Meters",
      formula: "meters = feet × 0.3048",
      body: `Multiply feet by 0.3048 to get meters. A 6 ft doorway is ${n("length", 6, "ft", "m", 3)} m high. Aviation altitudes and room dimensions are often given in feet, so this one comes up outside of height conversions too.`,
    },
    {
      id: "km-to-miles",
      title: "KM to Miles",
      formula: "miles = km ÷ 1.609344",
      body: `Divide kilometers by 1.609344 to get miles. A 10 km run is ${n("length", 10, "km", "mi")} miles. A rough mental shortcut is to multiply by 0.62.`,
    },
  ],
  quickIntro:
    "Common values for centimeters in inches and feet. Heights are the most searched use, so the table includes the usual range from 150 cm to 200 cm.",
  quickTables: [
    {
      caption: "Centimeters converted to inches and feet",
      from: "cm",
      to: ["in", "ft"],
      values: [1, 5, 10, 25, 50, 100, 150, 160, 170, 175, 180, 190, 200],
      extra: { header: "Feet & inches", format: feetAndInches },
    },
  ],
  referenceIntro:
    "Metric units scale by powers of ten, while imperial and US customary units do not. This is the reference behind every conversion on this page.",
  reference: [
    ["1 inch", "2.54 cm"],
    ["1 foot", "12 inches = 0.3048 m"],
    ["1 yard", "3 feet = 0.9144 m"],
    ["1 mile", "1,760 yards = 1,609.344 m"],
    ["1 kilometer", "1,000 m = 0.6214 mi"],
  ],
  faqs: [
    {
      q: "How do I convert cm to feet?",
      a: `Divide the number of centimeters by 30.48. For example, 180 cm ÷ 30.48 = ${n("length", 180, "cm", "ft")} feet, which is ${feetAndInches(180)}. You can also type the value into the converter above and the result updates instantly.`,
    },
    {
      q: "How many cm are in a foot?",
      a: "One foot is exactly 30.48 centimeters. This is the international definition: 1 foot = 0.3048 meters.",
    },
    {
      q: "How do I convert inches to cm?",
      a: `Multiply the number of inches by 2.54. For example, 12 inches × 2.54 = ${n("length", 12, "in", "cm")} cm. One inch is defined as exactly 2.54 centimeters.`,
    },
    {
      q: "How many yards are in a meter?",
      a: `One meter equals ${n("length", 1, "m", "yd", 4)} yards. Multiply meters by 1.0936 to get yards, or divide yards by 1.0936 to get meters.`,
    },
    {
      q: "How many kilometers are in a mile?",
      a: `One mile equals ${n("length", 1, "mi", "km", 3)} kilometers. Multiply miles by 1.609344 to get kilometers.`,
    },
    {
      q: "Is this length converter accurate?",
      a: "Yes. Every unit is converted through the meter using the exact international definitions (1 inch = 2.54 cm, 1 foot = 0.3048 m, 1 yard = 0.9144 m, 1 mile = 1,609.344 m). Results are rounded to 10 significant digits only to hide floating-point noise.",
    },
  ],
};

const weight: ConverterContent = {
  category: "weight",
  slug: "weight-converter",
  name: "Weight Converter",
  seoTitle: "Weight Converter: KG to Lbs, Pounds to KG",
  seoDescription:
    "Free weight converter with instant results. Convert kg to lbs, pounds to kg, grams to ounces and stone to kg, with formulas and conversion tables.",
  keywords: ["weight converter", "kg to lbs", "lbs to kg", "pounds to kg", "grams to ounces", "stone to kg", "mass converter"],
  intro:
    "Convert between kilograms, pounds, ounces, grams, stone and metric tons. Type in either box or change a unit and the other side updates as you go.",
  defaultFrom: "kg",
  defaultTo: "lb",
  popularIntro:
    "The converter above handles any pair of weight units. These are the conversions people look up most, with the formula behind each.",
  popular: [
    {
      id: "kg-to-lbs",
      title: "KG to Lbs Converter",
      formula: "pounds = kg × 2.20462",
      body: `To convert kilograms to pounds, multiply the weight in kg by 2.20462, because one kilogram is about 2.20462 pounds. A 70 kg person weighs ${n("weight", 70, "kg", "lb")} lbs. A quick mental estimate is to double the kilograms and add 10 percent.`,
    },
    {
      id: "lbs-to-kg",
      title: "Pounds to KG",
      formula: "kg = pounds × 0.45359237",
      body: `To convert pounds to kilograms, multiply by 0.45359237, which is the exact definition of the pound. A 150 lb weight is ${n("weight", 150, "lb", "kg")} kg. Dividing pounds by 2.2 gives a close approximation.`,
    },
    {
      id: "grams-to-ounces",
      title: "Grams to Ounces",
      formula: "ounces = grams ÷ 28.349523",
      body: `One ounce is 28.349523 grams, so divide grams by 28.349523 to get ounces. A 100 g bar of chocolate is ${n("weight", 100, "g", "oz")} oz. This is the conversion you need for most recipes that mix metric and US measures.`,
    },
    {
      id: "ounces-to-grams",
      title: "Ounces to Grams",
      formula: "grams = ounces × 28.349523",
      body: `Multiply ounces by 28.349523 to get grams. A 16 oz pack is ${n("weight", 16, "oz", "g")} g, which is the same as one pound. Postal services quote parcel limits in ounces, so this one is handy for shipping.`,
    },
    {
      id: "stone-to-kg",
      title: "Stone to KG",
      formula: "kg = stone × 6.35029",
      body: `One stone is 14 pounds, or 6.35029 kg. Multiply stone by 6.35029 to get kilograms. A body weight of 11 stone is ${n("weight", 11, "st", "kg")} kg. Stone is still the everyday body-weight unit in the UK and Ireland.`,
    },
  ],
  quickIntro: "Common values for kilograms in pounds and ounces, and pounds in kilograms.",
  quickTables: [
    {
      caption: "Kilograms converted to pounds and ounces",
      from: "kg",
      to: ["lb", "oz"],
      values: [0.5, 1, 2, 5, 10, 20, 50, 60, 70, 80, 90, 100],
    },
    {
      caption: "Pounds converted to kilograms and stone",
      from: "lb",
      to: ["kg", "st"],
      values: [1, 5, 10, 25, 50, 100, 120, 140, 160, 180, 200],
    },
  ],
  referenceIntro: "These are the exact definitions behind every weight conversion on this page.",
  reference: [
    ["1 pound", "16 ounces = 0.45359237 kg"],
    ["1 ounce", "28.349523125 g"],
    ["1 stone", "14 pounds = 6.35029318 kg"],
    ["1 kilogram", "1,000 g = 2.20462 lb"],
    ["1 metric ton", "1,000 kg = 2,204.62 lb"],
  ],
  faqs: [
    {
      q: "How do I convert kg to lbs?",
      a: `Multiply the kilograms by 2.20462. For example, 80 kg × 2.20462 = ${n("weight", 80, "kg", "lb")} lbs.`,
    },
    {
      q: "How do I convert pounds to kg?",
      a: `Multiply the pounds by 0.45359237, or divide by 2.20462. For example, 200 lbs = ${n("weight", 200, "lb", "kg")} kg.`,
    },
    {
      q: "How many grams are in an ounce?",
      a: "One ounce is exactly 28.349523125 grams, usually rounded to 28.35 g.",
    },
    {
      q: "How many pounds are in a stone?",
      a: `One stone is 14 pounds, which equals ${n("weight", 1, "st", "kg", 3)} kg.`,
    },
    {
      q: "Is weight the same as mass?",
      a: "In everyday use the two are interchangeable, and these units measure mass. Strictly, weight is the force of gravity on a mass, but kilograms and pounds are used for both on Earth.",
    },
  ],
};

const temperature: ConverterContent = {
  category: "temperature",
  slug: "temperature-converter",
  name: "Temperature Converter",
  seoTitle: "Temperature Converter: °C to °F, °F to °C",
  seoDescription:
    "Free temperature converter. Convert Celsius to Fahrenheit, Fahrenheit to Celsius and Kelvin instantly, with formulas and a quick conversion table.",
  keywords: ["temperature converter", "celsius to fahrenheit", "fahrenheit to celsius", "c to f", "f to c", "celsius to kelvin"],
  intro:
    "Convert between Celsius, Fahrenheit and Kelvin. Type in either box or change a unit and the other side updates as you go.",
  defaultFrom: "c",
  defaultTo: "f",
  popularIntro:
    "Temperature scales don't share a zero point, so a simple multiplier is not enough. Here are the formulas for the conversions people use most.",
  popular: [
    {
      id: "celsius-to-fahrenheit",
      title: "Celsius to Fahrenheit",
      formula: "°F = (°C × 9/5) + 32",
      body: `Multiply the Celsius temperature by 9/5 (1.8), then add 32. Body temperature of 37 °C is ${n("temperature", 37, "c", "f", 1)} °F, and a 20 °C room is ${n("temperature", 20, "c", "f", 0)} °F. The two scales meet at −40, where both read the same.`,
    },
    {
      id: "fahrenheit-to-celsius",
      title: "Fahrenheit to Celsius",
      formula: "°C = (°F − 32) × 5/9",
      body: `Subtract 32 from the Fahrenheit temperature, then multiply by 5/9. An oven set to 350 °F is ${n("temperature", 350, "f", "c", 0)} °C, and a 72 °F day is ${n("temperature", 72, "f", "c", 1)} °C.`,
    },
    {
      id: "celsius-to-kelvin",
      title: "Celsius to Kelvin",
      formula: "K = °C + 273.15",
      body: `Add 273.15 to the Celsius value. Kelvin steps are the same size as Celsius steps, so only the zero point differs. Water freezes at 273.15 K and boils at ${n("temperature", 100, "c", "k", 2)} K at sea level.`,
    },
    {
      id: "fahrenheit-to-kelvin",
      title: "Fahrenheit to Kelvin",
      formula: "K = (°F − 32) × 5/9 + 273.15",
      body: `Convert to Celsius first, then add 273.15. Room temperature of 68 °F is ${n("temperature", 68, "f", "k", 2)} K. Kelvin is mostly used in science, where it starts at absolute zero (0 K = −273.15 °C).`,
    },
  ],
  quickIntro: "Common temperatures in Celsius and Fahrenheit, from freezing to boiling.",
  quickTables: [
    {
      caption: "Celsius converted to Fahrenheit and Kelvin",
      from: "c",
      to: ["f", "k"],
      values: [-40, -20, 0, 10, 20, 25, 30, 37, 100, 180, 200],
    },
    {
      caption: "Fahrenheit converted to Celsius",
      from: "f",
      to: ["c"],
      values: [0, 32, 50, 68, 72, 98.6, 212, 350, 400, 450],
    },
  ],
  referenceIntro: "Key reference points that are useful for checking any result.",
  reference: [
    ["Absolute zero", "0 K = −273.15 °C = −459.67 °F"],
    ["Water freezes", "0 °C = 32 °F = 273.15 K"],
    ["Average body temperature", "37 °C = 98.6 °F"],
    ["Water boils (sea level)", "100 °C = 212 °F = 373.15 K"],
    ["Scales are equal", "−40 °C = −40 °F"],
  ],
  faqs: [
    {
      q: "How do I convert Celsius to Fahrenheit?",
      a: `Multiply by 1.8 and add 32. For example, 25 °C × 1.8 + 32 = ${n("temperature", 25, "c", "f", 0)} °F.`,
    },
    {
      q: "How do I convert Fahrenheit to Celsius?",
      a: `Subtract 32 and divide by 1.8. For example, (98.6 − 32) ÷ 1.8 = ${n("temperature", 98.6, "f", "c", 0)} °C.`,
    },
    {
      q: "What is 0 degrees Celsius in Fahrenheit?",
      a: "0 °C is 32 °F, the freezing point of water.",
    },
    {
      q: "At what temperature are Celsius and Fahrenheit equal?",
      a: "At −40. Both scales read −40 at that point.",
    },
    {
      q: "How do I convert Celsius to Kelvin?",
      a: "Add 273.15 to the Celsius value. Kelvin has no degree sign, so write it as 300 K, not 300 °K.",
    },
  ],
};

const area: ConverterContent = {
  category: "area",
  slug: "area-converter",
  name: "Area Converter",
  seoTitle: "Area Converter: Sq Ft to Sq M, Acres to Hectares",
  seoDescription:
    "Free area converter. Convert square feet to square meters, acres to hectares, square km to square miles and more, with formulas and tables.",
  keywords: ["area converter", "square feet to square meters", "sq ft to sq m", "acres to hectares", "acres to square feet", "square km to square miles"],
  intro:
    "Convert between square feet, square meters, acres, hectares, square kilometers and more. Type in either box or change a unit and the other side updates as you go.",
  defaultFrom: "ft2",
  defaultTo: "m2",
  popularIntro:
    "The converter above handles any pair of area units. These are the conversions people look up most, with the formula behind each.",
  popular: [
    {
      id: "sq-ft-to-sq-m",
      title: "Square Feet to Square Meters",
      formula: "m² = ft² × 0.09290304",
      body: `Multiply square feet by 0.09290304 to get square meters. A 1,000 sq ft apartment is ${n("area", 1000, "ft2", "m2", 1)} m². Because area is length squared, the factor is 0.3048 squared, not 0.3048.`,
    },
    {
      id: "sq-m-to-sq-ft",
      title: "Square Meters to Square Feet",
      formula: "ft² = m² ÷ 0.09290304",
      body: `Divide square meters by 0.09290304, or multiply by 10.7639. A 50 m² flat is ${n("area", 50, "m2", "ft2", 0)} sq ft. Real estate listings often show both, so this is the conversion most buyers need.`,
    },
    {
      id: "acres-to-hectares",
      title: "Acres to Hectares",
      formula: "hectares = acres × 0.404686",
      body: `Multiply acres by 0.404686 to get hectares. A 10-acre plot is ${n("area", 10, "ac", "ha", 2)} ha. One hectare is 10,000 m².`,
    },
    {
      id: "acres-to-square-feet",
      title: "Acres to Square Feet",
      formula: "ft² = acres × 43,560",
      body: `One acre is exactly 43,560 square feet. Multiply acres by 43,560 to get square feet. Half an acre is ${n("area", 0.5, "ac", "ft2", 0)} sq ft, a common residential lot size in the US.`,
    },
    {
      id: "sq-km-to-sq-miles",
      title: "Square Kilometers to Square Miles",
      formula: "mi² = km² ÷ 2.589988",
      body: `Divide square kilometers by 2.589988 to get square miles. A 100 km² city covers ${n("area", 100, "km2", "mi2", 1)} sq mi. Land areas of countries and cities are normally compared with this conversion.`,
    },
  ],
  quickIntro: "Common values for square feet in square meters, and acres in hectares and square feet.",
  quickTables: [
    {
      caption: "Square feet converted to square meters and square yards",
      from: "ft2",
      to: ["m2", "yd2"],
      values: [1, 10, 50, 100, 250, 500, 750, 1000, 1500, 2000],
    },
    {
      caption: "Acres converted to hectares and square feet",
      from: "ac",
      to: ["ha", "ft2"],
      values: [0.25, 0.5, 1, 2, 5, 10, 20, 50, 100],
    },
  ],
  referenceIntro: "Exact definitions behind every area conversion on this page.",
  reference: [
    ["1 square foot", "144 sq in = 0.09290304 m²"],
    ["1 square yard", "9 sq ft = 0.83612736 m²"],
    ["1 acre", "43,560 sq ft = 4,046.8564 m²"],
    ["1 hectare", "10,000 m² = 2.47105 acres"],
    ["1 square mile", "640 acres = 2.589988 km²"],
  ],
  faqs: [
    {
      q: "How do I convert square feet to square meters?",
      a: `Multiply square feet by 0.09290304. For example, 1,200 sq ft × 0.09290304 = ${n("area", 1200, "ft2", "m2", 1)} m².`,
    },
    {
      q: "How many square feet are in an acre?",
      a: "One acre is exactly 43,560 square feet.",
    },
    {
      q: "How many acres are in a hectare?",
      a: `One hectare equals ${n("area", 1, "ha", "ac", 4)} acres.`,
    },
    {
      q: "Why isn't the square meter factor the same as the length factor?",
      a: "Area is length multiplied by length, so the factor is squared. One foot is 0.3048 m, so one square foot is 0.3048 × 0.3048 = 0.09290304 m².",
    },
    {
      q: "How many square meters are in a square kilometer?",
      a: "One square kilometer is 1,000,000 square meters.",
    },
  ],
};

export const converterContent: Record<CategoryId, ConverterContent> = {
  length,
  weight,
  temperature,
  area,
};

export function getConverterContent(slug: string): ConverterContent | undefined {
  return Object.values(converterContent).find((c) => c.slug === slug);
}
