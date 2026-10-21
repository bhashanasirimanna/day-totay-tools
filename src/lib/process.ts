/**
 * Client-side PDF processing. Everything here runs in the visitor's browser, so files are never
 * uploaded. Heavy libraries are loaded with dynamic import() so they only download when a tool
 * is actually used.
 */

export interface OutputFile {
  name: string;
  blob: Blob;
}

export interface ProcessResult {
  outputs: OutputFile[];
  summary: string;
}

export interface ProcessOptions {
  /** split-pdf: e.g. "1-3, 7". Empty means "every page as its own file". */
  pageRange?: string;
}

/** An error whose message is safe and useful to show directly to the visitor. */
export class UserError extends Error {}

type Progress = (percent: number) => void;

const baseName = (f: File) => f.name.replace(/\.pdf$/i, "") || "document";
const pdfBlob = (bytes: Uint8Array<ArrayBufferLike>) =>
  new Blob([new Uint8Array(bytes)], { type: "application/pdf" });

export async function processFiles(
  slug: string,
  files: File[],
  onProgress: Progress,
  options: ProcessOptions = {},
): Promise<ProcessResult> {
  switch (slug) {
    case "merge-pdf":
      return mergePdf(files, onProgress);
    case "split-pdf":
      return splitPdf(files[0], onProgress, options.pageRange ?? "");
    case "pdf-to-jpg":
      return pdfToJpg(files[0], onProgress);
    case "pdf-to-word":
      return pdfToWord(files[0], onProgress);
    default:
      throw new UserError("This tool isn’t available yet.");
  }
}

/* ------------------------------------------------------------------ pdf-lib */

async function loadPdfLib(file: File) {
  const { PDFDocument } = await import("pdf-lib");
  const bytes = await file.arrayBuffer();
  try {
    return { PDFDocument, doc: await PDFDocument.load(bytes) };
  } catch (e) {
    const msg = e instanceof Error ? e.message.toLowerCase() : "";
    if (msg.includes("encrypt")) {
      throw new UserError(
        `“${file.name}” is password-protected. Remove the password first, then try again.`,
      );
    }
    throw new UserError(`“${file.name}” couldn’t be read. It may be damaged.`);
  }
}

async function mergePdf(files: File[], onProgress: Progress): Promise<ProcessResult> {
  const { PDFDocument } = await import("pdf-lib");
  const merged = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const { doc } = await loadPdfLib(files[i]);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
    onProgress(Math.round(((i + 1) / files.length) * 90));
  }

  const bytes = await merged.save();
  onProgress(100);
  return {
    outputs: [{ name: "merged.pdf", blob: pdfBlob(bytes) }],
    summary: `Merged ${files.length} files into one PDF of ${merged.getPageCount()} pages.`,
  };
}

/** "1-3, 7" -> [1,2,3,7]. Throws UserError on bad input. */
function parseRange(input: string, total: number): number[] {
  const pages = new Set<number>();
  for (const part of input.split(",").map((s) => s.trim()).filter(Boolean)) {
    const m = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
    if (!m) throw new UserError(`“${part}” isn’t a valid page range. Try something like 1-3, 7.`);
    const start = Number(m[1]);
    const end = m[2] ? Number(m[2]) : start;
    if (start < 1 || end < start || end > total) {
      throw new UserError(`“${part}” is outside this document, which has ${total} page${total === 1 ? "" : "s"}.`);
    }
    for (let p = start; p <= end; p++) pages.add(p);
  }
  return [...pages].sort((a, b) => a - b);
}

async function splitPdf(file: File, onProgress: Progress, range: string): Promise<ProcessResult> {
  const { PDFDocument, doc } = await loadPdfLib(file);
  const total = doc.getPageCount();
  const base = baseName(file);

  if (range.trim()) {
    const pages = parseRange(range, total);
    const out = await PDFDocument.create();
    (await out.copyPages(doc, pages.map((p) => p - 1))).forEach((p) => out.addPage(p));
    const bytes = await out.save();
    onProgress(100);
    return {
      outputs: [{ name: `${base}-selected-pages.pdf`, blob: pdfBlob(bytes) }],
      summary: `Extracted ${pages.length} page${pages.length === 1 ? "" : "s"} into one PDF.`,
    };
  }

  const outputs: OutputFile[] = [];
  for (let i = 0; i < total; i++) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(doc, [i]);
    out.addPage(page);
    outputs.push({ name: `${base}-page-${i + 1}.pdf`, blob: pdfBlob(await out.save()) });
    onProgress(Math.round(((i + 1) / total) * 100));
  }
  return { outputs, summary: `Split into ${total} separate PDF${total === 1 ? "" : "s"}.` };
}

