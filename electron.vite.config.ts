import { resolve } from "node:path"

import { defineConfig } from "electron-vite"

import { viteRenderBaseConfig } from "./configs/vite.render.config"

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: "./apps/main/src/index.ts",
      },
    },
    resolve: {
      alias: {
        "@shared": resolve("packages/shared/src"),
        "@env": resolve("./src/env.ts"),
        "@pkg": resolve("./package.json"),
        "@locales": resolve("./locales"),
        "~": resolve("./apps/main/src"),
      },
    },
  },
  preload: {
    build: {
      lib: {
        entry: "./apps/main/preload/index.ts",
      },
    },
    resolve: {
      alias: {
        "@env": resolve("./src/env.ts"),
        "@pkg": resolve("./package.json"),
        "@locales": resolve("./locales"),
      },
    },
  },
  renderer: {
    ...viteRenderBaseConfig,

    root: "apps/renderer",
    build: {
      sourcemap: !!process.env.CI,
      target: "esnext",
      rollupOptions: {
        input: {
          main: resolve("./apps/renderer/index.html"),
        },
      },
    },
    define: {
      ...viteRenderBaseConfig.define,
      ELECTRON: "true",
    },
  },
})
