import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { config } from "dotenv"

const __dirname = dirname(fileURLToPath(import.meta.url))
config({
  path: resolve(__dirname, "../../.env"),
})
