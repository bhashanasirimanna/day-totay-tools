import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} - Free PDF & Web Tools`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colors mirror the light theme tokens in globals.css (ImageResponse can't read CSS variables).
const BG = "#faf9f6";
const INK = "#111111";
const MUTED = "#5e5b55";
const ACCENT = "#23408e";
const LINE = "#e6e3da";

const chips = ["Merge PDF", "Split PDF", "Unit converters"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px 80px",
          borderTop: `16px solid ${ACCENT}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: ACCENT,
              color: "#ffffff",
              fontSize: 40,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            T
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: INK }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: INK,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Free PDF &amp; Web Tools
          </div>
          <div style={{ fontSize: 34, color: MUTED, marginTop: 24 }}>
            No signup. No watermark. Works in your browser.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {chips.map((c) => (
              <div
                key={c}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  border: `2px solid ${LINE}`,
                  borderRadius: 999,
                  background: "#ffffff",
                  fontSize: 26,
                  color: INK,
                }}
              >
                {c}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 28, color: ACCENT, fontWeight: 600 }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
