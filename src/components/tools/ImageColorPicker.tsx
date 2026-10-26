"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { CopyToClipboard } from "../CopyToClipboard";
import { ImageDropzone } from "../ImageDropzone";

interface Picked {
  r: number;
  g: number;
  b: number;
  a: number;
}

const toHex = ({ r, g, b }: Picked) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
const toRgb = ({ r, g, b }: Picked) => `rgb(${r}, ${g}, ${b})`;

export function ImageColorPicker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [hover, setHover] = useState<Picked | null>(null);
  // Marker position in canvas pixels; also the keyboard cursor.
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Draw the image at its natural size so sampled colors are exact; CSS scales it to fit.
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d", { willReadFrequently: true })?.drawImage(img, 0, 0);
      setDims({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => {
      if (!cancelled) setLoadError(true);
    };
    img.src = url;
    return () => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  function sample(x: number, y: number): Picked | null {
    const ctx = canvasRef.current?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
    return { r, g, b, a };
  }

  function toCanvasPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = Math.min(
      canvas.width - 1,
      Math.max(0, Math.floor(((e.clientX - rect.left) * canvas.width) / rect.width)),
    );
    const y = Math.min(
      canvas.height - 1,
      Math.max(0, Math.floor(((e.clientY - rect.top) * canvas.height) / rect.height)),
    );
    return { x, y };
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
    if (!dims) return;
    const step = e.shiftKey ? 10 : 1;
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const d = delta[e.key];
    if (!d && e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    const cur = point ?? { x: Math.floor(dims.w / 2), y: Math.floor(dims.h / 2) };
    const next = d
      ? {
          x: Math.min(dims.w - 1, Math.max(0, cur.x + d[0])),
          y: Math.min(dims.h - 1, Math.max(0, cur.y + d[1])),
        }
      : cur;
    setPoint(next);
    setPicked(sample(next.x, next.y));
  }

  function reset() {
    setFile(null);
    setDims(null);
    setPicked(null);
    setHover(null);
    setPoint(null);
    setLoadError(false);
  }

  if (!file) {
    return <ImageDropzone onFile={setFile} title="Drop an image to pick colors from" />;
  }

  // The picked color is the main readout; before anything is picked, the hover preview fills in.
  const shown = picked ?? hover;

  return (
    <div className="rounded-3xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      {loadError && (
        <p role="alert" className="mb-4 text-sm font-medium text-danger">
          That image couldn’t be read. Please try a different file.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="relative min-w-0 self-start overflow-hidden rounded-2xl border border-line bg-surface-2">
          <canvas
            ref={canvasRef}
            tabIndex={0}
            aria-label={`Image preview of ${file.name}. Click or tap to pick a color, or use the arrow keys to move and Enter to pick.`}
            className="block h-auto max-h-[70vh] w-full cursor-crosshair object-contain focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-blue"
            onPointerMove={(e) => {
              if (e.pointerType === "touch") return;
              const p = toCanvasPoint(e);
              setHover(sample(p.x, p.y));
            }}
            onPointerLeave={() => setHover(null)}
            onPointerDown={(e) => {
              const p = toCanvasPoint(e);
              setPoint(p);
              setPicked(sample(p.x, p.y));
            }}
            onKeyDown={onKeyDown}
          />
          {point && dims && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1.5px_rgba(0,0,0,0.7)]"
              style={{
                left: `${((point.x + 0.5) / dims.w) * 100}%`,
                top: `${((point.y + 0.5) / dims.h) * 100}%`,
              }}
            />
          )}
        </div>

        <div className="space-y-4" aria-live="polite">
          <div
            role="img"
            aria-label={shown ? `Selected color ${toHex(shown)}` : "No color selected yet"}
            className="h-32 w-full rounded-2xl border border-line-strong"
            style={{
              backgroundColor: shown ? toRgb(shown) : undefined,
              backgroundImage: shown
                ? undefined
                : "repeating-linear-gradient(45deg,var(--surface-2) 0 10px,var(--surface) 10px 20px)",
            }}
          />
          <p className="text-sm text-muted">
            {picked
              ? "Picked color"
              : "Click or tap anywhere on the image to pick a color."}
          </p>
          {hover && (
            <p className="flex items-center gap-2 text-xs text-muted">
              <span
                aria-hidden="true"
                className="inline-block size-4 rounded border border-line-strong"
                style={{ backgroundColor: toRgb(hover) }}
              />
              Under cursor: <span className="font-mono">{toHex(hover)}</span>
            </p>
          )}

          {shown && (
            <dl className="space-y-3">
              {[
                ["HEX", toHex(shown)],
                ["RGB", toRgb(shown)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted">
                      {label}
                    </dt>
                    <dd className="whitespace-nowrap font-mono text-base tabular-nums">{value}</dd>
                  </div>
                  {picked && (
                    <CopyToClipboard
                      value={value}
                      label={`Copy ${label}`}
                      toastText={`${label} copied`}
                      variant="secondary"
                      className="!h-10 shrink-0 whitespace-nowrap !px-4 !text-sm"
                    />
                  )}
                </div>
              ))}
            </dl>
          )}
          {shown && shown.a < 255 && (
            <p className="text-xs text-muted">
              This pixel is {shown.a === 0 ? "fully transparent" : "partly transparent"}, so the
              color shown ignores its transparency.
            </p>
          )}

          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-line-strong bg-surface px-4 text-sm font-medium transition-colors duration-150 hover:bg-surface-2"
          >
            <RotateCcw size={16} strokeWidth={1.5} aria-hidden="true" />
            Use another image
          </button>
        </div>
      </div>
    </div>
  );
}
