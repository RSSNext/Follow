import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import legacy from "@vitejs/plugin-legacy"
import { minify as htmlMinify } from "html-minifier-terser"
import { cyan, dim, green } from "kolorist"
import type { PluginOption, ViteDevServer } from "vite"
import { defineConfig, loadEnv } from "vite"
import mkcert from "vite-plugin-mkcert"
import { VitePWA } from "vite-plugin-pwa"

import { viteRenderBaseConfig } from "./configs/vite.render.config"
import type { env as EnvType } from "./packages/shared/src/env"
import { createDependencyChunksPlugin } from "./plugins/vite/deps"
import { htmlInjectPlugin } from "./plugins/vite/html-inject"
import manifestPlugin from "./plugins/vite/manifest"
import { createPlatformSpecificImportPlugin } from "./plugins/vite/specific-import"

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
      ...(env.VITE_DEV_PROXY
        ? {
            proxy: {
              [env.VITE_DEV_PROXY]: {
                target: env.VITE_API_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(new RegExp(`^${env.VITE_DEV_PROXY}`), ""),
              },
            },
          }
        : {}),
    },
    plugins: [
      ...((viteRenderBaseConfig.plugins ?? []) as any),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
          type: "module",
        },
        filename: "sw.ts",
        manifest: {
          theme_color: "#ff5c00",
          name: "Follow",
          display: "standalone",
          icons: [
            {
              src: "/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
      mode !== "development" &&
        legacy({
          targets: "defaults",
          renderLegacyChunks: false,
          modernTargets: ">0.3%, last 2 versions, Firefox ESR, not dead",
          modernPolyfills: [
            // https://unpkg.com/browse/core-js@3.39.0/modules/
            "es.promise.with-resolvers",
          ],
        }),
      htmlInjectPlugin(typedEnv),
      mkcert(),
      devPrint(),
      createDependencyChunksPlugin([
        //  React framework
        ["react", "react-dom"],
        ["react-error-boundary", "react-dom/server", "react-router-dom"],
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
          "react-shadow",
        ],
        ["vfile", "unified"],
        ["lodash-es"],
        ["framer-motion"],
        ["clsx", "tailwind-merge", "class-variance-authority"],

        [
          "@radix-ui/react-dialog",
          "@radix-ui/react-avatar",
          "@radix-ui/react-checkbox",
          "@radix-ui/react-context",
          "@radix-ui/react-dropdown-menu",
          "@radix-ui/react-hover-card",
          "@radix-ui/react-label",
          "@radix-ui/react-popover",
          "@radix-ui/react-radio-group",
          "@radix-ui/react-scroll-area",
          "@radix-ui/react-select",
          "@radix-ui/react-slider",
          "@radix-ui/react-slot",
          "@radix-ui/react-switch",
          "@radix-ui/react-tabs",
          "@radix-ui/react-toast",
          "@radix-ui/react-tooltip",

          "@headlessui/react",
        ],
        ["i18next", "i18next-browser-languagedetector", "react-i18next"],
        // Data query
        [
          "@tanstack/react-query",
          "@tanstack/react-query-persist-client",
          "@tanstack/query-sync-storage-persister",
        ],
        ["tldts"],
        ["shiki", "@shikijs/transformers"],
        ["@sentry/react", "@openpanel/web"],
        ["zod", "react-hook-form", "@hookform/resolvers"],

        ["swiper"],
      ]),

      createPlatformSpecificImportPlugin(false),
      manifestPlugin(),
      htmlPlugin(typedEnv),
    ],

    define: {
      ...viteRenderBaseConfig.define,
      ELECTRON: "false",
    },
  })
}
function checkBrowserSupport() {
  if (!("findLastIndex" in Array.prototype) || !("structuredClone" in window)) {
    window.alert(
      "Follow is not compatible with your browser because your browser version is too old. You can download and use the Follow app or continue using it with the latest browser.",
    )

    window.location.href = "https://follow.is/download"
  }
}

const htmlPlugin: (env: any) => PluginOption = () => {
  return {
    name: "html-transform",
    enforce: "post",
    transformIndexHtml(html) {
      return htmlMinify(
        html.replace(
          "<!-- Check Browser Script Inject -->",
          `<script>${checkBrowserSupport.toString()}; checkBrowserSupport()</script>`,
        ),
        {
          removeComments: true,
          html5: true,
          minifyJS: true,
          minifyCSS: true,
          removeTagWhitespace: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          collapseInlineTagWhitespace: true,
        },
      )
    },
  }
}
