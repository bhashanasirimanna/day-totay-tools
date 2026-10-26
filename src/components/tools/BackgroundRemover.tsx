"use client";

import { useEffect, useRef, useState } from "react";
import { Download, LoaderCircle, RotateCcw } from "lucide-react";
import { removeBackgroundFromImage } from "@/lib/remove-background";
import { ImageDropzone } from "../ImageDropzone";

type State =
  | { status: "idle" }
  | { status: "working"; fraction: number; phase: "download" | "process" }
  | { status: "done" }
  | { status: "error"; message: string };

const checkerboard: React.CSSProperties = {
  backgroundColor: "#ffffff",
  backgroundImage:
    "linear-gradient(45deg,#d4d4d8 25%,transparent 25%),linear-gradient(-45deg,#d4d4d8 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#d4d4d8 75%),linear-gradient(-45deg,transparent 75%,#d4d4d8 75%)",
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0,0 10px,10px -10px,-10px 0",
};

export function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [state, setState] = useState<State>({ status: "idle" });
  const run = useRef(0);

  // Release object URLs when they are replaced or the component unmounts.
  useEffect(() => () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
  }, [originalUrl]);
  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  async function process(f: File) {
    const id = ++run.current;
    setFile(f);
    setOriginalUrl(URL.createObjectURL(f));
    setResultUrl(null);
    setState({ status: "working", fraction: 0, phase: "download" });
    try {
      const blob = await removeBackgroundFromImage(f, (fraction, phase) => {
        if (run.current === id) setState({ status: "working", fraction, phase });
      });
      if (run.current !== id) return;
      setResultUrl(URL.createObjectURL(blob));
      setState({ status: "done" });
    } catch {
      if (run.current !== id) return;
      setState({
        status: "error",
        message:
          "Something went wrong while removing the background. Check your connection (the model downloads on first use) and try again.",
      });
    }
  }

  function reset() {
    run.current++;
    setFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setState({ status: "idle" });
  }

  if (!file || !originalUrl) {
    return <ImageDropzone onFile={process} title="Drop an image to remove its background" />;
  }

  const working = state.status === "working";
  const pct = working ? Math.round(state.fraction * 100) : 0;
  const baseName = file.name.replace(/\.[^.]+$/, "") || "image";

  return (
    <div className="rounded-3xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <figure>
          <figcaption className="mb-2 text-sm font-medium text-muted">Original</figcaption>
          <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL from the visitor's own file */}
            <img
              src={originalUrl}
              alt={`Original image: ${file.name}`}
              className="max-h-[28rem] w-full object-contain"
            />
          </div>
        </figure>

        <figure>
          <figcaption className="mb-2 text-sm font-medium text-muted">
            Background removed
          </figcaption>
          <div
            style={checkerboard}
            className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-line"
          >
            {resultUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- blob: URL generated in the browser
              <img
                src={resultUrl}
                alt={`Transparent PNG of ${file.name} with the background removed`}
                className="max-h-[28rem] w-full object-contain"
              />
            ) : (
              <div
                role="status"
                aria-live="polite"
                className="m-4 flex flex-col items-center gap-3 rounded-2xl bg-surface/95 px-6 py-5 text-center shadow-md"
              >
                {state.status === "error" ? (
                  <p className="max-w-xs text-sm font-medium text-danger">{state.message}</p>
                ) : (
                  <>
                    <LoaderCircle
                      size={28}
                      strokeWidth={1.75}
                      className="animate-spin text-brand-blue"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-medium">
                      {state.status === "working" && state.phase === "process"
                        ? "Removing the background…"
                        : `Preparing the AI model… ${pct}%`}
                    </p>
                    <div
                      role="progressbar"
                      aria-label="Progress"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={pct}
                      className="h-1.5 w-48 overflow-hidden rounded-full bg-line"
                    >
                      <div
                        className="h-full rounded-full bg-brand-blue transition-[width] duration-200"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="max-w-[26ch] text-xs text-muted">
                      The first run downloads the model (about 40 MB) and is cached afterwards.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </figure>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {resultUrl && (
          <a
            href={resultUrl}
            download={`${baseName}-no-background.png`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 text-[15px] font-medium text-white shadow-sm transition-colors duration-150 hover:bg-brand-blue/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            <Download size={18} strokeWidth={1.75} aria-hidden="true" />
            Download Transparent PNG
          </a>
        )}
        {state.status === "error" && (
          <button
            type="button"
            onClick={() => process(file)}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand-blue px-6 text-[15px] font-medium text-white shadow-sm transition-colors duration-150 hover:bg-brand-blue/90"
          >
            Try again
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-line-strong bg-surface px-5 text-[15px] font-medium transition-colors duration-150 hover:bg-surface-2"
        >
          <RotateCcw size={18} strokeWidth={1.5} aria-hidden="true" />
          {working ? "Cancel" : "Use another image"}
        </button>
      </div>
    </div>
  );
}
