import type { Plugin } from "vite"

export function shortAliasPlugin(): Plugin {
  const aliasMap = new Map<string, string>()
  let aliasCounter = 0

  function generateShortAlias(): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let result = "_"
    let counter = aliasCounter++

    do {
      result += chars[counter % chars.length]
      counter = Math.floor(counter / chars.length)
    } while (counter > 0)

    return result
  }

  return {
    name: "short-alias",
    renderChunk(code, chunk) {
      if (chunk.fileName.startsWith("vendor/")) return code
      const importRegex = /import\s*(\{[^}]+\})\s*from\s*(['"])([^'"]+)\2/g

      return code.replaceAll(importRegex, (match, imports, quote, source) => {
        // Only process imports with curly braces
        if (!imports.startsWith("{") || !imports.endsWith("}")) {
          return match
        }

        const newImports = imports
          .slice(1, -1) // Remove the curly braces
          .split(",")
          .map((imp) => {
            const [original, alias] = imp.trim().split(/\s+as\s+/)
            if (alias) {
              // If an alias already exists, keep it or shorten it if it's too long
              if (alias.length > 3) {
                let shortAlias = aliasMap.get(alias)
                if (!shortAlias) {
                  shortAlias = generateShortAlias()
                  aliasMap.set(alias, shortAlias)
                }
                return `${original} as ${shortAlias}`
              }
              return imp.trim()
            }
            return imp.trim()
          })
          .join(", ")

        return `import {${newImports}} from ${quote}${source}${quote}`
      })
    },
  }
}
