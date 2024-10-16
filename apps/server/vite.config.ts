import { resolve } from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { viteRenderBaseConfig } from "../../configs/vite.render.config"

// \const dirname = fileURLToPath(import.meta.url)
const isCI = process.env.CI === "1"
export default () => {
  return defineConfig({
    base: isCI ? "/external-dist" : undefined,
    resolve: {
      alias: {
        "~": "./src",
        "@pkg": resolve(__dirname, "../../package.json"),
      },
    },
    define: {
      ...viteRenderBaseConfig.define,
    },
    plugins: [react()],
  })
}
