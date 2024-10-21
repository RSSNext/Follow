import daisyui from "daisyui"
import { omit } from "lodash-es"
import resolveConfig from "tailwindcss/resolveConfig"

import { baseConfig } from "../../configs/tailwind.base.config"
/** @type {import('tailwindcss').Config} */
export default resolveConfig({
  ...baseConfig,
  theme: {
    ...baseConfig.theme,
    extend: {
      ...baseConfig.theme.extend,
      colors: {
        ...omit(baseConfig.theme.extend.colors, "accent"),
      },
    },
  },
  content: [
    "./client/**/*.{ts,tsx}",
    "./index.html",
    "./node_modules/@follow/components/**/*.{ts,tsx}",
  ],
  plugins: [...baseConfig.plugins, daisyui],
  daisyui: {
    logs: false,
    darkTheme: "dark",
    themes: [
      {
        light: {
          "color-scheme": "light",

          primary: "#007AFF", //#0A84FF
          accent: "#ff760a",
          "accent-content": "#fff",
          neutral: "#212427",

          "base-100": "#fff",
          "base-content": "#0C0A09",

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
          "accent-content": "#fff",
          neutral: "#2a2a2a",
          "base-100": "#121212",
          "base-content": "#FAFAF9",

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
