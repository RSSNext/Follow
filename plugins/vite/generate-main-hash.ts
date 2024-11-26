import { createHash } from "node:crypto"
import fs from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"

const require = createRequire(import.meta.url)
const glob = require("glob") as typeof import("glob")

export async function calculateMainHash(mainDir: string): Promise<string> {
  // Get all TypeScript files in the main directory recursively
  const files = glob.sync("**/*.{ts,tsx}", {
    cwd: mainDir,
    ignore: ["node_modules/**", "dist/**"],
  })

  // Sort files for consistent hash

  files.sort()
  files.push("package.json")

  const hashSum = createHash("sha256")

  // Read and update hash for each file
  for (const file of files) {
    const content = await fs.readFile(path.join(mainDir, file))
    const normalizedContent = content.toString("utf-8").replaceAll("\r\n", "\n")
    hashSum.update(Buffer.from(normalizedContent))
  }

  return hashSum.digest("hex")
}

async function main() {
  const hash = await calculateMainHash(path.resolve(process.cwd(), "apps/main"))

  const packageJson = JSON.parse(
    await fs.readFile(path.resolve(process.cwd(), "package.json"), "utf-8"),
  )
  packageJson.mainHash = hash
  await fs.writeFile(
    path.resolve(process.cwd(), "package.json"),
    JSON.stringify(packageJson, null, 2),
  )
}

main()
