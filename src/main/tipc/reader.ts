import { createRequire } from "node:module"

import { readability } from "../lib/readability"
import { t } from "./_instance"

const require = createRequire(import.meta.url)
export const readerRoute = {
  readability: t.procedure
    .input<{ url: string }>()
    .action(async ({ input }) => {
      const { url } = input

      if (!url) {
        return null
      }
      const result = await readability(url)

      return result
    }),
  detectCodeStringLanguage: t.procedure
    .input<{ codeString: string }>()
    .action(async ({ input }) => {
      const { ModelOperations } = require("@vscode/vscode-languagedetection")
      const modulOperations = new ModelOperations()
      const result = await modulOperations.runModel(input.codeString)
      return result
    }),
}
