/** @type {import("eslint").ESLint.Plugin} */
export default {
  rules: {
    "valid-i18n-keys": {
      meta: {
        type: "problem",
        docs: {
          description: "Ensure i18n JSON keys are flat and valid as object paths",
          category: "Possible Errors",
          recommended: true,
        },
        fixable: null,
      },
      create(context) {
        return {
          Program(node) {
            const { filename, sourceCode } = context

            if (!filename.endsWith(".json")) return

            let json
            try {
              json = JSON.parse(sourceCode.text)
            } catch {
              context.report({
                node,
                message: "Invalid JSON format",
              })
              return
            }

            const keys = Object.keys(json)
            const keyPrefixes = new Set()

            for (const key of keys) {
              if (key.includes(".")) {
                const parts = key.split(".")
                for (let i = 1; i < parts.length; i++) {
                  const prefix = parts.slice(0, i).join(".")
                  if (keys.includes(prefix)) {
                    context.report({
                      node,
                      message: `Invalid key structure: '${key}' conflicts with '${prefix}'`,
                    })
                  }
                  keyPrefixes.add(prefix)
                }
              }
            }

            for (const key of keys) {
              if (keyPrefixes.has(key)) {
                context.report({
                  node,
                  message: `Invalid key structure: '${key}' is a prefix of another key`,
                })
              }
            }
          },
        }
      },
    },
  },
}
