import fs, { readFileSync } from "node:fs"
import path, { resolve } from "node:path"

import * as babel from "@babel/core"
import generate from "@babel/generator"
import { parse } from "@babel/parser"
import * as t from "@babel/types"
import { sentryVitePlugin } from "@sentry/vite-plugin"
import react from "@vitejs/plugin-react"
import { set } from "lodash-es"
import { prerelease } from "semver"
import type { Plugin, UserConfig } from "vite"

import { getGitHash } from "../scripts/lib"
import i18nCompleteness from "./i18n-completeness"

const pkg = JSON.parse(readFileSync("package.json", "utf8"))
const isCI = process.env.CI === "true" || process.env.CI === "1"
function localesPlugin(): Plugin {
  return {
    name: "locales-merge",
    enforce: "post",
    generateBundle(_options, bundle) {
      const localesDir = path.resolve(__dirname, "../locales")
      const namespaces = fs.readdirSync(localesDir)
      const languageResources = {}

      namespaces.forEach((namespace) => {
        const namespacePath = path.join(localesDir, namespace)
        const files = fs.readdirSync(namespacePath).filter((file) => file.endsWith(".json"))

        files.forEach((file) => {
          const lang = path.basename(file, ".json")
          const filePath = path.join(namespacePath, file)
          const content = JSON.parse(fs.readFileSync(filePath, "utf-8"))

          if (!languageResources[lang]) {
            languageResources[lang] = {}
          }

          const obj = {}

          const keys = Object.keys(content as object)
          for (const accessorKey of keys) {
            set(obj, accessorKey, (content as any)[accessorKey])
          }

          languageResources[lang][namespace] = obj
        })
      })

      Object.entries(languageResources).forEach(([lang, resources]) => {
        const fileName = `locales/${lang}.js`

        const content = `export default ${JSON.stringify(resources)};`

        this.emitFile({
          type: "asset",
          fileName,
          source: content,
        })
      })

      // Remove original JSON chunks
      Object.keys(bundle).forEach((key) => {
        if (key.startsWith("locales/") && key.endsWith(".json")) {
          delete bundle[key]
        }
      })
    },
  }
}

function customI18nHmrPlugin(): Plugin {
  return {
    name: "custom-i18n-hmr",
    handleHotUpdate({ file, server }) {
      if (file.endsWith(".json") && file.includes("locales")) {
        server.ws.send({
          type: "custom",
          event: "i18n-update",
          data: {
            file,
            content: readFileSync(file, "utf-8"),
          },
        })

        // return empty array to prevent the default HMR
        return []
      }
    },
  }
}

export const viteRenderBaseConfig = {
  resolve: {
    alias: {
      "~": resolve("apps/renderer/src"),
      "@pkg": resolve("package.json"),
      "@env": resolve("src/env.ts"),
      "@locales": resolve("locales"),
      "@follow/electron-main": resolve("apps/main/src"),
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
        filesToDeleteAfterUpload: ["out/web/assets/*.js.map"],
      },
    }),

    localesPlugin(),
    viteTwToRawString(),
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

function viteTwToRawString(): Plugin {
  return {
    name: "vite-plugin-tw-to-raw-string",

    transform(code, id) {
      // Only Process .tsx .ts .jsx .js files
      if (!/\.[jt]sx?$/.test(id)) {
        return null
      }
      // Parse the code using Babel's parser with TypeScript support
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"], // Add typescript support
      })

      babel.traverse(ast, {
        TaggedTemplateExpression(path) {
          if (t.isIdentifier(path.node.tag, { name: "tw" })) {
            const { quasi } = path.node
            if (t.isTemplateLiteral(quasi)) {
              // Create a new template literal by combining quasis and expressions
              const quasis = quasi.quasis.map((q) => q.value.raw)

              // Replace the tagged template expression with the new template literal as a string
              path.replaceWith(
                t.templateLiteral(
                  quasis.map((q, i) =>
                    t.templateElement({ raw: q, cooked: q }, i === quasis.length - 1),
                  ),
                  quasi.expressions,
                ),
              )
            }
          }
        },
      })

      // Generate the transformed code from the modified AST
      // @ts-expect-error
      const output = generate.default(ast, {}, code)

      return {
        code: output.code,
        map: null, // Source map generation can be added if necessary
      }
    },
  }
}
