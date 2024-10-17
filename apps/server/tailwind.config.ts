import resolveConfig from "tailwindcss/resolveConfig"

import { baseConfig } from "../../configs/tailwind.base.config"

/** @type {import('tailwindcss').Config} */
export default resolveConfig({
  ...baseConfig,
  content: [
    "./client/**/*.{ts,tsx}",
    "./index.html",
    "./node_modules/@follow/components/**/*.{ts,tsx}",
  ],
  plugins: [...baseConfig.plugins, require("daisyui")],
  daisyui: {
    logs: false,
    darkTheme: "dark",
    themes: [
      {
        light: {
          "color-scheme": "light",

          primary: "#007AFF", //#0A84FF
          accent: "#ff760a",
          "accent-content": "#fafafa",
          neutral: "#04262d",
          "base-100": "#fafffd",

          info: "#32ADE6", // 50 173 230
          success: "#34C759",
          warning: "#ff9f0a",
          error: "#ff453a", // 255 59 48

          "--rounded-btn": "1.9rem",
          "--tab-border": "2px",
          "--tab-radius": ".5rem",
        },
        dark: {
          "color-scheme": "dark",

          primary: "#0A84FF",
          accent: "#ff760a",
          "accent-content": "#fafafa",
          neutral: "#04262d",
          "base-100": "#fafffd",

          info: "#32ADE6", // 50 173 230
          success: "#34C759",
          warning: "#ff9f0a",
          error: "#ff453a", // 255 59 48

          "--rounded-btn": "1.9rem",
          "--tab-border": "2px",
          "--tab-radius": ".5rem",
        },
      },
    ],
  },
})
