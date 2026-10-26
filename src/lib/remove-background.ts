/**
 * Single entry point for background removal so the engine can be swapped in one place.
 * The library (and its WASM runtime) is imported lazily so it never touches the initial bundle.
 * Everything runs in the visitor's browser; the image itself is never uploaded.
 */
export async function removeBackgroundFromImage(
  file: Blob,
  onProgress: (fraction: number, phase: "download" | "process") => void,
): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");

  // Progress is reported per asset ("fetch:<file>" while downloading the model, "compute:*" while running it).
  const fetched = new Map<string, { current: number; total: number }>();

  return removeBackground(file, {
    output: { format: "image/png" },
    progress: (key, current, total) => {
      if (key.startsWith("fetch")) {
        fetched.set(key, { current, total });
        let c = 0;
        let t = 0;
        for (const v of fetched.values()) {
          c += v.current;
          t += v.total;
        }
        onProgress(t > 0 ? Math.min(1, c / t) : 0, "download");
      } else {
        onProgress(total > 0 ? Math.min(1, current / total) : 0, "process");
      }
    },
  });
}
