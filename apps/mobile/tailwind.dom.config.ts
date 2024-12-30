import type { Config } from "tailwindcss"

import { baseTwConfig } from "../../configs/tailwind.base.config"

export default {
  ...baseTwConfig,
  darkMode: "media",
  content: ["../../packages/**/*.{ts,tsx}"],
} satisfies Config
