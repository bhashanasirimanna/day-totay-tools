/**
 * Plain-text sanitizing for AI output. Shared by the API route and the browser, so the text is
 * cleaned once on the server and again on arrival and before copying.
 */

// Em dash, horizontal bar, two-em and three-em dashes, small em dash.
const EM_DASHES = /\s*[\u2014\u2015\u2E3A\u2E3B\uFE58]\s*/g;
// En dash on its own: a spoken pause, so it becomes a comma too.
const EN_DASH = /\s*\u2013\s*/g;
// Unicode hyphens and the minus sign that look like "-": hyphen, non-breaking hyphen, figure dash, minus, small and fullwidth hyphen-minus.
const LOOKALIKE_HYPHEN = /[\u2010\u2011\u2012\u2212\uFE63\uFF0D]/g;
// Soft hyphen and zero-width characters are invisible but show up in pasted text.
const INVISIBLE = /[\u00AD\u200B\u200C\u200D\u2060\uFEFF]/g;
const ODD_SPACES = /[\u00A0\u2002-\u200A\u202F\u205F\u3000]/g;

// Emoji: pictographs, regional-indicator flags, skin-tone modifiers, variation selector, keycap enclosure.
const EMOJI = /\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]|\p{Emoji_Modifier}|\uFE0F|\u20E3/gu;
// Extended_Pictographic also covers these ordinary text symbols, which are not emoji in prose.
const KEEP_SYMBOLS = new Set(["\u00A9", "\u00AE", "\u2122"]);

/** Removes emoji and leaves surrounding words and spacing tidy. */
export function removeEmojis(text: string): string {
  return text
    .replace(EMOJI, (m) => (KEEP_SYMBOLS.has(m) ? m : ""))
    .replace(/[ \t]{2,}/g, " ")
    .replace(/^[ \t]+/gm, "");
}

/** Replaces special dashes and hyphens with plain ASCII ones. Dashes between numbers become "-", sentence dashes become a comma. */
export function sanitizeDashes(text: string): string {
  return text
    .replace(INVISIBLE, "")
    .replace(ODD_SPACES, " ")
    .replace(LOOKALIKE_HYPHEN, "-")
    .replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, "$1-$2")
    // An en dash tight between two words joins them ("well–known"), so it becomes a space, not a pause.
    .replace(/([^\W\d_])–([^\W\d_])/gu, "$1 $2")
    .replace(EM_DASHES, ", ")
    .replace(EN_DASH, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/,\s*([.!?:;])/g, "$1");
}

/**
 * Removes every hyphen from the text. Compound words split into two words ("AI-generated" becomes
 * "AI generated"), number ranges read as "5 to 10", longer number chains (dates, phone numbers) become
 * spaces, and a leading minus before a digit becomes the word "minus".
 * Run after sanitizeDashes so Unicode hyphens are already plain "-".
 */
export function removeHyphens(text: string): string {
  return text
    .replace(/\d+(?:-\d+){2,}/g, (m) => m.split("-").join(" "))
    .replace(/(\d)-(\d)/g, "$1 to $2")
    .replace(/(^|[\s(])-(?=\d)/g, "$1minus ")
    .replace(/^[ \t]*-[ \t]+/gm, "")
    .replace(/-/g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ +([,.!?;:])/g, "$1");
}

/** Removes markdown markup (bold, italics, headings, code ticks, links) and leaves the words. */
export function stripMarkdown(text: string): string {
  return text
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(^|[^\w*])\*(?!\s)([^*\n]+?)\*(?!\w)/g, "$1$2")
    .replace(/(^|[^\w_])_(?!\s)([^_\n]+?)_(?!\w)/g, "$1$2")
    .replace(/`{1,3}([^`]*)`{1,3}/g, "$1")
    .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, "$1");
}

/** Clean plain text: no markdown, no emoji, no dashes or hyphens of any kind, no invisible characters. */
export function toPlainText(text: string): string {
  return removeHyphens(sanitizeDashes(removeEmojis(stripMarkdown(text)))).replace(/[ \t]+\n/g, "\n").trim();
}
