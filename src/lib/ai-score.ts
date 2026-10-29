/**
 * A fast, client-side heuristic that estimates how "machine-written" a text reads.
 * It is NOT a real AI detector: it looks for the surface patterns people associate with AI prose
 * (stock phrases, even sentence lengths, repeated openers, no contractions, formal vocabulary).
 * The same function scores the input and the output, so the two numbers are directly comparable.
 */

export const MIN_WORDS_FOR_SCORE = 25;

/**
 * Overused AI buzzwords and robotic phrasing, as regex sources. Longer phrases come first so they win over
 * the single words inside them. The scorer counts these and the editor highlights them, so every
 * highlighted word is one that actually pushed the score up.
 */
const AI_TERM_PATTERNS = [
  "it(?:['’]s| is) (?:important|worth|crucial|essential) to (?:note|mention|remember)(?: that)?",
  "in today['’]s (?:fast-paced |digital |modern |ever-changing )?(?:world|age|era|landscape|society)",
  "plays? an? (?:vital|crucial|key|pivotal|significant|important) role",
  "in the (?:realm|world|field) of",
  "a (?:wide|broad|vast) (?:range|array|variety) of",
  "a testament to",
  "in conclusion",
  "in summary",
  "to summari[sz]e",
  "when it comes to",
  "at the end of the day",
  "(?:overall|ultimately|additionally|furthermore|moreover)(?=,)",
  "delv(?:e|es|ed|ing)",
  "tapestry",
  "testament",
  "imperative",
  "multifaceted",
  "furthermore",
  "moreover",
  "additionally",
  "realms?",
  "beacons?",
  "paradigms?",
  "leverag(?:e|es|ed|ing)",
  "utili[sz](?:e|es|ed|ing|ation)",
  "unlock(?:s|ed|ing)?",
  "seamless(?:ly)?",
  "robust",
  "game[- ]?changers?",
  "cutting-edge",
  "landscapes?",
  "pivotal",
  "crucial(?:ly)?",
  "comprehensive",
  "holistic(?:ally)?",
  "foster(?:s|ed|ing)?",
  "elevat(?:e|es|ed|ing)",
  "streamlin(?:e|es|ed|ing)",
  "empower(?:s|ed|ing|ment)?",
  "harness(?:es|ed|ing)?",
  "ever-evolving",
  "fast-paced",
  "underscor(?:e|es|ed|ing)",
  "embark(?:s|ed|ing)?",
  "intricate",
  "nuanced?",
  "myriad",
  "plethora",
  "synerg(?:y|ies)",
  "transformative",
  "navigat(?:e|es|ed|ing) the",
];

const AI_TERM_RE = new RegExp(String.raw`(?<![\w'’-])(?:${AI_TERM_PATTERNS.join("|")})(?![\w-])`, "gi");

export interface AiTermMatch {
  start: number;
  end: number;
}

/** Every AI-sounding word or phrase in the text, in order and non-overlapping. */
export function findAiTerms(text: string): AiTermMatch[] {
  return Array.from(text.matchAll(AI_TERM_RE), (m) => ({ start: m.index, end: m.index + m[0].length }));
}

const TRANSITION_OPENERS = [
  "furthermore", "moreover", "additionally", "in conclusion", "overall", "ultimately",
  "consequently", "therefore", "thus", "in summary", "however", "notably",
];

const CONTRACTION = /\b\w+['’](s|t|re|ve|ll|d|m)\b/i;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

function sentences(text: string): string[] {
  return (text.match(/[^.!?\n]+[.!?]*/g) ?? []).map((s) => s.trim()).filter((s) => /\w/.test(s));
}

/** Returns 0-100, or null when the text is too short to say anything useful. */
export function estimateAiScore(text: string): number | null {
  const words = text.toLowerCase().match(/[a-z'’-]+/g) ?? [];
  if (words.length < MIN_WORDS_FOR_SCORE) return null;

  const sents = sentences(text);
  const lengths = sents.map((s) => s.split(/\s+/).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / Math.max(1, lengths.length);
  const variance = lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, lengths.length);
  const cv = mean ? Math.sqrt(variance) / mean : 0;

  // 1. AI buzzwords and stock phrases per 100 words (4+ is very AI-like).
  const hits = findAiTerms(text).length;
  const phraseScore = clamp01(((hits / words.length) * 100) / 4);

  // 2. Burstiness: humans mix short and long sentences; flat rhythm reads as machine-made.
  const burstScore = sents.length < 3 ? 0.5 : clamp01((0.7 - cv) / 0.45);

  // 3. Repeated sentence openers (first two words).
  const openers = sents.map((s) => s.toLowerCase().split(/\s+/).slice(0, 2).join(" "));
  const repeatedOpeners = openers.length ? 1 - new Set(openers).size / openers.length : 0;
  const openerScore = clamp01(repeatedOpeners / 0.4);

  // 4. Stock transitions at the start of sentences.
  const transitions = sents.filter((s) => TRANSITION_OPENERS.some((t) => s.toLowerCase().startsWith(t))).length;
  const transitionScore = clamp01(transitions / Math.max(1, sents.length) / 0.25);

  // 5. No contractions in a longer text.
  const contractionScore = words.length >= 60 && !CONTRACTION.test(text) ? 1 : 0;

  // 6. Formal vocabulary: long average word length.
  const avgLen = words.reduce((a, w) => a + w.length, 0) / words.length;
  const vocabScore = clamp01((avgLen - 4.4) / 0.9);

  const raw =
    phraseScore * 0.35 +
    burstScore * 0.25 +
    openerScore * 0.1 +
    transitionScore * 0.1 +
    contractionScore * 0.1 +
    vocabScore * 0.1;

  // Stretch the middle so clearly machine-like text lands in the 80s-90s and clearly human text in single digits,
  // instead of everything clustering around 50.
  const stretched = 1 / (1 + Math.exp(-9 * (raw - 0.45)));
  return Math.round(Math.min(98, Math.max(2, stretched * 100)));
}
