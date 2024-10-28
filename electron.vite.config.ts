import { resolve } from "node:path"

import { defineConfig } from "electron-vite"

import viteRenderConfig from "./configs/vite.electron-render.config"
import { getGitHash } from "./scripts/lib"

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
      GIT_COMMIT_HASH: JSON.stringify(getGitHash()),
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
  renderer: viteRenderConfig,
})
