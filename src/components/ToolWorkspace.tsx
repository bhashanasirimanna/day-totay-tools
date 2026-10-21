"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Download,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { processFiles, UserError, zipOutputs, type OutputFile } from "@/lib/process";

const MAX_MB = 50;
const MAX_BYTES = MAX_MB * 1024 * 1024;

type Phase = "idle" | "working" | "done";

interface WorkspaceTool {
  slug: string;
  name: string;
  multiple: boolean;
  minFiles: number;
  cta: string;
  outputLabel: string;
  option?: "page-range";
}

interface DownloadItem {
  name: string;
  url: string;
  size: number;
}

const isPdf = (f: File) =>
  f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");

const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ToolWorkspace({ tool }: { tool: WorkspaceTool }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pageRange, setPageRange] = useState("");
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [zip, setZip] = useState<DownloadItem | null>(null);
  const [summary, setSummary] = useState("");
  const urlsRef = useRef<string[]>([]);

  function revokeUrls() {
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlsRef.current = [];
  }

  // Free the generated files if the visitor leaves the page.
  useEffect(() => revokeUrls, []);

  const busy = phase === "working";
  const ready = files.length >= tool.minFiles;

  function addFiles(incoming: FileList | File[]) {
    const list = Array.from(incoming);
    const valid: File[] = [];
    let problem: string | null = null;

    for (const f of list) {
      if (!isPdf(f)) problem = `â€œ${f.name}â€ isnâ€™t a PDF. Only PDF files are supported.`;
      else if (f.size > MAX_BYTES) problem = `â€œ${f.name}â€ is over ${MAX_MB} MB.`;
      else valid.push(f);
    }

    setError(problem);
    if (!valid.length) return;

    setPhase("idle");
    setFiles((prev) => {
      if (!tool.multiple) return [valid[0]];
      const seen = new Set(prev.map(fileKey));
      return [...prev, ...valid.filter((f) => !seen.has(fileKey(f)))];
    });
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPhase("idle");
    setError(null);
  }

  function move(index: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function run() {
    if (!ready || busy) return;
    setError(null);
    setPhase("working");
    setProgress(0);
    revokeUrls();
    try {
      const result = await processFiles(tool.slug, files, setProgress, { pageRange });
      const toDownload = (o: OutputFile): DownloadItem => {
        const url = URL.createObjectURL(o.blob);
        urlsRef.current.push(url);
        return { name: o.name, url, size: o.blob.size };
      };
      setDownloads(result.outputs.map(toDownload));
      setZip(
        result.outputs.length > 1
          ? toDownload(await zipOutputs(result.outputs, `${tool.slug}.zip`))
          : null,
      );
      setSummary(result.summary);
      setPhase("done");
    } catch (e) {
      setPhase("idle");
      setError(
        e instanceof UserError
          ? e.message
          : "Something went wrong while processing your file. Please try again.",
      );
    }
  }

  function reset() {
    revokeUrls();
    setDownloads([]);
    setZip(null);
    setSummary("");
    setFiles([]);
    setPhase("idle");
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <section
      aria-label={`${tool.name} tool`}
      className="rounded-3xl border border-line bg-surface p-3 shadow-md sm:p-4"
    >
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!busy) addFiles(e.dataTransfer.files);
        }}
        className={`relative rounded-2xl border-[1.5px] border-dashed transition-colors duration-150 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-accent ${
          dragging
            ? "border-accent bg-accent-soft"
            : "border-line-strong bg-bg hover:border-accent/60"
        } ${files.length ? "px-5 py-6" : "px-5 py-12 sm:py-16"}`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="application/pdf,.pdf"
          multiple={tool.multiple}
          disabled={busy}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
          className="sr-only"
        />
        <label
          htmlFor={inputId}
          className="flex cursor-pointer flex-col items-center text-center"
        >
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Upload size={22} strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="mt-4 font-display text-2xl tracking-tight sm:text-3xl">
            {files.length && tool.multiple
              ? "Add more PDFs"
              : tool.multiple
                ? "Drop your PDFs here"
                : files.length
                  ? "Choose a different PDF"
                  : "Drop your PDF here"}
          </span>
          <span className="mt-1.5 text-sm text-muted">
            or{" "}
            <span className="font-medium text-accent underline underline-offset-4">
              browse your device
            </span>{" "}
            Â· PDF up to {MAX_MB} MB
          </span>
        </label>
      </div>

      {/* Messages (announced to screen readers) */}
      <div aria-live="polite" className="empty:hidden">
        {error && (
          <p
            role="alert"
            className="mt-3 flex items-start gap-2 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger"
          >
            <AlertCircle size={18} strokeWidth={1.75} className="mt-px shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
          {files.map((f, i) => (
            <li key={fileKey(f)} className="flex items-center gap-3 px-4 py-3">
              <FileText size={20} strokeWidth={1.5} className="shrink-0 text-accent" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{f.name}</p>
                <p className="text-xs text-muted">{formatSize(f.size)}</p>
              </div>
              {tool.multiple && files.length > 1 && (
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={busy || i === 0}
                    aria-label={`Move ${f.name} up`}
                    className="inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-ink disabled:opacity-30"
                  >
                    <ArrowUp size={16} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={busy || i === files.length - 1}
                    aria-label={`Move ${f.name} down`}
                    className="inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-ink disabled:opacity-30"
                  >
                    <ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                disabled={busy}
                aria-label={`Remove ${f.name}`}
                className="inline-flex size-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-danger disabled:opacity-30"
              >
                <X size={18} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Options */}
      {tool.option === "page-range" && phase !== "done" && (
        <div className="mt-4 px-1">
          <label htmlFor={`${inputId}-range`} className="text-sm font-medium">
            Pages to extract
          </label>
          <input
            id={`${inputId}-range`}
            type="text"
            inputMode="numeric"
            value={pageRange}
            disabled={busy}
            onChange={(e) => setPageRange(e.target.value)}
            placeholder="e.g. 1-3, 7"
            className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-bg px-3.5 text-sm placeholder:text-muted/70 sm:max-w-xs"
          />
          <p className="mt-1.5 text-xs text-muted">
            Leave empty to split every page into its own PDF.
          </p>
        </div>
      )}

      {/* Progress */}
      {busy && (
        <div className="mt-4 px-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Working on itâ€¦</span>
            <span className="tabular-nums font-medium">{progress}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Processing progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2"
          >
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success */}
      {phase === "done" && (
        <div role="status" className="mt-4 rounded-2xl border border-line bg-bg p-5">
          <p className="flex items-center gap-2 font-medium">
            <CheckCircle2 size={20} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
            Your {tool.outputLabel} {downloads.length > 1 ? "are" : "is"} ready
          </p>
          <p className="mt-2 text-sm text-muted">{summary}</p>

          {zip && (
            <a
              href={zip.url}
              download={zip.name}
              className="mt-4 inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-5 text-[15px] font-medium text-accent-ink shadow-sm transition-colors hover:bg-accent-hover"
            >
              <Download size={18} strokeWidth={1.75} aria-hidden="true" />
              Download all (ZIP)
            </a>
          )}

          <ul className="mt-4 max-h-72 divide-y divide-line overflow-y-auto rounded-xl border border-line bg-surface">
            {downloads.map((d) => (
              <li key={d.url} className="flex items-center gap-3 px-4 py-2.5">
                <span className="min-w-0 flex-1 truncate text-sm">{d.name}</span>
                <span className="text-xs text-muted">{formatSize(d.size)}</span>
                <a
                  href={d.url}
                  download={d.name}
                  aria-label={`Download ${d.name}`}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium ${
                    zip
                      ? "text-accent hover:bg-accent-soft"
                      : "bg-accent text-accent-ink hover:bg-accent-hover"
                  }`}
                >
                  <Download size={16} strokeWidth={1.75} aria-hidden="true" />
                  Download
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex h-11 items-center rounded-xl border border-line-strong px-4 text-sm font-medium transition-colors hover:bg-surface-2"
          >
            Start over
          </button>
        </div>
      )}

      {/* Primary action */}
      {phase !== "done" && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="px-1 text-xs text-muted">
            {tool.minFiles > 1 && files.length < tool.minFiles
              ? `Add at least ${tool.minFiles} PDFs to continue.`
              : files.length
                ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                : "No file selected yet."}
          </p>
          <button
            type="button"
            onClick={run}
            disabled={!ready || busy}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 text-[15px] font-medium text-accent-ink shadow-sm transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Processingâ€¦" : tool.cta}
          </button>
        </div>
      )}
    </section>
  );
}
