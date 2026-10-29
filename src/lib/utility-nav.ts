import type { IconName } from "./tools";

/** Listing for the header, footer, home page and sitemap. Page content lives in utility-content.ts. */
export interface UtilityNav {
  slug: string;
  name: string;
  shortDescription: string;
  icon: IconName;
  /** Shows a "New" chip on the home page card. */
  isNew?: boolean;
}

export const utilityNav: UtilityNav[] = [
  {
    slug: "ai-humanizer",
    name: "AI Humanizer",
    shortDescription: "Rewrite AI-generated text so it sounds natural, human and on-tone.",
    icon: "sparkles",
    isNew: true,
  },
  {
    slug: "bg-remover",
    name: "Background Remover",
    shortDescription: "Remove an image background and download a transparent PNG, right in your browser.",
    icon: "eraser",
    isNew: true,
  },
  {
    slug: "image-flipper",
    name: "Image Flipper & Rotator",
    shortDescription: "Flip, mirror and rotate an image, then download it. Nothing is uploaded.",
    icon: "flip",
    isNew: true,
  },
  {
    slug: "image-color-picker",
    name: "Image Color Picker",
    shortDescription: "Click anywhere on an image to get its exact HEX and RGB color.",
    icon: "pipette",
    isNew: true,
  },
  {
    slug: "css-unit-converter",
    name: "CSS Unit Converter",
    shortDescription: "Convert between px, rem, vh and vw with your own base font size or viewport size.",
    icon: "code",
  },
  {
    slug: "color-converter",
    name: "Color Converter",
    shortDescription: "Convert HEX to RGB and back with a live preview and color picker.",
    icon: "palette",
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    shortDescription: "Count words, characters, sentences and paragraphs as you type.",
    icon: "type",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    shortDescription: "Create strong random passwords in your browser, never sent anywhere.",
    icon: "key",
  },
];
