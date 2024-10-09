import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import legacy from "@vitejs/plugin-legacy"
import { cyan, dim, green } from "kolorist"
import type { PluginOption, ViteDevServer } from "vite"
import { defineConfig, loadEnv } from "vite"
import { analyzer } from "vite-bundle-analyzer"
import mkcert from "vite-plugin-mkcert"

import { viteRenderBaseConfig } from "./configs/vite.render.config"
import type { env as EnvType } from "./packages/shared/src/env"
import { createDependencyChunksPlugin } from "./plugins/vite/deps"
import { htmlInjectPlugin } from "./plugins/vite/html-inject"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const isCI = process.env.CI === "true" || process.env.CI === "1"
const ROOT = "./apps/renderer"

const devPrint = (): PluginOption => ({
  name: "dev-print",
  configureServer(server: ViteDevServer) {
    const _printUrls = server.printUrls
    server.printUrls = () => {
      _printUrls()
      console.info(
        `  ${green("➜")}  ${dim("Production debug")}: ${cyan(
          "https://app.follow.is/__debug_proxy",
        )}`,
      )
      console.info(
        `  ${green("➜")}  ${dim("Development debug")}: ${cyan(
          "https://dev.follow.is/__debug_proxy",
        )}`,
      )
    }
  },
})

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const typedEnv = env as typeof EnvType

  return defineConfig({
    ...viteRenderBaseConfig,
    root: ROOT,
    envDir: resolve(__dirname, "."),
    build: {
      outDir: resolve(__dirname, "out/web"),
      target: "ES2022",
      sourcemap: isCI,
      rollupOptions: {
        input: {
          main: resolve(ROOT, "/index.html"),
          __debug_proxy: resolve(ROOT, "/__debug_proxy.html"),
        },
      },
    },
    server: {
      port: 2233,
      watch: {
        ignored: ["**/dist/**", "**/out/**", "**/public/**", ".git/**"],
      },
    },
    plugins: [
      ...((viteRenderBaseConfig.plugins ?? []) as any),
      mode !== "development" &&
        legacy({
          targets: "defaults",
          renderLegacyChunks: false,
          modernTargets: ">0.3%, last 2 versions, Firefox ESR, not dead",
          modernPolyfills: ["es.array.find-last-index", "es.array.find-last"],
        }),
      htmlInjectPlugin(typedEnv),
      mkcert(),
      devPrint(),
      createDependencyChunksPlugin([
        //  React framework
        ["react", "react-dom", "react-router-dom", "react-error-boundary", "react-dom/server"],
        // Data Statement
        ["zustand", "jotai", "use-context-selector", "immer", "dexie"],
        // Remark
        [
          "remark-directive",
          "remark-gfm",
          "remark-parse",
          "remark-stringify",
          "remark-rehype",
          "@microflash/remark-callout-directives",
          "remark-gh-alerts",
        ],
        // Rehype
        [
          "rehype-parse",
          "rehype-sanitize",
          "rehype-stringify",
          "rehype-infer-description-meta",
          "hast-util-to-jsx-runtime",
          "hast-util-to-text",
        ],
        ["vfile", "unified"],
        ["lodash-es"],
        ["framer-motion"],
        ["clsx", "tailwind-merge", "class-variance-authority"],
        ["@radix-ui/react-dialog", "re-resizable"],
        ["i18next", "i18next-browser-languagedetector", "react-i18next"],
        // Data query
        [
          "@tanstack/react-query",
          "@tanstack/react-query-persist-client",
          "@tanstack/query-sync-storage-persister",
        ],
        ["blurhash", "react-blurhash"],
        ["tldts"],
        ["shiki", "@shikijs/transformers"],
        ["@sentry/react", "posthog-js"],
        ["zod", "react-hook-form", "@hookform/resolvers"],
      ]),

      process.env.ANALYZER && analyzer(),
    ],

    define: {
      ...viteRenderBaseConfig.define,
      ELECTRON: "false",
    },
  })
}
