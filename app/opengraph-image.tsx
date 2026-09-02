import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Keyboard Tester — Test Your Keyboard & Typing Speed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0c10",
          color: "#e9ebef",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 72,
              height: 72,
              borderRadius: 16,
              border: "3px solid #e8a33d",
              backgroundColor: "#1a1e26",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              color: "#e8a33d",
            }}
          >
            ⌨
          </div>
          <div style={{ fontSize: 56, fontWeight: 700, display: "flex" }}>Keyboard Tester</div>
        </div>
        <div style={{ fontSize: 28, color: "#8d93a0", display: "flex" }}>
          Test Your Keyboard. Measure Your Speed.
        </div>
      </div>
    ),
    { ...size }
  );
}
