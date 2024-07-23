import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import tsconfigPath from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

const pkg = JSON.parse(readFileSync("package.json", "utf8"))
const __dirname = fileURLToPath(new URL(".", import.meta.url))
export default defineConfig({
  root: "./",
  test: {
    include: ["**/*.test.ts", "**/*.spec.ts"],

    globals: true,
    setupFiles: [resolve(__dirname, "./setup-file.ts")],
    environment: "node",
    includeSource: [resolve(__dirname, ".")],
  },

  define: {
    APP_VERSION: JSON.stringify(pkg.version),
    APP_NAME: JSON.stringify(pkg.name),
    APP_DEV_CWD: JSON.stringify(process.cwd()),

    GIT_COMMIT_SHA: "'SHA'",
    DEBUG: process.env.DEBUG === "true",
    ELECTRON: "false",
  },

  plugins: [
    tsconfigPath({
      projects: [resolve(__dirname, "./tsconfig.json")],
    }),
  ],
})
