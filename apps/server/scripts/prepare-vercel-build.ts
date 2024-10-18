import { mkdirSync } from "node:fs"
import fs from "node:fs/promises"
import path from "node:path"

// const fontDepsPath = require.resolve("@fontsource/sn-pro")
// const fontsDirPath = resolve(fontDepsPath, "../files")
// const fontsDir = readdirSync(fontsDirPath).filter(
//   (name) => !name.endsWith(".woff2") && !name.includes("italic"),
// )

mkdirSync(path.join(__dirname, "../.generated"), { recursive: true })
// async function generateFontData() {
//   const files = {} as Record<string, string>
//   await Promise.all(
//     fontsDir.map(async (file) => {
//       const r = await fs.readFile(path.join(fontsDirPath, file))

//       const base64 = r.toString("base64")

//       files[file] = base64
//     }),
//   )

//   writeFileSync(
//     path.join(__dirname, "../.generated/fonts-data.ts"),
//     `export default ${JSON.stringify(files, null, 2)}`,
//   )
// }

async function generateIndexHtmlData() {
  const indexHtml = await fs.readFile(path.join(__dirname, "../dist/index.html"), "utf-8")
  await fs.writeFile(
    path.join(__dirname, "../.generated/index.template.ts"),
    `export default ${JSON.stringify(indexHtml)}`,
  )
}

async function replaceEnvFile() {
  const envFile = await fs.readFile(path.join(__dirname, "../src/lib/env.ts"), "utf-8")

  await fs.writeFile(
    path.join(__dirname, "../src/lib/env.ts"),
    // For tree shaking
    envFile.replace(
      `export const isDev = process.env.NODE_ENV === "development"`,
      `export const isDev = ${process.env.NODE_ENV === "development"}`,
    ),
  )
}

async function main() {
  await Promise.all([generateIndexHtmlData(), replaceEnvFile()])
}

main()
