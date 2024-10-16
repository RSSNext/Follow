import { readdirSync, writeFileSync } from "node:fs"
import fs from "node:fs/promises"
import path, { resolve } from "node:path"

const fontDepsPath = require.resolve("@fontsource/sn-pro")
const fontsDirPath = resolve(fontDepsPath, "../files")
const fontsDir = readdirSync(fontsDirPath).filter(
  (name) => !name.endsWith(".woff2") && !name.includes("italic"),
)
async function main() {
  const files = {} as Record<string, string>
  await Promise.all(
    fontsDir.map(async (file) => {
      const r = await fs.readFile(path.join(fontsDirPath, file))

      const base64 = r.toString("base64")

      files[file] = base64
    }),
  )

  writeFileSync(
    path.join(__dirname, "../src/og/fonts-data.ts"),
    `export default ${JSON.stringify(files, null, 2)}`,
  )
}
main()
