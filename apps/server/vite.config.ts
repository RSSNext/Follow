import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// \const dirname = fileURLToPath(import.meta.url)
export default () => {
  return defineConfig({
    base: "/external-dist",
    resolve: {
      alias: {
        "~": "./src",
        // "@follow/utils": resolve(dirname, "../../packages/utils/src"),
        // "@follow/shared": resolve(dirname, "../../packages/shared/src"),
      },
    },
    plugins: [react()],
  })
}
