import resolveConfig from "tailwindcss/resolveConfig"

import { baseConfig } from "./configs/tailwind.base.config"

/** @type {import('tailwindcss').Config} */
export default resolveConfig({
  ...baseConfig,
  content: [
    "./apps/renderer/src/**/*.{ts,tsx}",
    "./apps/web/src/**/*.{ts,tsx}",

    "./apps/renderer/index.html",
    "./apps/web/index.html",
  ],
})
