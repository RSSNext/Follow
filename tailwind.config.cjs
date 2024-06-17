const {
  iconsPlugin,
  getIconCollections,
} = require("@egoist/tailwindcss-icons")

require("./cssAsPlugin")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", "[data-theme=\"dark\"]"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },

    extend: {
      fontFamily: {
        theme: "var(--fo-font-family)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        native: {
          DEFAULT: "hsl(var(--native))",
          active: "hsl(var(--native-active))",
        },

        theme: {
          // https://uicolors.app/create
          accent: {
            DEFAULT: "#ff5c00",
            50: "#fff7ec",
            100: "#ffeed3",
            200: "#ffd9a5",
            300: "#ffbd6d",
            400: "#ff9532",
            500: "#ff760a",
            600: "#ff5c00",
            700: "#cc4102",
            800: "#a1330b",
            900: "#822c0c",
            950: "#461304",
          },

          vibrancyFg: "var(--fo-vibrancy-foreground)",
          vibrancyBg: "var(--fo-vibrancy-background)",

          item: {
            active: "var(--fo-item-active)",
            hover: "var(--fo-item-hover)",
          },

          tooltip: {
            background: "var(--fo-tooltip-background)",
            foreground: "var(--fo-tooltip-foreground)",
          },

          inactive: "var(--fo-inactive)",
          disabled: "var(--fo-disabled)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      typography: (theme) => ({
        zinc: {
          css: {
            "--tw-prose-body": theme("colors.zinc.500"),
            "--tw-prose-quotes": theme("colors.zinc.500"),
          },
        },
      }),
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["mingcute"]),
    }),
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
    require("./src/renderer/src/styles/tailwind-extend.css"),
  ],
}
