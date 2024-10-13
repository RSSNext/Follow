import type { Plugin, UserConfig } from "vite"

export function createDependencyChunksPlugin(dependencies: string[][]): Plugin {
  return {
    name: "dependency-chunks",
    config(config: UserConfig) {
      config.build = config.build || {}
      config.build.rollupOptions = config.build.rollupOptions || {}
      config.build.rollupOptions.output = config.build.rollupOptions.output || {}

      const { output } = config.build.rollupOptions
      const outputConfig = Array.isArray(output) ? output[0] : output
      outputConfig.manualChunks = outputConfig.manualChunks || {}
      outputConfig.assetFileNames = "assets/[name].[hash:6][extname]"
      outputConfig.chunkFileNames = (chunkInfo) => {
        return chunkInfo.name.startsWith("vendor/")
          ? "[name].[hash].js"
          : "assets/[name].[hash:9].js"
      }

      const manualChunks = Array.isArray(output) ? output[0].manualChunks : output.manualChunks

      if (typeof manualChunks !== "object") return

      dependencies.forEach((dep, index) => {
        if (Array.isArray(dep)) {
          const chunkName = `vendor/${index}`
          manualChunks[chunkName] = dep
        } else {
          manualChunks[`vendor/${dep}`] = [dep]
        }
      })
    },
  }
}
