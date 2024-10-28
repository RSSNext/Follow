import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import type { UserConfig } from "vite"

import { createPlatformSpecificImportPlugin } from "../plugins/vite/specific-import"
import { viteRenderBaseConfig } from "./vite.render.config"

const root = resolve(fileURLToPath(dirname(import.meta.url)), "..")

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
        main: resolve(root, "apps/renderer/index.html"),
      },
    },
    minify: true,
  },
  define: {
    ...viteRenderBaseConfig.define,
    ELECTRON: "true",
  },
} satisfies UserConfig
