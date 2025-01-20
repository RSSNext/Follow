import { defineConfig } from "@tsslint/config"
import { convertRule } from "@tsslint/eslint"

export default defineConfig({
  rules: {
    "no-leaked-conditional-rendering": convertRule(
      await import("./node_modules/eslint-plugin-react-x/dist/index.mjs").then(
        (module) => module.default.rules["no-leaked-conditional-rendering"],
      ),
    ),
  },
})
