import path from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { viteRenderBaseConfig } from "../../../../configs/vite.render.config"
import { astPlugin } from "../../../../plugins/vite/ast"

// const isDev = process.env.NODE_ENV === "development"
// const isCI = !!process.env.CI
export default defineConfig({
  ...viteRenderBaseConfig,
  base: "",
  build: {
    outDir: path.resolve(import.meta.dirname, "../../../../out/rn-web/html-renderer"),
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [react({}), astPlugin],
})
