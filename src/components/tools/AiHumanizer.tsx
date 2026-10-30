"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Eraser, LoaderCircle, Sparkles } from "lucide-react";
import { toPlainText } from "@/lib/plain-text";
import { analyzeAiText, findAiTerms, MIN_WORDS_FOR_SCORE, type AiFactors } from "@/lib/ai-score";
import { CopyToClipboard } from "../CopyToClipboard";

const TONES = ["Professional", "Casual", "Engaging", "Academic"] as const;
type Tone = (typeof TONES)[number];
const MAX_CHARS = 5000;

function count(text: string) {
  return { words: text.match(/\S+/g)?.length ?? 0, characters: Array.from(text).length };
}

/** Ring colour follows the score: red above 70, orange 55-70, yellow 40-55, green below 40. */
function tone(score: number) {
  if (score >= 70) return { stroke: "stroke-danger", dot: "bg-danger", text: "text-danger" };
  if (score >= 55) return { stroke: "stroke-brand-orange", dot: "bg-brand-orange", text: "text-brand-orange" };
  if (score >= 40) return { stroke: "stroke-caution", dot: "bg-caution", text: "text-caution" };
  return { stroke: "stroke-ok", dot: "bg-ok", text: "text-ok" };
}

/** A word, not a second number, so the ring, the headline and the verdict can never seem to disagree. */
function verdict(score: number) {
  if (score >= 70) return "Reads as machine-written";
  if (score >= 40) return "Reads as mixed";
  return "Reads as human-written";
}

/** Plain-language read of each measured factor, so the score is explainable rather than a black box. */
function factorSummary(f: AiFactors, formalTone: boolean) {
  const level = (v: number, lo: string, mid: string, hi: string) => (v < 0.34 ? lo : v < 0.67 ? mid : hi);
  return [
    { label: "Sentence rhythm", value: level(f.rhythm, "varied", "somewhat even", "flat"), ai: f.rhythm >= 0.67 },
    { label: "AI buzzwords", value: String(f.buzzwords), ai: f.buzzwords >= 3 },
    { label: "Generic wording", value: level(f.generic, "low", "medium", "high"), ai: f.generic >= 0.67 },
    formalTone
      ? { label: "Personal voice", value: "not expected in a formal tone", ai: false }
      : { label: "Personal voice", value: level(f.voice, "natural", "some", "none"), ai: f.voice >= 0.67 },
  ];
}

const RADIUS = 34;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Compact inline score for the input header, e.g. "75% AI-generated". */
function ScoreChip({ score, pending }: { score: number | null; pending: string }) {
  if (score === null) {
    return <span className="rounded-full border border-dashed border-line-strong px-3 py-1 text-xs text-muted">{pending}</span>;
  }
  const c = tone(score);
  return (
    <span
      role="status"
      aria-label={`${score}% AI-generated`}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 py-1 pl-2.5 pr-3 text-sm font-semibold text-ink"
    >
      <span aria-hidden="true" className={`size-2.5 rounded-full ${c.dot}`} />
      <span className={`tabular-nums ${c.text}`}>{score}%</span>
      AI-generated
    </span>
  );
}

/** Large, unboxed result meter: a big ring with the percentage inside and the verdict beside it. */
function ScoreMeter({ score }: { score: number }) {
  const c = tone(score);
  return (
    <div
      role="status"
      aria-label={`AI score: ${score}% AI-generated. ${verdict(score)}.`}
      className="flex items-center justify-center gap-5"
    >
      <div className="relative size-28 shrink-0">
        <svg viewBox="0 0 80 80" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="40" cy="40" r={RADIUS} fill="none" strokeWidth="7" className="stroke-line" />
          <circle
            cx="40"
            cy="40"
            r={RADIUS}
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - score / 100)}
            className={`${c.stroke} transition-[stroke-dashoffset] duration-700 ease-out`}
          />
        </svg>
        <span className={`absolute inset-0 grid place-items-center font-display text-4xl font-bold tabular-nums ${c.text}`}>
          {score}%
        </span>
      </div>
      <div className="flex flex-col justify-center gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted">AI score</p>
        <p className={`text-2xl font-bold leading-tight ${c.text}`}>{score}% AI-generated</p>
        <p className="text-sm text-muted">
          Breakdown: <span className="font-medium text-ink">{score}% AI</span> ·{" "}
          <span className="font-medium text-ink">{100 - score}% human</span>
        </p>
      </div>
    </div>
  );
}

const field =
  "mt-2 w-full resize-y rounded-xl border border-line-strong bg-surface p-4 text-base leading-relaxed text-ink shadow-sm transition-colors placeholder:text-muted/60 hover:border-ink/40 focus:border-accent";

/**
 * Textarea with a mirrored layer behind it. The layer has the same font, padding and wrapping, its text is
 * transparent, and only the <mark>s show, so highlights sit exactly under the real text while the textarea
 * stays a normal, fully native input.
 */
