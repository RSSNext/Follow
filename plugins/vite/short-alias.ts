import generate from "@babel/generator"
import { parse } from "@babel/parser"
import traverse from "@babel/traverse"
import * as t from "@babel/types"
import type { Plugin } from "vite"

// @ts-expect-error
const traverseApply: typeof traverse = traverse.default || traverse
// @ts-expect-error
const generateApply: typeof generate = generate.default || generate

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

      const ast = parse(code, {
        sourceType: "module",
        plugins: ["typescript"],
      })

      traverseApply(ast, {
        ImportDeclaration(path) {
          path.node.specifiers.forEach((specifier) => {
            if (t.isImportSpecifier(specifier)) {
              const imported = specifier.imported as t.Identifier
              const local = specifier.local as t.Identifier

              if (local.name !== imported.name && local.name.length > 3) {
                let shortAlias = aliasMap.get(local.name)
                if (!shortAlias) {
                  shortAlias = generateShortAlias()
                  aliasMap.set(local.name, shortAlias)
                }

                path.scope.rename(local.name, shortAlias)
                local.name = shortAlias
              }
            }
          })
        },
      })

      const output = generateApply(ast, { retainLines: true }, code)
      return output.code
    },
  }
}
