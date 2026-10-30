/**
 * A fast, client-side heuristic that estimates how "machine-written" a text reads.
 * It is NOT a real AI detector: it looks for the surface patterns people associate with AI prose
 * (stock phrases, generic abstract vocabulary as a perplexity proxy, flat burstiness, no personal voice,
 * repeated openers, formal register). True perplexity needs a language model, so it is approximated.
 * The same function scores the input and the output, so the two numbers are directly comparable.
 */

import { stripMarkdown } from "./plain-text";

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
  "consequently", "therefore", "thus", "in summary", "however", "notably", "in addition",
  "as a result", "for example", "for instance", "this means", "this is", "this can", "this allows",
];

/**
 * Safe, abstract words that language models reach for because they are statistically likely in
 * explanatory prose. Not buzzwords on their own, but a high density is a strong tell. This is the
 * "predictability" signal: a real perplexity score needs a language model, so we measure how much of
 * the vocabulary is generic and abstract instead of concrete and specific.
 */
const GENERIC_RE = new RegExp(
  String.raw`(?<![\w'’-])(?:various|numerous|significant(?:ly)?|essential(?:ly)?|enhanc(?:e|es|ed|ing)|ensur(?:e|es|ed|ing)|effective(?:ly)?|efficient(?:ly)?|valuable|strateg(?:y|ies|ic)|benefits?|challenges?|opportunit(?:y|ies)|implement(?:s|ed|ing|ation)?|address(?:es|ed|ing)?|impacts?|overall|diverse|innovative|dynamic|critical(?:ly)?|optimal(?:ly)?|facilitat(?:e|es|ed|ing)|enabl(?:e|es|ed|ing)|notabl[ey]|remarkabl[ey]|importance|important|variety|factors?|aspects?|approach(?:es)?|solutions?|environments?|experiences?|capabilities|potential|ability|improv(?:e|es|ed|ing|ement)|growth|sustainable|productivity|collaborat(?:e|ion|ive)|communication|organi[sz]ations?|individuals?|stakeholders?|insights?|practices|framework|process(?:es)?|consider(?:ations?|ing)?|offers?|provides?|allows?|helps? to|plays?)(?![\w-])`,
  "gi",
);

/** Markers of a personal, spoken voice. AI explainer prose rarely has any. */
const VOICE_RE = /\b(?:i|i['’](?:m|ve|d|ll)|me|my|mine|we|we['’](?:re|ve)|our|you|your|you['’](?:re|ve|ll)|let['’]s|honestly|anyway|actually|kind of|sort of|pretty much|a bit|a lot|guess|reckon|yeah|well|so)\b/gi;

