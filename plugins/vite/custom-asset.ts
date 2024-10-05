import path from "node:path"

import fs from "fs-extra"
import type { Plugin } from "vite"

export default function customAssetOutput(options: {
  dependencies: Record<string, { sourceDir: string; targetDir: string }>
}): Plugin {
  const { dependencies = {} } = options

  return {
    name: "vite-plugin-custom-asset-output",

    async generateBundle(_, bundle) {
      for (const [dependencyName, config] of Object.entries(dependencies)) {
        const { sourceDir, targetDir } = config

        for (const fileName in bundle) {
          const file = bundle[fileName]

          if (
            file.type === "asset" &&
            file.name &&
            file.name.startsWith(`${dependencyName}/${sourceDir}`)
          ) {
            const newFileName = file.name.replace(`${dependencyName}/${sourceDir}`, targetDir)

            file.fileName = newFileName

            await fs.ensureDir(path.dirname(newFileName))

            bundle[newFileName] = file
            delete bundle[fileName]
          }
        }
      }
    },
  }
}
