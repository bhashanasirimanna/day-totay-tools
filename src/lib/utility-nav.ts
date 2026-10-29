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
    slug: "image-color-picker",
    name: "Image Color Picker",
    shortDescription: "Click anywhere on an image to get its exact HEX and RGB color.",
    icon: "pipette",
    isNew: true,
  },
  {
    slug: "px-to-vh",
    name: "PX to VH",
    shortDescription: "Convert pixels to viewport height units for any screen height.",
    icon: "code",
  },
  {
    slug: "vh-to-px",
    name: "VH to PX",
    shortDescription: "Turn viewport height units into exact pixel values.",
    icon: "code",
  },
  {
    slug: "px-to-rem",
    name: "PX to REM",
    shortDescription: "Convert pixels to rem with your own base font size.",
    icon: "code",
  },
  {
    slug: "rem-to-px",
    name: "REM to PX",
    shortDescription: "Convert rem units back to pixels instantly.",
    icon: "code",
  },
  {
    slug: "hex-to-rgb",
    name: "HEX to RGB",
    shortDescription: "Convert hex color codes to RGB values with a live preview.",
    icon: "palette",
  },
  {
    slug: "rgb-to-hex",
    name: "RGB to HEX",
    shortDescription: "Convert RGB values to a hex color code with a live preview.",
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