/* ------------------------------------------------------------------- pdf.js */

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  return pdfjs;
}

async function openWithPdfjs(file: File) {
  const pdfjs = await loadPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  try {
    return await pdfjs.getDocument({ data }).promise;
  } catch (e) {
    if (e instanceof Error && e.name === "PasswordException") {
      throw new UserError(
        `“${file.name}” is password-protected. Remove the password first, then try again.`,
      );
    }
    throw new UserError(`“${file.name}” couldn’t be read. It may be damaged.`);
  }
}

async function pdfToJpg(file: File, onProgress: Progress): Promise<ProcessResult> {
  const pdf = await openWithPdfjs(file);
  const base = baseName(file);
  const outputs: OutputFile[] = [];

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const natural = page.getViewport({ scale: 1 });
    // ~150 DPI, capped so very large pages don't exhaust memory.
    const scale = Math.min(2, 4096 / Math.max(natural.width, natural.height));
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new UserError("Your browser can’t render images here.");
    ctx.fillStyle = "#ffffff"; // JPG has no transparency
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.92));
    if (!blob) throw new UserError("Couldn’t create the image. Try a smaller file.");

    outputs.push({ name: `${base}-page-${n}.jpg`, blob });
    page.cleanup();
    onProgress(Math.round((n / pdf.numPages) * 100));
  }

  await pdf.destroy();
  return {
    outputs,
    summary: `Created ${outputs.length} JPG image${outputs.length === 1 ? "" : "s"}.`,
  };
}

/* -------------------------------------------------------------- pdf to word */

interface Line {
  y: number;
  xMin: number;
  xMax: number;
  size: number;
  text: string;
}

interface TextPiece {
  x: number;
  width: number;
  size: number;
  str: string;
}

async function extractLines(page: Awaited<ReturnType<Awaited<ReturnType<typeof openWithPdfjs>>["getPage"]>>) {
  const content = await page.getTextContent();
  const rows: { y: number; items: TextPiece[] }[] = [];

  for (const item of content.items) {
    if (!("str" in item) || !item.str.trim()) continue;
    const [a, b, , , x, y] = item.transform as number[];
    const size = Math.hypot(a, b) || item.height || 10;
    const row = rows.find((r) => Math.abs(r.y - y) < Math.max(2, size * 0.4));
    const piece = { x, width: item.width, size, str: item.str };
    if (row) row.items.push(piece);
    else rows.push({ y, items: [piece] });
  }

  rows.sort((r1, r2) => r2.y - r1.y);

  return rows.map<Line>((r) => {
    r.items.sort((p, q) => p.x - q.x);
    let text = "";
    let prevEnd = r.items[0].x;
    for (const it of r.items) {
      const gap = it.x - prevEnd;
      const needsSpace = text && gap > it.size * 0.2 && !/\s$/.test(text) && !/^\s/.test(it.str);
      text += (needsSpace ? " " : "") + it.str;
      prevEnd = it.x + it.width;
    }
    return {
      y: r.y,
      xMin: r.items[0].x,
      xMax: prevEnd,
      size: Math.max(...r.items.map((i) => i.size)),
      text: text.replace(/\s+/g, " ").trim(),
    };
  });
}

const CONVERTER_URL = process.env.NEXT_PUBLIC_CONVERTER_URL?.replace(/\/$/, "");

