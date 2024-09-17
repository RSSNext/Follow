import { resolve } from "node:path"

import { defineConfig } from "electron-vite"

import { viteRenderBaseConfig } from "./configs/vite.render.config"

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@shared": resolve("src/shared/src"),
        "@env": resolve("./src/env.ts"),
        "@pkg": resolve("./package.json"),
        "@locales": resolve("./locales"),
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
