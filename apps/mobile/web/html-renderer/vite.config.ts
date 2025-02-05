import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { viteRenderBaseConfig } from "../../../../configs/vite.render.config"
import { astPlugin } from "../../../../plugins/vite/ast"

export default defineConfig({
  ...viteRenderBaseConfig,

  plugins: [react({}), astPlugin],
})
