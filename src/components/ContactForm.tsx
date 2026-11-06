"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const field =
  "mt-1.5 block w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-60";

type Status = "idle" | "loading" | "success" | "error";

/** Sends the message through Web3Forms, which forwards it to the inbox tied to the access key. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setError("The contact form is not configured yet. Please try again later.");
      setStatus("error");
      return;
    }

    const data = new FormData(form);
    data.append("access_key", accessKey);
    data.append("subject", `${site.name} contact form message`);
    data.append("from_name", site.name);

    setStatus("loading");
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = (await res.json()) as { success?: boolean; message?: string };
      if (res.ok && json.success) {
        form.reset();
        setStatus("success");
      } else {
        setError(json.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  const loading = status === "loading";

  return (
    <form className="not-prose mt-5 space-y-4" onSubmit={onSubmit}>
      <label className="block text-sm font-medium">
        Name
        <input name="name" type="text" required autoComplete="name" disabled={loading} className={field} />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" disabled={loading} className={field} />
      </label>
      <label className="block text-sm font-medium">
        Message
        <textarea name="message" required rows={5} disabled={loading} className={field} />
      </label>

      {/* Honeypot: real visitors never see or fill this; Web3Forms discards submissions where it is checked. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-11 items-center rounded-xl bg-accent px-5 text-sm font-medium text-accent-ink transition-colors duration-150 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send message"}
      </button>

      <div aria-live="polite">
        {status === "success" && (
          <p role="status" className="rounded-2xl border border-line bg-surface-2 p-4 text-[15px]">
            Thanks, your message has been sent. We will reply within a few working days.
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-[15px]">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
