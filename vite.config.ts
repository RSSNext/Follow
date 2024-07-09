import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { sentryVitePlugin } from "@sentry/vite-plugin"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const pkg = JSON.parse(readFileSync("package.json", "utf8"))
const __dirname = fileURLToPath(new URL(".", import.meta.url))
export default defineConfig({
  build: {
    outDir: resolve(__dirname, "out/web"),
    target: "ES2022",
    sourcemap: true,
  },
  root: "./src/renderer",
  resolve: {
    alias: {
      "@renderer": resolve("src/renderer/src"),
      "@shared": resolve("src/shared/src"),
      "@pkg": resolve("./package.json"),
    },
  },
  base: "/",
  plugins: [
    react(),
    sentryVitePlugin({
      org: "follow-rg",
      project: "javascript-react",
    }),
  ],
  define: {
    APP_VERSION: JSON.stringify(pkg.version),
    APP_NAME: JSON.stringify(pkg.productName),
  },
})
