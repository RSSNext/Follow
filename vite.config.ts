import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import legacy from "@vitejs/plugin-legacy"
import { minify as htmlMinify } from "html-minifier-terser"
import { cyan, dim, green } from "kolorist"
import { parseHTML } from "linkedom"
import type { PluginOption, ViteDevServer } from "vite"
import { defineConfig, loadEnv } from "vite"
import { analyzer } from "vite-bundle-analyzer"
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
      proxy: {
        "/login": {
          target: "http://localhost:2234",
          changeOrigin: true,
          selfHandleResponse: true,
          configure: (proxy, _options) => {
            proxy.on("proxyRes", (proxyRes, req, res) => {
              const body = [] as any[]
              proxyRes.on("data", (chunk: any) => body.push(chunk))
              proxyRes.on("end", () => {
                const html = parseHTML(Buffer.concat(body).toString())
                const doc = html.document

                const $scripts = doc.querySelectorAll("script")
                $scripts.forEach((script) => {
                  const src = script.getAttribute("src")
                  if (src) {
                    script.setAttribute("src", `http://localhost:2234${src}`)
                  }
                })

                const $links = doc.querySelectorAll("link")
                $links.forEach((link) => {
                  const href = link.getAttribute("href")
                  if (href) {
                    link.setAttribute("href", `http://localhost:2234${href}`)
                  }
                })

                res.setHeader("Content-Type", "text/html; charset=utf-8")

                const modifiedHtml = doc.toString()
                res.end(modifiedHtml)
              })
            })
          },
        },

        ...(env.VITE_DEV_PROXY
          ? {
              [env.VITE_DEV_PROXY]: {
                target: env.VITE_DEV_PROXY_TARGET,
                changeOrigin: true,
                rewrite: (path) => path.replace(new RegExp(`^${env.VITE_DEV_PROXY}`), ""),
              },
            }
          : {}),
      },
    },
    resolve: {
      alias: {
        ...viteRenderBaseConfig.resolve?.alias,
        "@follow/logger": resolve(__dirname, "./packages/logger/web.ts"),
      },
    },
    plugins: [
      ...((viteRenderBaseConfig.plugins ?? []) as any),
      VitePWA({
        strategies: "injectManifest",
        srcDir: "src",
        filename: "sw.ts",
        registerType: "prompt",
        injectRegister: false,

        injectManifest: {
          globPatterns: [
            "**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}",
          ],
          manifestTransforms: [
            (manifest) => {
              return {
                manifest,
                warnings: [],
                additionalManifestEntries: [
                  {
                    url: "/sw.js?pwa=true",
                    revision: null,
                  },
                ],
              }
            },
          ],
        },

        manifest: {
          theme_color: "#000000",
          name: "Follow",
          display: "standalone",
          background_color: "#ffffff",
          icons: [
            {
              src: "pwa-64x64.png",
              sizes: "64x64",
              type: "image/png",
            },
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "maskable-icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },

        devOptions: {
          enabled: false,
          navigateFallback: "index.html",
          suppressWarnings: true,
          type: "module",
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
        ["react-error-boundary", "react-dom/server", "react-router"],
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
        ["es-toolkit/compat"],
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

        ["@sentry/react", "@openpanel/web"],
        ["zod", "react-hook-form", "@hookform/resolvers"],
      ]),

      createPlatformSpecificImportPlugin(false),
      manifestPlugin(),
      htmlPlugin(typedEnv),
      process.env.analyzer && analyzer(),
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
