import resolveConfig from "tailwindcss/resolveConfig"

import { baseConfig } from "../../configs/tailwind.base.config"

/** @type {import('tailwindcss').Config} */
export default resolveConfig({
  ...baseConfig,
  content: ["./client/**/*.{ts,tsx}", "./node_modules/@follow/components/**/*.{ts,tsx}"],
})
