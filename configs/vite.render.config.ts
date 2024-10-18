import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { sentryVitePlugin } from "@sentry/vite-plugin"
import react from "@vitejs/plugin-react"
import { prerelease } from "semver"
import type { UserConfig } from "vite"

import { customI18nHmrPlugin } from "../plugins/vite/i18n-hmr"
import { localesPlugin } from "../plugins/vite/locales"
import { twMacro } from "../plugins/vite/tw-macro"
import i18nCompleteness from "../plugins/vite/utils/i18n-completeness"
import { getGitHash } from "../scripts/lib"

const pkgDir = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(resolve(pkgDir, "../package.json"), "utf8"))
const isCI = process.env.CI === "true" || process.env.CI === "1"

export const viteRenderBaseConfig = {
  resolve: {
    alias: {
      "~": resolve("apps/renderer/src"),
      "@pkg": resolve("package.json"),
      "@locales": resolve("locales"),
      "@follow/electron-main": resolve("apps/main/src"),
      "@constants": resolve("constants"),
    },
  },
  base: "/",

  plugins: [
    react(),

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
        appVersion: process.env.NODE_ENV === "development" ? "dev" : pkg.version,
        electron: false,
      },
      sourcemaps: {
        filesToDeleteAfterUpload: ["out/web/assets/*.js.map", "dist/renderer/assets/*.js.map"],
      },
    }),

    localesPlugin(),
    twMacro(),
    customI18nHmrPlugin(),
  ],
  define: {
    APP_VERSION: JSON.stringify(pkg.version),
    APP_NAME: JSON.stringify(pkg.name),
    APP_DEV_CWD: JSON.stringify(process.cwd()),

    GIT_COMMIT_SHA: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || getGitHash()),

    RELEASE_CHANNEL: JSON.stringify((prerelease(pkg.version)?.[0] as string) || "stable"),

    DEBUG: process.env.DEBUG === "true",

    I18N_COMPLETENESS_MAP: JSON.stringify({ ...i18nCompleteness, en: 100 }),
  },
} satisfies UserConfig
