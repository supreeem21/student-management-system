import type { Config } from "tailwindcss";

// ============================================================
// Tailwind CSS v4 configures its theme primarily via the
// `@theme` block in app/globals.css. This file exists mainly
// for editor/tooling support (class-name IntelliSense, the
// `content` glob) — see audit §3.4.
// ============================================================

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx}",
    "./icons/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
