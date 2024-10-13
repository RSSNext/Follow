import type { Plugin } from "vite"

export function createPlatformSpecificImportPlugin(isElectron = false): Plugin {
  return {
    name: "platform-specific-import",
    enforce: "pre",
    async resolveId(source, importer) {
      if (!importer) {
        return null
      }

      const allowExts = [".js", ".jsx", ".ts", ".tsx"]

      if (!allowExts.some((ext) => importer.endsWith(ext))) return null

      if (importer.includes("node_modules")) return null
      const [path, query] = source.split("?")

      if (path.startsWith(".") || path.startsWith("/")) {
        const priorities = isElectron
          ? [".electron.ts", ".electron.tsx", ".electron.js", ".electron.jsx"]
          : [".web.ts", ".web.tsx", ".web.js", ".web.jsx"]

        for (const ext of priorities) {
          const resolvedPath = await this.resolve(
            `${path}${ext}${query ? `?${query}` : ""}`,
            importer,
            {
              skipSelf: true,
            },
          )

          if (resolvedPath) {
            return resolvedPath.id
          }
        }
      }

      return null
    },
  }
}
