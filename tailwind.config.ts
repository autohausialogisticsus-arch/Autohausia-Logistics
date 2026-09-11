import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1220",      // near-black navy, header/footer/dispatch-board bg
        steel: "#16223A",    // deep slate-navy, section alt background
        fog: "#F5F6F7",      // light section background
        amber: "#F2A71B",    // signal accent (safety-amber, not terracotta)
        slate: "#475569",    // body copy
        line: "#DCE1E8",     // hairline dividers
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
