"use client";

import { useId, useMemo, useState } from "react";
import { Eraser, LoaderCircle, Sparkles } from "lucide-react";
import { CopyToClipboard } from "../CopyToClipboard";

const TONES = ["Professional", "Casual", "Engaging", "Academic"] as const;
type Tone = (typeof TONES)[number];
const MAX_CHARS = 5000;

function count(text: string) {
  return { words: text.match(/\S+/g)?.length ?? 0, characters: Array.from(text).length };
}

const field =
  "mt-2 w-full resize-y rounded-xl border border-line-strong bg-surface p-4 text-base leading-relaxed text-ink shadow-sm transition-colors placeholder:text-muted/60 hover:border-ink/40 focus:border-accent";

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
      setOutput(data.result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-label="AI humanizer" className="rounded-3xl border border-line bg-surface p-5 shadow-md sm:p-8">
      <label htmlFor={`${id}-in`} className="block text-sm font-medium text-muted">
        Paste your AI-generated text
      </label>
      <textarea
        id={`${id}-in`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={10}
        placeholder="Paste the text you want to make sound human…"
        className={field}
      />
      <p aria-live="polite" className={`mt-2 text-sm tabular-nums ${tooLong ? "text-danger" : "text-muted"}`}>
        {inCount.words} words · {inCount.characters} / {MAX_CHARS} characters
      </p>

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

      <label htmlFor={`${id}-out`} className="mt-8 block text-sm font-medium text-muted">
        Humanized result
      </label>
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
        <CopyToClipboard value={output} label="Copy to Clipboard" />
      </div>
    </section>
  );
}
