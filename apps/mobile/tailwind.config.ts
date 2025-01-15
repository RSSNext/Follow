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

        "placeholder-text": "rgb(var(--color-placeholderText) / <alpha-value>)",
        separator: "rgb(var(--color-separator) / <alpha-value>)",
        "opaque-separator": "rgba(var(--color-opaqueSeparator))",
        "non-opaque-separator": "rgba(var(--color-nonOpaqueSeparator))",
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
        "system-fill": "rgba(var(--color-systemFill))",
        "secondary-system-fill": "rgba(var(--color-secondarySystemFill))",
        "tertiary-system-fill": "rgba(var(--color-tertiarySystemFill))",
        "quaternary-system-fill": "rgba(var(--color-quaternarySystemFill))",

        // Text colors
        label: "rgb(var(--color-text) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        "secondary-label": "rgba(var(--color-secondaryLabel))",
        "tertiary-label": "rgba(var(--color-tertiaryLabel))",
        "quaternary-label": "rgba(var(--color-quaternaryLabel))",

        // Extended colors
        disabled: "rgb(var(--color-disabled) / <alpha-value>)",
        "item-pressed": "rgb(var(--color-itemPressed) / <alpha-value>)",
      },
    },
  },
})
