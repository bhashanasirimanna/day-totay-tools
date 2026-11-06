"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const field =
  "mt-1.5 block w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

/** Opens the visitor's email client with the message prefilled. No data is sent to our servers. */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p role="status" className="rounded-2xl border border-line bg-surface-2 p-5 text-[15px]">
        Your email app should have opened with your message ready to send. If it did not, please write to us directly at {site.email}.
      </p>
    );
  }

  return (
    <form
      className="not-prose mt-5 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = String(data.get("name") ?? "");
        const email = String(data.get("email") ?? "");
        const message = String(data.get("message") ?? "");
        const subject = encodeURIComponent(`${site.name} message from ${name}`);
        const body = encodeURIComponent(`${message}

From: ${name} (${email})`);
        window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
        setSent(true);
      }}
    >
      <label className="block text-sm font-medium">
        Name
        <input name="name" type="text" required autoComplete="name" className={field} />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block text-sm font-medium">
        Message
        <textarea name="message" required rows={5} className={field} />
      </label>
      <button
        type="submit"
        className="inline-flex min-h-11 items-center rounded-xl bg-accent px-5 text-sm font-medium text-accent-ink transition-colors duration-150 hover:bg-accent-hover"
      >
        Send message
      </button>
    </form>
  );
}
