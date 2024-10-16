import "./tw-css-plugin"

import path, { resolve } from "node:path"

import { getIconCollections, iconsPlugin } from "@egoist/tailwindcss-icons"
import { cleanupSVG, importDirectorySync, isEmptyColor, parseColors, runSVGO } from "@iconify/tools"
import { compareColors, stringToColor } from "@iconify/utils/lib/colors"
import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

export const baseConfig: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [],
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
      spacing: {
        "safe-inset-top": "var(--fo-window-padding-top, 0)",
      },
      fontFamily: {
        theme: "var(--fo-font-family)",
        default: "SN pro, sans-serif, system-ui",
      },
      cursor: {
        button: "var(--cursor-button)",
        select: "var(--cursor-select)",
        checkbox: "var(--cursor-checkbox)",
        link: "var(--cursor-link)",
        menu: "var(--cursor-menu)",
        radio: "var(--cursor-radio)",
        switch: "var(--cursor-switch)",
        card: "var(--cursor-card)",
      },
      width: {
        "feed-col": "var(--fo-feed-col-w)",
      },
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",

        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: "hsl(var(--fo-a) / <alpha-value>)",

        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        native: {
          DEFAULT: "hsl(var(--fo-native) / <alpha-value>)",
          active: "hsl(var(--fo-native-active) / <alpha-value>)",
        },

        theme: {
          // https://uicolors.app/create
          accent: {
            DEFAULT: "hsl(var(--fo-a) / <alpha-value>)",
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

          vibrancyFg: "hsl(var(--fo-vibrancy-foreground) / <alpha-value>)",
          vibrancyBg: "var(--fo-vibrancy-background)",

          item: {
            active: "var(--fo-item-active)",
            hover: "var(--fo-item-hover)",
          },

          inactive: "hsl(var(--fo-inactive) / <alpha-value>)",
          disabled: "hsl(var(--fo-disabled) / <alpha-value>)",

          foreground: "hsl(var(--fo-text-primary) / <alpha-value>)",
          background: "var(--fo-background)",

          "foreground-hover": "hsl(var(--fo-text-primary-hover) / <alpha-value>)",

          modal: {
            background: "var(--fo-modal-background)",
            "background-opaque": "var(--fo-modal-background-opaque)",
          },
          button: {
            hover: "var(--fo-button-hover)",
          },

          placeholder: {
            text: "var(--fo-text-placeholder)",
            image: "var(--fo-image-placeholder)",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        ...getIconCollections(["mingcute", "simple-icons", "logos"]),
        mgc: getCollections(path.resolve(__dirname, "../icons/mgc")),
      },
    }),
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
    require("@tailwindcss/typography"),
    require("tailwindcss-motion"),

    require(resolve(__dirname, "./tailwind-extend.css")),

    plugin(({ addVariant }) => {
      addVariant("f-motion-reduce", '[data-motion-reduce="true"] &')
      addVariant("group-motion-reduce", ':merge(.group)[data-motion-reduce="true"] &')
      addVariant("peer-motion-reduce", ':merge(.peer)[data-motion-reduce="true"] ~ &')
    }),
    plugin(({ addUtilities, matchUtilities, theme }) => {
      addUtilities({
        ".safe-inset-top": {
          top: "var(--fo-window-padding-top, 0)",
        },
      })

      const safeInsetTopVariants = {}
      for (let i = 1; i <= 16; i++) {
        safeInsetTopVariants[`.safe-inset-top-${i}`] = {
          top: `calc(var(--fo-window-padding-top, 0px) + ${theme(`spacing.${i}`)})`,
        }
      }
      addUtilities(safeInsetTopVariants)

      // Add arbitrary value support
      matchUtilities(
        {
          "safe-inset-top": (value) => ({
            top: `calc(var(--fo-window-padding-top, 0px) + ${value})`,
          }),
        },
        { values: theme("spacing") },
      )
    }),
  ],
}

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
            throw new Error(`Invalid color: "${colorStr}" in attribute ${attr}`)
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
