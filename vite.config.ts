import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { sentryVitePlugin } from "@sentry/vite-plugin"
import legacy from "@vitejs/plugin-legacy"
import react from "@vitejs/plugin-react"
import { cyan, dim, green } from "kolorist"
import { visualizer } from "rollup-plugin-visualizer"
import type { PluginOption, ViteDevServer } from "vite"
import { defineConfig, loadEnv } from "vite"
import mkcert from "vite-plugin-mkcert"

import { getGitHash } from "./scripts/lib"
import type { env as EnvType } from "./src/env"

const pkg = JSON.parse(readFileSync("package.json", "utf8"))
const __dirname = fileURLToPath(new URL(".", import.meta.url))
const isCI = process.env.CI === "true" || process.env.CI === "1"
const ROOT = "./src/renderer"

const vite = ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const typedEnv = env as typeof EnvType

  return defineConfig({
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
    root: ROOT,
    envDir: resolve(__dirname, "."),
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@shared": resolve("src/shared/src"),
        "@pkg": resolve("./package.json"),
        "@env": resolve("./src/env.ts"),
      },
    },
    base: "/",
    server: {
      port: 2233,
    },
    plugins: [
      mode !== "development" &&
      legacy({
        targets: "defaults",
        renderLegacyChunks: false,
        modernTargets: ">0.3%, last 2 versions, Firefox ESR, not dead",
        modernPolyfills: ["es.array.find-last-index", "es.array.find-last"],
      }),
      htmlPlugin(typedEnv),
      react(),
      mkcert(),
      sentryVitePlugin({
        org: "follow-rg",
        project: "follow",
        disable: !isCI,
        bundleSizeOptimizations: {
          excludeDebugStatements: true,
          // Only relevant if you added `browserTracingIntegration`
          excludePerformanceMonitoring: true,
          // Only relevant if you added `replayIntegration`
          excludeReplayIframe: true,
          excludeReplayShadowDom: true,
          excludeReplayWorker: true,
        },
        moduleMetadata: {
          appVersion:
            process.env.NODE_ENV === "development" ? "dev" : pkg.version,
          electron: false,
        },
        sourcemaps: {
          filesToDeleteAfterUpload: ["out/web/assets/*.js.map"],
        },
      }),

      devPrint(),
      process.env.ANALYZER && visualizer({ open: true }),
    ],
    define: {
      APP_VERSION: JSON.stringify(pkg.version),
      APP_NAME: JSON.stringify(pkg.name),
      APP_DEV_CWD: JSON.stringify(process.cwd()),

      GIT_COMMIT_SHA: JSON.stringify(
        process.env.VERCEL_GIT_COMMIT_SHA || getGitHash(),
      ),

      DEBUG: process.env.DEBUG === "true",
      ELECTRON: "false",
    },
  })
}
export default vite

function htmlPlugin(env: typeof EnvType): PluginOption {
  return {
    name: "html-transform",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(
        "<!-- FOLLOW VITE BUILD INJECT -->",
        `<script id="env_injection" type="module">
      ${function injectEnv(env: any) {
        for (const key in env) {
          if (env[key] === undefined) continue
          globalThis["__followEnv"] ??= {}
          globalThis["__followEnv"][key] = env[key]
        }
      }.toString()}
      injectEnv(${JSON.stringify({
        VITE_API_URL: env.VITE_API_URL,
        VITE_WEB_URL: env.VITE_WEB_URL,
        VITE_IMGPROXY_URL: env.VITE_IMGPROXY_URL,
      })})
      </script>`,
      )
    },
  }
}

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
