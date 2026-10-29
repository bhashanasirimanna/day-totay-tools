"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FlipHorizontal2, FlipVertical2, RotateCcw, RotateCw, Undo2 } from "lucide-react";
import { ImageDropzone } from "../ImageDropzone";

/** Flips are applied to the source first, then the whole thing is rotated. */
interface Transform {
  rot: 0 | 90 | 180 | 270;
  fx: boolean;
  fy: boolean;
}

const IDENTITY: Transform = { rot: 0, fx: false, fy: false };

const OUTPUT: Record<string, { mime: string; ext: string }> = {
  "image/png": { mime: "image/png", ext: "png" },
  "image/jpeg": { mime: "image/jpeg", ext: "jpg" },
  "image/webp": { mime: "image/webp", ext: "webp" },
};

const button =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface px-4 text-[15px] font-medium text-ink shadow-sm transition-colors duration-150 hover:bg-surface-2";

export function ImageFlipper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [t, setT] = useState<Transform>(IDENTITY);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      if (!cancelled) setImg(image);
    };
    image.onerror = () => {
      if (!cancelled) setLoadError(true);
    };
    image.src = url;
    return () => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Redraw at the image's full resolution; CSS scales the canvas to fit, and Download exports exactly this.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const sideways = t.rot === 90 || t.rot === 270;
    canvas.width = sideways ? h : w;
    canvas.height = sideways ? w : h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((t.rot * Math.PI) / 180);
    ctx.scale(t.fx ? -1 : 1, t.fy ? -1 : 1);
    ctx.drawImage(img, -w / 2, -h / 2);
    ctx.restore();
  }, [img, t]);

  // Buttons act on what you see. Once the image is turned a quarter, "horizontal" is the source's vertical axis.
  const flipHorizontal = () =>
    setT((p) => (p.rot % 180 === 0 ? { ...p, fx: !p.fx } : { ...p, fy: !p.fy }));
  const flipVertical = () =>
    setT((p) => (p.rot % 180 === 0 ? { ...p, fy: !p.fy } : { ...p, fx: !p.fx }));
  const rotate = (delta: 90 | -90) =>
    setT((p) => ({ ...p, rot: ((p.rot + delta + 360) % 360) as Transform["rot"] }));

  function download() {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    const out = OUTPUT[file.type] ?? OUTPUT["image/png"];
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${file.name.replace(/\.[^.]+$/, "") || "image"}-flipped.${out.ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      },
      out.mime,
      0.95,
    );
  }

  function reset() {
    setFile(null);
    setImg(null);
    setT(IDENTITY);
    setLoadError(false);
  }

  if (!file) {
    return <ImageDropzone onFile={setFile} title="Drop an image to flip or rotate" />;
  }

  const changed = t.rot !== 0 || t.fx || t.fy;

  return (
    <div className="rounded-3xl border border-line bg-surface p-4 shadow-sm sm:p-6">
      {loadError && (
        <p role="alert" className="mb-4 text-sm font-medium text-danger">
          That image couldn’t be read. Please try a different file.
        </p>
      )}

      <div
        className="flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface-2 p-2"
        style={{
          backgroundImage:
            "linear-gradient(45deg,#8881 25%,transparent 25%,transparent 75%,#8881 75%),linear-gradient(45deg,#8881 25%,transparent 25%,transparent 75%,#8881 75%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "0 0, 8px 8px",
        }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Preview of ${file.name}${changed ? " after your changes" : ""}`}
          className="block h-auto max-h-[70vh] w-auto max-w-full object-contain"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button type="button" onClick={flipHorizontal} className={button}>
          <FlipVertical2 size={18} strokeWidth={1.5} aria-hidden="true" />
          Flip horizontal
        </button>
        <button type="button" onClick={flipVertical} className={button}>
          <FlipHorizontal2 size={18} strokeWidth={1.5} aria-hidden="true" />
          Flip vertical
        </button>
        <button type="button" onClick={() => rotate(-90)} className={button}>
          <RotateCcw size={18} strokeWidth={1.5} aria-hidden="true" />
          Rotate left
        </button>
        <button type="button" onClick={() => rotate(90)} className={button}>
          <RotateCw size={18} strokeWidth={1.5} aria-hidden="true" />
          Rotate right
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={download}
          disabled={!img}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-[15px] font-medium text-accent-ink shadow-sm transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={18} strokeWidth={1.5} aria-hidden="true" />
          Download Image
        </button>
        <button
          type="button"
          onClick={() => setT(IDENTITY)}
          disabled={!changed}
          className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-[15px] font-medium text-muted transition-colors hover:text-ink disabled:opacity-50"
        >
          <Undo2 size={18} strokeWidth={1.5} aria-hidden="true" />
          Reset changes
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center gap-2 rounded-xl px-4 text-[15px] font-medium text-muted transition-colors hover:text-ink"
        >
          Use another image
        </button>
      </div>
      {img && (
        <p className="mt-3 text-xs text-muted">
          {t.rot % 180 === 0 ? img.naturalWidth : img.naturalHeight} × {t.rot % 180 === 0 ? img.naturalHeight : img.naturalWidth} px ·
          downloads as {(OUTPUT[file.type] ?? OUTPUT["image/png"]).ext.toUpperCase()} at full quality
        </p>
      )}
    </div>
  );
}
