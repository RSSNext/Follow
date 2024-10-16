import fs from "node:fs"
import { createRequire } from "node:module"
import path, { resolve } from "node:path"

// import '@fontsource/sn-pro'
const require = createRequire(import.meta.url)
const fontDepsPath = require.resolve("@fontsource/sn-pro")
const fontsDirPath = resolve(fontDepsPath, "../files")
const fontsDir = fs.readdirSync(fontsDirPath).filter((name) => !name.endsWith(".woff2"))

const weights = [
  {
    name: "Thin",
    weight: 100,
  },
  {
    name: "ExtraLight",
    weight: 200,
  },
  {
    name: "Light",
    weight: 300,
  },
  {
    name: "Regular",
    weight: 400,
  },
  {
    name: "Italic",
    weight: 400,
  },
  {
    name: "Medium",
    weight: 500,
  },
  {
    name: "SemiBold",
    weight: 600,
  },
  {
    name: "Bold",
    weight: 700,
  },
  {
    name: "ExtraBold",
    weight: 800,
  },
  {
    name: "Black",
    weight: 900,
  },
] as const

export default fontsDir.map((file) => ({
  name: file.split("-")[0],
  data: fs.readFileSync(path.join(fontsDirPath, file)),
  weight: weights.find((weight) => weight.name === file.split("-")[1])?.weight,
  style: file.includes("Italic") ? "italic" : ("normal" as "italic" | "normal"),
}))
