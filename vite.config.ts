import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import legacy from "@vitejs/plugin-legacy"
import { cyan, dim, green } from "kolorist"
import type { PluginOption, ViteDevServer } from "vite"
import { defineConfig, loadEnv } from "vite"
import { analyzer } from "vite-bundle-analyzer"
import mkcert from "vite-plugin-mkcert"

import { viteRenderBaseConfig } from "./configs/vite.render.config"
import type { env as EnvType } from "./src/env"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const isCI = process.env.CI === "true" || process.env.CI === "1"
const ROOT = "./apps/renderer"

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
        output: {
          // 10KB
          experimentalMinChunkSize: 10_000,
        },
      },
    },
    server: {
      port: 2233,
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
      htmlPlugin(typedEnv),
      mkcert(),
      devPrint(),

      process.env.ANALYZER && analyzer(),
    ],
    define: {
      ...viteRenderBaseConfig.define,
      ELECTRON: "false",
    },
  })
}
