import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { defineProject } from "vitest/config"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export default defineProject({
  root: "./",
  test: {
    globals: true,
    environment: "node",
    includeSource: [resolve(__dirname, ".")],
  },

  resolve: {
    alias: {
      "@pkg": resolve(__dirname, "../../package.json"),
      "@locales/*": resolve(__dirname, "../../locales/*"),
      "~/*": resolve(__dirname, "./src/*"),
    },
  },
})
