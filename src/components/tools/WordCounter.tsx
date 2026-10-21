"use client";

import { useId, useMemo, useState } from "react";
import { Eraser } from "lucide-react";
import { CopyToClipboard } from "../CopyToClipboard";

function analyze(text: string) {
  const words = text.match(/\S+/g)?.length ?? 0;
  const characters = Array.from(text).length;
  // Spaces and tabs only; line breaks still count as characters.
  const spaces = text.match(/[ \t\u00a0]/g)?.length ?? 0;
  const noSpaces = characters - spaces;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const sentences =
    text.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g)?.filter((s) => s.trim()).length ?? 0;
  const minutes = words / 238; // average adult silent reading speed
  const reading =
    words === 0
      ? "0 sec"
      : minutes < 1
        ? `${Math.max(1, Math.round(minutes * 60))} sec`
        : `${Math.ceil(minutes)} min`;
  return { words, characters, spaces, noSpaces, paragraphs, sentences, reading };
}

export function WordCounter() {
  const id = useId();
  const [text, setText] = useState("");
  const s = useMemo(() => analyze(text), [text]);

  const stats: [string, string | number][] = [
    ["Words", s.words],
    ["Characters", s.characters],
    ["Chars (no spaces)", s.noSpaces],
    ["Spaces", s.spaces],
    ["Paragraphs", s.paragraphs],
    ["Sentences", s.sentences],
    ["Reading time", s.reading],
  ];
  const summary = stats.map(([k, v]) => `${k}: ${v}`).join("\n");

  return (
    <section
      aria-label="Word counter"
      className="rounded-3xl border border-line bg-surface p-5 shadow-md sm:p-8"
    >
      <dl aria-live="polite" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-accent-soft px-4 py-3">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-0.5 font-display text-3xl tabular-nums tracking-tight text-ink">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <label htmlFor={id} className="mt-6 block text-sm font-medium text-muted">
        Type or paste your text
      </label>
      <textarea
        id={id}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Start typing or paste your text here…"
        className="mt-2 w-full resize-y rounded-xl border border-line-strong bg-surface p-4 text-base leading-relaxed text-ink shadow-sm transition-colors placeholder:text-muted/60 hover:border-ink/40 focus:border-accent"
      />

      <div className="mt-5 flex flex-wrap gap-3">
        <CopyToClipboard value={summary} label="Copy counts" />
        <CopyToClipboard value={text} label="Copy text" variant="secondary" />
        <button
          type="button"
          onClick={() => setText("")}
          disabled={!text}
          className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-[15px] font-medium text-muted transition-colors hover:text-ink disabled:opacity-50"
        >
          <Eraser size={18} strokeWidth={1.5} aria-hidden="true" />
          Clear
        </button>
      </div>
    </section>
  );
}