function HighlightedTextarea({
  id,
  value,
  onChange,
  segments,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  segments: { text: string; hit: boolean }[];
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const metrics = "p-4 text-base leading-relaxed [scrollbar-gutter:stable]";

  return (
    <div className="relative mt-2 rounded-xl bg-surface">
      <div
        ref={layerRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-transparent text-transparent [scrollbar-color:transparent_transparent] ${metrics}`}
      >
        {segments.map((seg, i) =>
          seg.hit ? (
            <mark key={i} className="rounded-sm bg-brand-orange/25 text-transparent shadow-[0_2px_0_0_var(--color-brand-orange)]">
              {seg.text}
            </mark>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
        {/* A trailing newline would otherwise collapse and let the layer scroll shorter than the textarea. */}
        {"\n"}
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => {
          if (layerRef.current) layerRef.current.scrollTop = e.currentTarget.scrollTop;
        }}
        rows={10}
        placeholder="Paste the text you want to make sound human…"
        className={`relative block w-full resize-y rounded-xl border border-line-strong bg-transparent text-ink shadow-sm transition-colors placeholder:text-muted/60 hover:border-ink/40 focus:border-accent ${metrics}`}
      />
    </div>
  );
}

export function AiHumanizer() {
  const id = useId();
  const [input, setInput] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inCount = useMemo(() => count(input), [input]);
  const outCount = useMemo(() => count(output), [output]);
  const tooLong = inCount.characters > MAX_CHARS;
  // The pasted text is scored as it is, on the standard baseline. Only the result is judged against the chosen tone:
  // formal tones are scored against a formal baseline, since reports and essays have no personal voice by design.
  const formalTone = tone === "Professional" || tone === "Academic";
  const inAnalysis = useMemo(() => analyzeAiText(input), [input]);
  const inScore = inAnalysis?.score ?? null;
  const { segments, flagged } = useMemo(() => {
    const matches = findAiTerms(input);
    const out: { text: string; hit: boolean }[] = [];
    let pos = 0;
    for (const m of matches) {
      if (m.start > pos) out.push({ text: input.slice(pos, m.start), hit: false });
      out.push({ text: input.slice(m.start, m.end), hit: true });
      pos = m.end;
    }
    if (pos < input.length) out.push({ text: input.slice(pos), hit: false });
    const unique = [...new Set(matches.map((m) => input.slice(m.start, m.end).toLowerCase()))];
    return { segments: out, flagged: { count: matches.length, unique } };
  }, [input]);
  const outAnalysis = useMemo(() => analyzeAiText(output, { formalTone }), [output, formalTone]);
  const outScore = outAnalysis?.score ?? null;

  async function humanize() {
    if (loading || !input.trim() || tooLong) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, tone }),
      });
      const data: { result?: string; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.result) throw new Error(data.error || "Something went wrong. Please try again.");
      // Defence in depth: the server already cleans this, but never trust the wire.
      setOutput(toPlainText(data.result));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-label="AI humanizer" className="rounded-3xl border border-line bg-surface p-5 shadow-md sm:p-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <label htmlFor={`${id}-in`} className="text-base font-semibold text-ink">
          Paste your AI-generated text
        </label>
        <ScoreChip
          score={inScore}
          pending={inCount.words >= MIN_WORDS_FOR_SCORE ? "Scoring works on English text" : `Paste ${MIN_WORDS_FOR_SCORE}+ words to score`}
        />
      </div>
      <HighlightedTextarea id={`${id}-in`} value={input} onChange={setInput} segments={segments} />
      <p aria-live="polite" className={`mt-2 text-sm tabular-nums ${tooLong ? "text-danger" : "text-muted"}`}>
        {inCount.words} words · {inCount.characters} / {MAX_CHARS} characters
      </p>

      {flagged.count > 0 && (
        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted">
          <span className="font-medium text-ink">
            {flagged.count} AI-sounding {flagged.count === 1 ? "word" : "words"} highlighted:
          </span>
          {flagged.unique.slice(0, 8).map((w) => (
            <span key={w} className="rounded-md bg-brand-orange/15 px-1.5 py-0.5 text-xs font-medium text-ink">
              {w}
            </span>
          ))}
          {flagged.unique.length > 8 && <span className="text-xs">+{flagged.unique.length - 8} more</span>}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor={`${id}-tone`} className="block text-sm font-medium text-muted">
            Tone
          </label>
          <select
            id={`${id}-tone`}
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="mt-2 h-12 rounded-xl border border-line-strong bg-surface px-4 text-[15px] text-ink shadow-sm transition-colors hover:border-ink/40 focus:border-accent"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={humanize}
          disabled={loading || !input.trim() || tooLong}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-[15px] font-medium text-accent-ink shadow-sm transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <LoaderCircle size={18} strokeWidth={1.75} className="animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles size={18} strokeWidth={1.5} aria-hidden="true" />
          )}
          {loading ? "Humanizing…" : "Humanize Text"}
        </button>

        <button
          type="button"
          onClick={() => {
            setInput("");
            setOutput("");
            setError("");
          }}
          disabled={(!input && !output) || loading}
          className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-[15px] font-medium text-muted transition-colors hover:text-ink disabled:opacity-50"
        >
          <Eraser size={18} strokeWidth={1.5} aria-hidden="true" />
          Clear
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="mt-8">
        <label htmlFor={`${id}-out`} className="text-base font-semibold text-ink">
          Humanized result
        </label>
      </div>
      {/* Only shown once a result exists (and is long enough to score). */}
      {output && outScore !== null && (
        <div className="mt-4">
          <ScoreMeter score={outScore} />
          {outAnalysis && (
            <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted">
              {factorSummary(outAnalysis.factors, formalTone).map((f) => (
                <li key={f.label}>
                  {f.label}: <span className={f.ai ? "font-medium text-danger" : "font-medium text-ink"}>{f.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <textarea
        id={`${id}-out`}
        value={output}
        readOnly
        rows={10}
        placeholder="Your humanized text will appear here…"
        className={field}
      />
      <p aria-live="polite" className="mt-2 text-sm tabular-nums text-muted">
        {outCount.words} words · {outCount.characters} characters
      </p>
      <div className="mt-4">
        <CopyToClipboard value={toPlainText(output)} label="Copy to Clipboard" />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Scores are a quick estimate based on writing patterns such as stock phrases, sentence rhythm and
        word choice. They are not a real AI-detector result, and other detectors may disagree.
      </p>
    </section>
  );
}
