const sortObjectKeys = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((element) => sortObjectKeys(element))
  }

  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = sortObjectKeys(obj[key])
      return acc
    }, {})
}
/**
 * @type {import("eslint").ESLint.Plugin}
 */
export default {
  rules: {
    "recursive-sort": {
      meta: {
        type: "layout",
        fixable: "code",
      },
      create(context) {
        return {
          Program(node) {
            if (context.filename.endsWith(".json")) {
              const { sourceCode } = context
              const text = sourceCode.getText()

              try {
                const json = JSON.parse(text)
                const sortedJson = sortObjectKeys(json)
                const sortedText = `${JSON.stringify(sortedJson, null, 2)}\n`

                const noWhiteSpaceDiff = (a, b) =>
                  a.replaceAll(/\s/g, "") === b.replaceAll(/\s/g, "")

                if (!noWhiteSpaceDiff(text, sortedText)) {
                  context.report({
                    node,
                    message: "JSON keys are not sorted recursively",
                    fix(fixer) {
                      return fixer.replaceText(node, sortedText)
                    },
                  })
                }
              } catch (error) {
                context.report({
                  node,
                  message: `Invalid JSON: ${error.message}`,
                })
              }
            }
          },
        }
      },
    },
  },
}
