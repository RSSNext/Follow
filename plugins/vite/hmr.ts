import type { HmrContext, Plugin } from "vite"

function hasCircularDependency(mod: any, server: any, visited = new Set()): boolean {
  if (visited.has(mod.id)) return true
  visited.add(mod.id)

  const importers = server.moduleGraph.getModulesByFile(mod.file) || new Set()
  for (const importer of importers) {
    if (hasCircularDependency(importer, server, new Set(visited))) {
      return true
    }
  }

  return false
}

export const circularImportRefreshPlugin = (): Plugin => ({
  name: "circular-import-refresh",
  handleHotUpdate({ file, server }: HmrContext) {
    if (file.includes("store")) {
      const mod = server.moduleGraph.getModuleById(file)
      if (mod && hasCircularDependency(mod, server)) {
        console.warn(`Circular dependency detected in ${file}. Performing full page refresh.`)
        server.ws.send({ type: "full-reload" })
        return []
      }
    }
  },
})
