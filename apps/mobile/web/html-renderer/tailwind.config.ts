import path from "node:path"

import resolveConfig from "tailwindcss/resolveConfig"

import { baseTwConfig } from "../../../../configs/tailwind.base.config"

const rootDir = path.resolve(__dirname, "../../../..")

export default resolveConfig({
  ...baseTwConfig,
  darkMode: "media",
  future: { hoverOnlyWhenSupported: true },
  content: ["./src/**/*.{ts,tsx}", path.resolve(rootDir, "packages/components/src/**/*.{ts,tsx}")],
})
