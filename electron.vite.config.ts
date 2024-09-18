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

    build: {
      sourcemap: !!process.env.CI,
      target: "esnext",
    },
    define: {
      ...viteRenderBaseConfig.define,
      ELECTRON: "true",
    },
  },
})
