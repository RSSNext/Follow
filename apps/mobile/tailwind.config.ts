/** @type {import('tailwindcss').Config} */
import resolveConfig from "tailwindcss/resolveConfig"

export default resolveConfig({
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      fontFamily: {
        sn: "SN Pro",
        mono: "monospace",
      },
      colors: {
        accent: "#FF5C00",
        // Palette colors
        red: "rgb(var(--color-red) / <alpha-value>)",
        orange: "rgb(var(--color-orange) / <alpha-value>)",
        yellow: "rgb(var(--color-yellow) / <alpha-value>)",
        green: "rgb(var(--color-green) / <alpha-value>)",
        mint: "rgb(var(--color-mint) / <alpha-value>)",
        teal: "rgb(var(--color-teal) / <alpha-value>)",
        cyan: "rgb(var(--color-cyan) / <alpha-value>)",
        blue: "rgb(var(--color-blue) / <alpha-value>)",
        indigo: "rgb(var(--color-indigo) / <alpha-value>)",
        purple: "rgb(var(--color-purple) / <alpha-value>)",
        pink: "rgb(var(--color-pink) / <alpha-value>)",
        brown: "rgb(var(--color-brown) / <alpha-value>)",
        gray: {
          DEFAULT: "rgb(var(--color-gray) / <alpha-value>)",
          2: "rgb(var(--color-gray2) / <alpha-value>)",
          3: "rgb(var(--color-gray3) / <alpha-value>)",
          4: "rgb(var(--color-gray4) / <alpha-value>)",
          5: "rgb(var(--color-gray5) / <alpha-value>)",
          6: "rgb(var(--color-gray6) / <alpha-value>)",
        },

        // System colors
        label: "rgb(var(--color-label) / <alpha-value>)",
        "secondary-label": "rgb(var(--color-secondaryLabel) / <alpha-value>)",
        "tertiary-label": "rgb(var(--color-tertiaryLabel) / <alpha-value>)",
        "quaternary-label": "rgb(var(--color-quaternaryLabel) / <alpha-value>)",
        "placeholder-text": "rgb(var(--color-placeholderText) / <alpha-value>)",
        separator: "rgb(var(--color-separator) / <alpha-value>)",
        "opaque-separator": "rgb(var(--color-opaqueSeparator) / <alpha-value>)",
        link: "rgb(var(--color-link) / <alpha-value>)",

        // Backgrounds
        "system-background": "rgb(var(--color-systemBackground) / <alpha-value>)",
        "secondary-system-background":
          "rgb(var(--color-secondarySystemBackground) / <alpha-value>)",
        "tertiary-system-background": "rgb(var(--color-tertiarySystemBackground) / <alpha-value>)",
        "system-grouped-background": "rgb(var(--color-systemGroupedBackground) / <alpha-value>)",
        "secondary-system-grouped-background":
          "rgb(var(--color-secondarySystemGroupedBackground) / <alpha-value>)",
        "tertiary-system-grouped-background":
          "rgb(var(--color-tertiarySystemGroupedBackground) / <alpha-value>)",

        // System fills
        "system-fill": "rgb(var(--color-systemFill) / <alpha-value>)",
        "secondary-system-fill": "rgb(var(--color-secondarySystemFill) / <alpha-value>)",
        "tertiary-system-fill": "rgb(var(--color-tertiarySystemFill) / <alpha-value>)",
        "quaternary-system-fill": "rgb(var(--color-quaternarySystemFill) / <alpha-value>)",

        // Text colors
        text: "rgb(var(--color-text) / <alpha-value>)",
        "secondary-text": "rgb(var(--color-secondaryText) / <alpha-value>)",
        "tertiary-text": "rgb(var(--color-tertiaryText) / <alpha-value>)",
        "quaternary-text": "rgb(var(--color-quaternaryText) / <alpha-value>)",
      },
    },
  },
})