const CONTRACTION = /\b\w+['’](?:s|t|re|ve|ll|d|m)\b/gi;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Smooth curves instead of hard clamps. A clamp pins every "good enough" text to the same value, so all of them end
// up with the same score. These keep responding to the text's actual numbers across the whole range.
/** 0 at x = 0, rising toward 1 and never reaching it; `scale` is the x at which it reaches about 63%. */
const saturate = (x: number, scale: number) => 1 - Math.exp(-Math.max(0, x) / scale);
const logistic = (x: number) => 1 / (1 + Math.exp(-x));

function sentences(text: string): string[] {
  return (text.match(/[^.!?\n]+[.!?]*/g) ?? []).map((s) => s.trim()).filter((s) => /\w/.test(s));
}

/**
 * Rhythm for text with too few sentence breaks to measure (a single long sentence, pasted lists, text without
 * punctuation): measure the length of its clauses instead. Less reliable than real sentences, so it is pulled
 * halfway back toward neutral rather than trusted fully.
 */
function clauseRhythm(text: string): number {
  const clauses = text
    .split(/[,;:\n]|\s(?:and|but|which|while|because|so)\s/i)
    .map((c) => c.trim().split(/\s+/).filter(Boolean).length)
    .filter((n) => n > 0);
  if (clauses.length < 4) return 0.5;
  const mean = clauses.reduce((a, b) => a + b, 0) / clauses.length;
  const sd = Math.sqrt(clauses.reduce((a, b) => a + (b - mean) ** 2, 0) / clauses.length);
  const measured = logistic((0.45 - sd / mean) / 0.13);
  return 0.5 * 0.5 + 0.5 * measured;
}

/**
 * Headings and list items ("Benefits", "Greater flexibility") are short lines with no closing punctuation. Counted as
 * sentences they would fake a varied rhythm, so they are left out when enough real prose remains without them.
 */
function withoutFragmentLines(text: string): string {
  const kept = text
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      return /[.!?]["'\u201D)\]]?$/.test(t) || t.split(/\s+/).length >= 8;
    })
    .join("\n");
  return (kept.match(/[a-z'\u2019-]+/gi)?.length ?? 0) >= MIN_WORDS_FOR_SCORE ? kept : text;
}

/** The measured signals behind a score. Each ratio runs from 0 (reads human) to 1 (reads machine-made). */
export interface AiFactors {
  /** Flat sentence rhythm. */
  rhythm: number;
  /** Generic, abstract vocabulary (the predictability proxy). */
  generic: number;
  /** Absence of personal voice. */
  voice: number;
  /** Number of known AI buzzwords and stock phrases. */
  buzzwords: number;
}

export interface AiAnalysis {
  score: number;
  factors: AiFactors;
}

/**
 * Returns the score (0-100) and the factors behind it, or null when the text is too short to say anything useful.
 * With formalTone, personal voice and formal vocabulary are not held against the text: formal human writing
 * (reports, essays) legitimately has neither, so those weights move to rhythm, which is what separates it from AI.
 */
export function analyzeAiText(rawText: string, options: { formalTone?: boolean } = {}): AiAnalysis | null {
  // Markup is not prose: a bullet line would count as a very short sentence and fake human-looking variety.
  const cleaned = stripMarkdown(rawText.replace(/<[^>]+>/g, " "))
    .replace(/^[ \t]*(?:[-*\u2022]|\d+[.)])[ \t]+/gm, "")
    .trim();
  const text = withoutFragmentLines(cleaned);
  const words = text.toLowerCase().match(/[a-z'’-]+/g) ?? [];
  if (words.length < MIN_WORDS_FOR_SCORE) return null;
  const per100 = (n: number) => (n / words.length) * 100;

  const sents = sentences(text);
  const lengths = sents.map((s) => s.split(/\s+/).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / Math.max(1, lengths.length);
  const variance = lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, lengths.length);
  const cv = mean ? Math.sqrt(variance) / mean : 0;

  // 1. Known AI buzzwords and stock phrases (6+ per 100 words is saturated).
  const buzzCount = findAiTerms(text).length;
  const buzz = saturate(per100(buzzCount), 1.5);

  // 2. Generic, abstract vocabulary: the predictability proxy (12+ per 100 words is saturated).
  const generic = saturate(per100((text.match(GENERIC_RE) ?? []).length), 7);

  // 3. Burstiness: humans mix very short and very long sentences. Flat rhythm, or sentences that all sit
  // near the average, read as machine-made. Also penalise having no short sentence at all.
  const shortest = Math.min(...lengths);
  const noShort = logistic((6 - shortest) / 1.5);
  const burst = sents.length >= 3 ? 0.7 * logistic((0.45 - cv) / 0.13) + 0.3 * noShort : clauseRhythm(text);

  // 4. Voice: first and second person, spoken fillers, contractions, questions, exclamations. Rare in AI prose.
  const voiceMarks =
    (text.match(VOICE_RE) ?? []).length + (text.match(CONTRACTION) ?? []).length * 1.5 + (text.match(/[?!]/g) ?? []).length * 2;
  const noVoice = Math.exp(-per100(voiceMarks) / 2.5);

  // 5. Repeated sentence openers (first two words) and stock transition openers.
  const openers = sents.map((s) => s.toLowerCase().split(/\s+/).slice(0, 2).join(" "));
  const repeated = openers.length ? 1 - new Set(openers).size / openers.length : 0;
  const transitions = sents.filter((s) => TRANSITION_OPENERS.some((t) => s.toLowerCase().startsWith(t))).length;
  const structure = 0.5 * saturate(repeated, 0.15) + 0.5 * saturate(transitions / Math.max(1, sents.length), 0.15);

  // 6. Formal vocabulary: long average word length.
  const avgLen = words.reduce((a, w) => a + w.length, 0) / words.length;
  const formal = logistic((avgLen - 4.8) / 0.3);

  const weighted = options.formalTone
    ? buzz * 0.25 + generic * 0.25 + burst * 0.3 + noVoice * 0.05 + structure * 0.15
    : buzz * 0.2 + generic * 0.25 + burst * 0.2 + noVoice * 0.15 + structure * 0.1 + formal * 0.1;

  // Credit for the markers that mark real writing: uneven rhythm, no AI buzzwords, concrete wording and varied
  // sentence openings. It is the weakest of those four that limits the credit, so one good marker is not enough,
  // and a single AI buzzword removes it. Every input is a measured factor, so this scales smoothly with the text.
  const humanEvidence =
    buzzCount > 0 ? 0 : Math.min(clamp01(1 - burst / 0.5), clamp01(1 - generic / 0.5), clamp01(1 - structure / 0.6));
  const raw = weighted * (1 - HUMAN_CREDIT * humanEvidence);

  // Stretch the middle so clearly machine-like text lands in the 80s-90s and clearly human text in single digits,
  // instead of everything clustering around 50. The result is rounded but not floored: it varies with the text
  // all the way down, because every factor above is a smooth curve and not a clamp.
  const stretched = 1 / (1 + Math.exp(-SLOPE * (raw - CENTER)));
  return {
    score: Math.round(Math.min(99, Math.max(1, stretched * 100))),
    factors: { rhythm: burst, generic, voice: noVoice, buzzwords: buzzCount },
  };
}

/** Returns 0-100, or null when the text is too short to say anything useful. */
export function estimateAiScore(text: string, options: { formalTone?: boolean } = {}): number | null {
  return analyzeAiText(text, options)?.score ?? null;
}

/** How much of the score the human markers can remove when all four are strong. */
const HUMAN_CREDIT = 0.6;
/** Steepness of the curve that turns the weighted signals into a percentage; calibrated on AI, human and rewritten samples. */
const SLOPE = 14;
const CENTER = 0.38;
