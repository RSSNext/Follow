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
      outputConfig.assetFileNames = "assets/[name].[hash:6][extname]"
      outputConfig.chunkFileNames = (chunkInfo) => {
        return chunkInfo.name.startsWith("vendor/") ? "[name]-[hash].js" : "assets/[name]-[hash].js"
      }

      outputConfig.manualChunks = (id: string, { getModuleInfo }) => {
        const moduleInfo = getModuleInfo(id)
        if (moduleInfo?.dynamicImporters?.length && moduleInfo?.importers?.length) {
          return null
        }

        const matchedDep = dependencies.findIndex((dep) => {
          return dep.some((d) => {
            const pattern = `/node_modules/${d}/`
            return id.includes(pattern) && !id.includes(`${pattern}node_modules/`)
          })
        })

        if (matchedDep !== -1) {
          return `vendor/${matchedDep}`
        }
        // const chunkMap: Record<string, string[]> = {
        //   modules: ["/src/modules"],
        //   infra: [
        //     "/src/store",
        //     "/src/atoms",
        //     "/src/database",
        //     "/src/services",
        //     "/src/initialize",
        //     "/src/lib",
        //     "/src/queries",
        //   ],
        //   components: ["/src/components", "/src/hooks"],
        //   packages: ["@follow/"],
        //   app: ["/src/pages", "/src/providers", "/src/constants", "/src/App", "/src/main"],
        // }
        // for (const [chunk, paths] of Object.entries(chunkMap)) {
        //   if (paths.some((path) => id.includes(path))) {
        //     return chunk
        //   }
        // }
        return null
      }
    },
  }
}
