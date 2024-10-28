import { resolve } from "node:path"

import { createPlatformSpecificImportPlugin } from "../plugins/vite/specific-import"
import { viteRenderBaseConfig } from "./vite.render.config"

const root = resolve(import.meta.dirname, "..")
export default {
  ...viteRenderBaseConfig,

  plugins: [...viteRenderBaseConfig.plugins, createPlatformSpecificImportPlugin(true)],

  root: resolve(root, "apps/renderer"),
  build: {
    outDir: resolve(root, "dist/renderer"),
    sourcemap: !!process.env.CI,
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(root, "./apps/renderer/index.html"),
      },
    },
    minify: true,
  },
  define: {
    ...viteRenderBaseConfig.define,
    ELECTRON: "true",
  },
}
