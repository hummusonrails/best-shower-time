import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Best Shower Time - Real-time rocket alert analysis for daily safety decisions";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1E1E1C",
          position: "relative",
          padding: 48,
        }}
      >
        {/* Corner brackets */}
        <div style={{ position: "absolute", top: 24, left: 24, width: 40, height: 40, borderTop: "2px solid rgba(255,238,200,0.25)", borderLeft: "2px solid rgba(255,238,200,0.25)", display: "flex" }} />
        <div style={{ position: "absolute", top: 24, right: 24, width: 40, height: 40, borderTop: "2px solid rgba(255,238,200,0.25)", borderRight: "2px solid rgba(255,238,200,0.25)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 24, left: 24, width: 40, height: 40, borderBottom: "2px solid rgba(255,238,200,0.25)", borderLeft: "2px solid rgba(255,238,200,0.25)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: 24, right: 24, width: 40, height: 40, borderBottom: "2px solid rgba(255,238,200,0.25)", borderRight: "2px solid rgba(255,238,200,0.25)", display: "flex" }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 28, fontStyle: "italic", fontFamily: "Georgia, serif", color: "#FFEEC8", display: "flex" }}>
            Best Shower Time
          </div>
          <div style={{ display: "flex", gap: 0, border: "1px solid rgba(255,238,200,0.2)", borderRadius: 2 }}>
            <div style={{ padding: "6px 12px", fontSize: 13, fontFamily: "monospace", color: "#FFEEC8", backgroundColor: "rgba(255,238,200,0.1)", display: "flex" }}>EN</div>
            <div style={{ padding: "6px 12px", fontSize: 13, fontFamily: "monospace", color: "rgba(255,238,200,0.4)", display: "flex" }}>HE</div>
          </div>
        </div>

        {/* Score gauge + verdict */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          {/* Circular score */}
          <div style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            border: "3px solid #4ADE80",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px rgba(74,222,128,0.15)",
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 42, fontFamily: "monospace", fontWeight: 700, color: "#4ADE80", display: "flex" }}>82</div>
            <div style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,238,200,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", display: "flex" }}>SCORE</div>
          </div>
          {/* Verdict with bracket frame */}
          <div style={{
            display: "flex",
            position: "relative",
            padding: "14px 32px",
            backgroundColor: "rgba(74,222,128,0.05)",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 10, height: 10, borderTop: "1px solid rgba(255,238,200,0.25)", borderLeft: "1px solid rgba(255,238,200,0.25)", display: "flex" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderBottom: "1px solid rgba(255,238,200,0.25)", borderRight: "1px solid rgba(255,238,200,0.25)", display: "flex" }} />
            <div style={{ fontSize: 32, fontStyle: "italic", fontFamily: "Georgia, serif", color: "#4ADE80", display: "flex" }}>
              NOW IS A GOOD TIME
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24 }}>
          {[
            { label: "LAST ALERT", value: "47 min" },
            { label: "AVG GAP", value: "32 min" },
            { label: "24H ALERTS", value: "12" },
            { label: "TREND", value: "Stable" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "12px 20px",
                position: "relative",
                flex: 1,
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, width: 8, height: 8, borderTop: "1px solid rgba(255,238,200,0.2)", borderLeft: "1px solid rgba(255,238,200,0.2)", display: "flex" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 8, height: 8, borderBottom: "1px solid rgba(255,238,200,0.2)", borderRight: "1px solid rgba(255,238,200,0.2)", display: "flex" }} />
              <div style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,238,200,0.35)", letterSpacing: "0.05em", display: "flex" }}>{stat.label}</div>
              <div style={{ fontSize: 22, fontFamily: "monospace", color: "#FFEEC8", display: "flex" }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* URL footer */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "auto" }}>
          <div style={{ fontSize: 14, fontFamily: "monospace", color: "rgba(255,238,200,0.25)", display: "flex" }}>
            bestshowertime.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
