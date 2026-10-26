"use client";

import { useId, useState } from "react";
import { ImageUp } from "lucide-react";

export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

/** Drag-and-drop or click-to-browse image picker. Validates type and size and reports a readable error. */
export function ImageDropzone({
  onFile,
  title = "Drop an image here",
  hint = "or click to choose a file · PNG, JPG or WebP · up to 20 MB",
  disabled = false,
}: {
  onFile: (file: File) => void;
  title?: string;
  hint?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function accept(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp|gif|bmp)$/.test(file.type)) {
      setError("That file isn’t a supported image. Please choose a PNG, JPG or WebP.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("That image is larger than 20 MB. Please choose a smaller one.");
      return;
    }
    setError(null);
    onFile(file);
  }

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) accept(e.dataTransfer.files[0]);
        }}
        className={`flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-150 focus-within:ring-2 focus-within:ring-brand-blue ${
          dragging
            ? "border-brand-blue bg-brand-blue/5"
            : "border-line-strong bg-surface hover:bg-surface-2"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <ImageUp size={36} strokeWidth={1.25} className="text-brand-blue" aria-hidden="true" />
        <span className="text-lg font-medium">{title}</span>
        <span className="text-sm text-muted">{hint}</span>
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            accept(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
