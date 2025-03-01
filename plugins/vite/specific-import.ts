import type { Plugin } from "vite"

type Platform = "electron" | "web" | "rn"
export function createPlatformSpecificImportPlugin(platform: Platform): Plugin {
  return {
    name: "platform-specific-import",
    enforce: "pre",
    async resolveId(source, importer) {
      const resolvedPath = await this.resolve(source, importer, {
        skipSelf: true,
      })

      const allowExts = [".js", ".jsx", ".ts", ".tsx"]

      if (
        resolvedPath &&
        !resolvedPath.id.includes("node_modules") &&
        allowExts.some((ext) => importer?.endsWith(ext)) &&
        allowExts.some((ext) => resolvedPath.id?.endsWith(ext))
      ) {
        const lastDotIndex = resolvedPath.id.lastIndexOf(".")

        const paths = [
          `${resolvedPath.id.slice(0, lastDotIndex)}.${platform}${resolvedPath.id.slice(lastDotIndex)}`,
          `${resolvedPath.id.slice(0, lastDotIndex)}.desktop${resolvedPath.id.slice(lastDotIndex)}`,
        ]

        for (const path of paths) {
          const resolvedPlatform = await this.resolve(path, importer, {
            skipSelf: true,
          })
          if (resolvedPlatform) {
            return resolvedPlatform.id
          }
        }
      }

      return null
    },
  }
}
