import * as babel from "@babel/core"
import generate from "@babel/generator"
import { parse } from "@babel/parser"
import * as t from "@babel/types"
import type { Plugin } from "vite"

export function twMacro(): Plugin {
  return {
    name: "vite-plugin-tw-to-raw-string",

    transform(code, id) {
      // Only Process .tsx .ts .jsx .js files
      if (!/\.[jt]sx?$/.test(id)) {
        return null
      }
      // Parse the code using Babel's parser with TypeScript support
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx", "typescript"], // Add typescript support
      })

      babel.traverse(ast, {
        TaggedTemplateExpression(path) {
          if (t.isIdentifier(path.node.tag, { name: "tw" })) {
            const { quasi } = path.node
            if (t.isTemplateLiteral(quasi)) {
              // Create a new template literal by combining quasis and expressions
              const quasis = quasi.quasis.map((q) => q.value.raw)

              // Replace the tagged template expression with the new template literal as a string
              path.replaceWith(
                t.templateLiteral(
                  quasis.map((q, i) =>
                    t.templateElement({ raw: q, cooked: q }, i === quasis.length - 1),
                  ),
                  quasi.expressions,
                ),
              )
            }
          }
        },
      })

      // Generate the transformed code from the modified AST
      // @ts-expect-error
      const output = generate.default(ast, {}, code)

      return {
        code: output.code,
        map: null, // Source map generation can be added if necessary
      }
    },
  }
}
