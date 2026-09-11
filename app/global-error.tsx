"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message = process.env.NODE_ENV === "development" ? error.message : undefined;

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F4F6F9",
            padding: "24px",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "480px" }}>
            <p style={{ fontFamily: "monospace", fontSize: 12, color: "#F2A71B" }}>
              Error 500
            </p>
            <h1 style={{ fontFamily: "sans-serif", fontSize: 32, color: "#0B1220" }}>
              Something went wrong.
            </h1>
            <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "#475569" }}>
              Try again, and if the problem persists please contact us.
            </p>
            {message && (
              <pre
                style={{
                  background: "#fff",
                  border: "1px solid #E2E8F0",
                  borderRadius: 4,
                  padding: 12,
                  fontSize: 12,
                  textAlign: "left",
                  overflowX: "auto",
                  margin: "16px 0",
                }}
              >
                {message}
              </pre>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  background: "#0B1220",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "12px 24px",
                  fontFamily: "sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <Link
                href="/"
                style={{
                  border: "1px solid #0B1220",
                  color: "#0B1220",
                  borderRadius: 4,
                  padding: "12px 24px",
                  fontFamily: "sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}