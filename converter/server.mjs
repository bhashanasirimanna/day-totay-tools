// PDF -> DOCX conversion service. Wraps headless LibreOffice. No dependencies.
//
//   POST /convert/pdf-to-word   body: raw PDF bytes (Content-Type: application/pdf)
//   GET  /health
//
// Uploaded files live only in a per-request temp directory that is deleted when the request ends.

import http from "node:http";
import { spawn } from "node:child_process";
import { mkdtemp, rm, readFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const PORT = Number(process.env.PORT ?? 8080);
const MAX_BYTES = Number(process.env.MAX_MB ?? 50) * 1024 * 1024;
const MAX_CONCURRENT = Number(process.env.MAX_CONCURRENT ?? 2);
const MAX_QUEUE = Number(process.env.MAX_QUEUE ?? 8);
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS ?? 120_000);
const RATE_PER_MIN = Number(process.env.RATE_LIMIT_PER_MIN ?? 6);
const SOFFICE = process.env.SOFFICE_BIN ?? "soffice";
// Comma-separated origins allowed to call this service from a browser. "*" allows any (dev only).
const ORIGINS = (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/* ----------------------------------------------------------------- helpers */

function corsHeaders(req) {
  const origin = req.headers.origin;
  const allowed = origin && (ORIGINS.includes("*") || ORIGINS.includes(origin));
  return allowed
    ? {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
        Vary: "Origin",
      }
    : { Vary: "Origin" };
}

function send(req, res, status, body, headers = {}) {
  res.writeHead(status, { ...corsHeaders(req), ...headers });
  res.end(body);
}

const sendError = (req, res, status, message) =>
  send(req, res, status, JSON.stringify({ error: message }), {
    "Content-Type": "application/json",
  });

// Naive per-IP sliding window. Behind a proxy, make sure it sets x-forwarded-for.
const hits = new Map();
function rateLimited(req) {
  const ip =
    (req.headers["x-forwarded-for"] ?? "").toString().split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < 60_000)) hits.delete(k);
  return recent.length > RATE_PER_MIN;
}

// Simple semaphore with a bounded queue.
let running = 0;
const waiting = [];
function acquire() {
  if (running < MAX_CONCURRENT) {
    running++;
    return Promise.resolve(true);
  }
  if (waiting.length >= MAX_QUEUE) return Promise.resolve(false);
  return new Promise((resolve) => waiting.push(resolve));
}
function release() {
  const next = waiting.shift();
  if (next) next(true);
  else running--;
}

function receive(req, file) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const out = createWriteStream(file);
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BYTES) {
        req.destroy();
        out.destroy();
        reject(Object.assign(new Error("too large"), { status: 413 }));
      } else {
        out.write(chunk);
      }
    });
    req.on("end", () => out.end(() => resolve(size)));
    req.on("error", reject);
    out.on("error", reject);
  });
}

function runSoffice(dir, input) {
  return new Promise((resolve, reject) => {
    const args = [
      "--headless",
      "--norestore",
      "--nolockcheck",
      "--nodefault",
      `-env:UserInstallation=file://${dir}/profile`,
      "--infilter=writer_pdf_import",
      "--convert-to",
      "docx:MS Word 2007 XML",
      "--outdir",
      dir,
      input,
    ];
    const child = spawn(SOFFICE, args, { stdio: "ignore" });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(Object.assign(new Error("timeout"), { status: 504 }));
    }, TIMEOUT_MS);
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on("exit", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`soffice exited with ${code}`));
    });
  });
}

/* ------------------------------------------------------------------ routes */

async function convert(req, res) {
  if (rateLimited(req)) {
    return sendError(req, res, 429, "Too many conversions. Please wait a minute and try again.");
  }
  const declared = Number(req.headers["content-length"] ?? 0);
  if (declared > MAX_BYTES) return sendError(req, res, 413, "File is too large.");

  if (!(await acquire())) {
    return sendError(req, res, 503, "The converter is busy right now. Please try again shortly.");
  }

  const dir = await mkdtemp(path.join(tmpdir(), "pdf2docx-"));
  try {
    const input = path.join(dir, "input.pdf");
    await receive(req, input);

    const head = (await readFile(input)).subarray(0, 5).toString("latin1");
    if (head !== "%PDF-") return sendError(req, res, 400, "That doesn’t look like a PDF file.");

    await runSoffice(dir, input);
    const docx = await readFile(path.join(dir, "input.docx"));
    send(req, res, 200, docx, { "Content-Type": DOCX, "Content-Length": docx.length });
  } catch (e) {
    const status = e?.status ?? 500;
    if (res.headersSent) return res.destroy();
    if (status === 413) sendError(req, res, 413, "File is too large.");
    else if (status === 504) sendError(req, res, 504, "The conversion took too long.");
    else {
      console.error("convert failed:", e?.message);
      sendError(req, res, 500, "The file couldn’t be converted.");
    }
  } finally {
    release();
    rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://x");
  if (req.method === "OPTIONS") return send(req, res, 204, "");
  if (req.method === "GET" && pathname === "/health") return send(req, res, 200, "ok");
  if (req.method === "POST" && pathname === "/convert/pdf-to-word") return void convert(req, res);
  sendError(req, res, 404, "Not found.");
});

server.requestTimeout = TIMEOUT_MS + 30_000;
server.listen(PORT, () => console.log(`converter listening on :${PORT}`));
