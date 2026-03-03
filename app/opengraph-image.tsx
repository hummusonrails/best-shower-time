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
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1E1E1C",
          position: "relative",
        }}
      >
        {/* Corner brackets - top left */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            width: 60,
            height: 60,
            borderTop: "2px solid rgba(255, 238, 200, 0.3)",
            borderLeft: "2px solid rgba(255, 238, 200, 0.3)",
            display: "flex",
          }}
        />
        {/* Corner brackets - top right */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 40,
            width: 60,
            height: 60,
            borderTop: "2px solid rgba(255, 238, 200, 0.3)",
            borderRight: "2px solid rgba(255, 238, 200, 0.3)",
            display: "flex",
          }}
        />
        {/* Corner brackets - bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            width: 60,
            height: 60,
            borderBottom: "2px solid rgba(255, 238, 200, 0.3)",
            borderLeft: "2px solid rgba(255, 238, 200, 0.3)",
            display: "flex",
          }}
        />
        {/* Corner brackets - bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            width: 60,
            height: 60,
            borderBottom: "2px solid rgba(255, 238, 200, 0.3)",
            borderRight: "2px solid rgba(255, 238, 200, 0.3)",
            display: "flex",
          }}
        />

        {/* Shower icon - simplified water drops */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 6,
              height: 24,
              backgroundColor: "#FFEEC8",
              borderRadius: 3,
              opacity: 0.4,
              display: "flex",
            }}
          />
          <div
            style={{
              width: 6,
              height: 32,
              backgroundColor: "#FFEEC8",
              borderRadius: 3,
              opacity: 0.6,
              display: "flex",
            }}
          />
          <div
            style={{
              width: 6,
              height: 40,
              backgroundColor: "#FFEEC8",
              borderRadius: 3,
              opacity: 0.8,
              display: "flex",
            }}
          />
          <div
            style={{
              width: 6,
              height: 32,
              backgroundColor: "#FFEEC8",
              borderRadius: 3,
              opacity: 0.6,
              display: "flex",
            }}
          />
          <div
            style={{
              width: 6,
              height: 24,
              backgroundColor: "#FFEEC8",
              borderRadius: 3,
              opacity: 0.4,
              display: "flex",
            }}
          />
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontStyle: "italic",
              fontFamily: "Georgia, serif",
              color: "#FFEEC8",
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Best Shower Time
          </h1>

          {/* Hebrew subtitle */}
          <p
            style={{
              fontSize: 32,
              fontStyle: "italic",
              fontFamily: "Georgia, serif",
              color: "rgba(255, 238, 200, 0.5)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            הזמן הטוב למקלחת
          </p>
        </div>

        {/* Divider line */}
        <div
          style={{
            width: 80,
            height: 1,
            backgroundColor: "rgba(255, 238, 200, 0.2)",
            marginTop: 32,
            marginBottom: 32,
            display: "flex",
          }}
        />

        {/* Tagline */}
        <p
          style={{
            fontSize: 20,
            fontFamily: "system-ui, sans-serif",
            color: "rgba(255, 238, 200, 0.6)",
            margin: 0,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Real-time rocket alert analysis for daily safety decisions
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
