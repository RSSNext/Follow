import { resolve } from "node:path"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { viteRenderBaseConfig } from "../../configs/vite.render.config"

export default () => {
  return defineConfig({
    // base: isCI ? "/external-dist" : undefined,
    resolve: {
      alias: {
        // "~": "./src",
        "@pkg": resolve(__dirname, "../../package.json"),
        "@client": resolve(__dirname, "./client"),
      },
    },
    define: {
      ...viteRenderBaseConfig.define,
    },
    plugins: [react()],
  })
}
