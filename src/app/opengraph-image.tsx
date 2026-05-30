import { ImageResponse } from "next/og";

// Dynamic social-share image (link previews on WhatsApp, X, LinkedIn, etc.).
// Brand colours from the Editorial Boutique palette; uses a system serif so
// there's no remote font fetch that could fail at the edge.
export const alt = "Petalcrumb Cake Studio — bespoke celebration cakes, London";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf6f0",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#b86f6a",
          }}
        >
          Est. 2023 · Greater London
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 130, fontWeight: 600, color: "#1f1a14", lineHeight: 1 }}>
            Petalcrumb
          </div>
          <div style={{ display: "flex", fontSize: 44, fontStyle: "italic", color: "#8e4f4a", marginTop: 8 }}>
            Cake Studio
          </div>
          <div style={{ display: "flex", fontSize: 33, color: "#4a4138", marginTop: 28, maxWidth: 920 }}>
            Bespoke celebration cakes, hand-finished in London.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 25,
            color: "#8a8278",
          }}
        >
          <div style={{ display: "flex" }}>petalcrumb-cake-studio.vercel.app</div>
          <div style={{ display: "flex", color: "#b86f6a", fontSize: 40, letterSpacing: 6 }}>
            ***
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
