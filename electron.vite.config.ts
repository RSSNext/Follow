import { resolve } from "node:path"

import { defineConfig } from "electron-vite"

import { viteRenderBaseConfig } from "./configs/vite.render.config"
import { createPlatformSpecificImportPlugin } from "./plugins/vite/specific-import"

export default defineConfig({
  main: {
    build: {
      outDir: "dist/main",
      lib: {
        entry: "./apps/main/src/index.ts",
      },
    },
    resolve: {
      alias: {
        "@shared": resolve("packages/shared/src"),
        "@pkg": resolve("./package.json"),
        "@locales": resolve("./locales"),
        "~": resolve("./apps/main/src"),
      },
    },
    define: {
      ELECTRON: "true",
    },
  },
  preload: {
    build: {
      outDir: "dist/preload",
      lib: {
        entry: "./apps/main/preload/index.ts",
      },
    },
    resolve: {
      alias: {
        "@pkg": resolve("./package.json"),
        "@locales": resolve("./locales"),
      },
    },
  },
  renderer: {
    ...viteRenderBaseConfig,

    plugins: [...viteRenderBaseConfig.plugins, createPlatformSpecificImportPlugin(true)],

    root: "apps/renderer",
    build: {
      outDir: "dist/renderer",
      sourcemap: !!process.env.CI,
      target: "esnext",
      rollupOptions: {
        input: {
          main: resolve("./apps/renderer/index.html"),
        },
      },
      minify: true,
    },
    define: {
      ...viteRenderBaseConfig.define,
      ELECTRON: "true",
    },
  },
})
