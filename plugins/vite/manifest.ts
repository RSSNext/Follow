import { createHash } from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"

import type { Plugin } from "vite"

async function generateFileFingerprint(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath)
  const hash = createHash("sha256")
  hash.update(data)
  return hash.digest("hex")
}

async function listFilesRecursively(dir: string): Promise<string[]> {
  const subdirs = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir.name)
      return subdir.isDirectory() ? listFilesRecursively(res) : res
    }),
  )
  return files.flat()
}

function listFilesAndFingerprints(): Plugin {
  let outDir: string

  return {
    name: "list-files-and-fingerprints",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir
    },
    async closeBundle() {
      const files = await listFilesRecursively(outDir)
      const results: string[] = []

      for (const file of files) {
        const fingerprint = await generateFileFingerprint(file)
        results.push(`${file.slice(outDir.length + 1)} ${fingerprint}`)
      }

      // Write the results to the manifest file in the outDir
      const outputFilePath = path.join(outDir, "manifest")
      await fs.writeFile(outputFilePath, results.join("\n"), "utf-8")
    },
  }
}

export default listFilesAndFingerprints
