/* eslint-disable @typescript-eslint/no-require-imports */
import "./cssAsPlugin"

import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons"
import {
  cleanupSVG,
  importDirectorySync,
  isEmptyColor,
  parseColors,
  runSVGO,
} from "@iconify/tools"
import { compareColors, stringToColor } from "@iconify/utils/lib/colors"
import resolveConfig from "tailwindcss/resolveConfig"

/** @type {import('tailwindcss').Config} */
export default resolveConfig({
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

          foreground: "var(--fo-text-foreground)",
          background: "var(--fo-background)",
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
      collections: {
        ...getIconCollections(["mingcute"]),
        mgc: getCollections("./icons/mgc"),
      },
    }),
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
    require("./src/renderer/src/styles/tailwind-extend.css"),
  ],
})

function getCollections(dir: string) {
  // Import icons
  const iconSet = importDirectorySync(dir, {
    includeSubDirs: false,
  })

  // Validate, clean up, fix palette and optimism
  iconSet.forEachSync((name, type) => {
    if (type !== "icon") {
      return
    }

    const svg = iconSet.toSVG(name)
    if (!svg) {
      // Invalid icon
      iconSet.remove(name)
      return
    }

    // Clean up and optimize icons
    try {
      // Clean up icon code
      cleanupSVG(svg)

      // Change color to `currentColor`
      // Skip this step if icon has hardcoded palette
      const blackColor = stringToColor("black")!
      const whiteColor = stringToColor("white")!
      parseColors(svg, {
        defaultColor: "currentColor",
        callback: (attr, colorStr, color) => {
          if (!color) {
            // Color cannot be parsed!
            throw new Error(
              `Invalid color: "${colorStr}" in attribute ${attr}`,
            )
          }

          if (isEmptyColor(color)) {
            // Color is empty: 'none' or 'transparent'. Return as is
            return color
          }

          // Change black to 'currentColor'
          if (compareColors(color, blackColor)) {
            return "currentColor"
          }

          // Remove shapes with white color
          if (compareColors(color, whiteColor)) {
            return "remove"
          }

          // NOTE: MGC icons has default color of #10161F
          if (compareColors(color, stringToColor("#10161F")!)) {
            return "currentColor"
          }

          // Icon is not monotone
          return color
        },
      })

      runSVGO(svg)
    } catch (err) {
      // Invalid icon
      console.error(`Error parsing ${name}:`, err)
      iconSet.remove(name)
      return
    }

    // Update icon
    iconSet.fromSVG(name, svg)
  })

  // Export
  return iconSet.export()
}
