import { red, yellow } from "kolorist"
import type { HmrContext, Plugin } from "vite"

function isNodeWithinCircularImports(
  node: any,
  nodeChain: any[],
  currentChain: any[] = [node],
  traversedModules = new Set<any>(),
): boolean {
  if (traversedModules.has(node)) {
    return false
  }
  traversedModules.add(node)

  for (const importer of node.importers) {
    if (importer === node) continue

    const importerIndex = nodeChain.indexOf(importer)
    if (importerIndex !== -1) {
      const importChain = [
        importer,
        ...[...currentChain].reverse(),
        ...nodeChain.slice(importerIndex, -1).reverse(),
      ]
      console.warn(
        yellow(`Circular imports detected: ${importChain.map((m) => m.file).join(" -> ")}`),
      )
      return true
    }

    if (!currentChain.includes(importer)) {
      const result = isNodeWithinCircularImports(
        importer,
        nodeChain,
        currentChain.concat(importer),
        traversedModules,
      )
      if (result) return result
    }
  }
  return false
}

export const circularImportRefreshPlugin = (): Plugin => ({
  name: "circular-import-refresh",
  handleHotUpdate({ file, server }: HmrContext) {
    const mod = server.moduleGraph.getModuleById(file)
    if (mod && isNodeWithinCircularImports(mod, [mod])) {
      console.error(
        red(
          `Circular dependency detected in ${file} involving store files. Performing full page refresh.`,
        ),
      )

      server.ws.send({ type: "full-reload" })
      return []
    }
  },
})
