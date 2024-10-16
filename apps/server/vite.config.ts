import { resolve } from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { viteRenderBaseConfig } from "../../configs/vite.render.config"

// \const dirname = fileURLToPath(import.meta.url)
export default () => {
  return defineConfig({
    base: "/external-dist",
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
