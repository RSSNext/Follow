import fs from "node:fs"
import { resolve } from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "electron-vite"

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@shared": resolve("src/shared/src"),
      },
    },
  },
  preload: {},
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@shared": resolve("src/shared/src"),
      },
    },
    plugins: [react()],
    define: {
      APP_VERSION: JSON.stringify(pkg.version),
      APP_NAME: JSON.stringify(pkg.productName),
    },
  },
})