/** High-fidelity conversion on our LibreOffice service; falls back to the browser converter if unset. */
async function pdfToWord(file: File, onProgress: Progress): Promise<ProcessResult> {
  if (!CONVERTER_URL) return pdfToWordInBrowser(file, onProgress);

  const blob = await new Promise<Blob>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${CONVERTER_URL}/convert/pdf-to-word`);
    xhr.responseType = "blob";
    xhr.setRequestHeader("Content-Type", "application/pdf");

    // Upload is 0-40%. After that the server is working, so creep towards 95% until it answers.
    let creep: ReturnType<typeof setInterval> | undefined;
    const stop = () => creep && clearInterval(creep);
    let shown = 0;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress((shown = Math.round((e.loaded / e.total) * 40)));
    };
    xhr.upload.onload = () => {
      shown = Math.max(shown, 40);
      creep = setInterval(() => {
        shown = Math.min(95, shown + Math.max(1, Math.round((95 - shown) * 0.06)));
        onProgress(shown);
      }, 400);
    };

    xhr.onload = async () => {
      stop();
      if (xhr.status === 200) return resolve(xhr.response as Blob);
      let message = "The file couldn’t be converted. Please try again.";
      try {
        message = JSON.parse(await (xhr.response as Blob).text()).error ?? message;
      } catch {
        // keep the generic message
      }
      reject(new UserError(message));
    };
    xhr.onerror = () => {
      stop();
      reject(new UserError("The conversion service can’t be reached right now. Please try again later."));
    };
    xhr.send(file);
  });

  onProgress(100);
  return {
    outputs: [{ name: `${baseName(file)}.docx`, blob }],
    summary:
      "Converted with layout preserved as closely as possible. Text sits in positioned boxes to match the PDF, so check the result and tidy any tables before sending it on.",
  };
}

async function pdfToWordInBrowser(file: File, onProgress: Progress): Promise<ProcessResult> {
  const pdf = await openWithPdfjs(file);
  const pages: Line[][] = [];

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    pages.push(await extractLines(page));
    page.cleanup();
    onProgress(Math.round((n / pdf.numPages) * 70));
  }
  await pdf.destroy();

  const allLines = pages.flat();
  const chars = allLines.reduce((sum, l) => sum + l.text.length, 0);
  if (chars < 20) {
    throw new UserError(
      "This PDF has no selectable text. It looks like a scan or an image-only file, which needs OCR before it can be turned into Word.",
    );
  }

  const sizes = allLines.map((l) => l.size).sort((a, b) => a - b);
  const bodySize = sizes[Math.floor(sizes.length / 2)];

  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
  type Para = InstanceType<typeof Paragraph>;
  const paragraphs: Para[] = [];

  pages.forEach((lines, pageIndex) => {
    const maxWidth = Math.max(1, ...lines.map((l) => l.xMax - l.xMin));
    let buffer = "";
    let bufferSize = bodySize;
    let prev: Line | null = null;
    let first = pageIndex > 0;

    const flush = () => {
      if (!buffer) return;
      const ratio = bufferSize / bodySize;
      const heading =
        ratio >= 1.6 ? HeadingLevel.HEADING_1 : ratio >= 1.25 ? HeadingLevel.HEADING_2 : undefined;
      paragraphs.push(
        new Paragraph({
          heading,
          pageBreakBefore: first,
          spacing: { after: heading ? 160 : 120, line: 276 },
          children: [
            new TextRun({
              text: buffer,
              bold: Boolean(heading),
              size: Math.min(72, Math.max(16, Math.round(bufferSize * 2))),
            }),
          ],
        }),
      );
      first = false;
      buffer = "";
    };

    for (const line of lines) {
      const gap = prev ? prev.y - line.y : 0;
      const sizeChanged = prev ? Math.abs(prev.size - line.size) > bodySize * 0.15 : false;
      const prevWasShort = prev ? prev.xMax - prev.xMin < maxWidth * 0.6 : false;
      const newParagraph =
        !prev || gap > line.size * 1.7 || sizeChanged || prevWasShort;

      if (newParagraph) {
        flush();
        buffer = line.text;
        bufferSize = line.size;
      } else if (buffer.endsWith("-")) {
        buffer = buffer.slice(0, -1) + line.text;
      } else {
        buffer += " " + line.text;
      }
      prev = line;
    }
    flush();
  });

  onProgress(90);
  const doc = new Document({ sections: [{ children: paragraphs }] });
  const blob = await Packer.toBlob(doc);
  onProgress(100);

  return {
    outputs: [{ name: `${baseName(file)}.docx`, blob }],
    summary:
      "Text, headings and paragraphs were converted. Images, tables and complex layouts aren’t carried over, so check the result before sending it on.",
  };
}

/* ---------------------------------------------------------------------- zip */

export async function zipOutputs(outputs: OutputFile[], name: string): Promise<OutputFile> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  outputs.forEach((o) => zip.file(o.name, o.blob));
  return { name, blob: await zip.generateAsync({ type: "blob" }) };
}
