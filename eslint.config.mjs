// @ts-check
import defineConfig, { GLOB_TS_SRC } from "eslint-config-hyoban"

export default defineConfig(
  {
    typeChecked: false,
    react: "vite",
    tailwindCSS: true,
    fileCase: false,
    stylistic: {
      quotes: "double",
      arrowParens: true,
      braceStyle: "1tbs",
      lineBreak: "after",
    },
    lessOpinionated: true,
    ignores: ["src/renderer/src/hono.ts"],
  },
  // fix later or just always ignore
  {
    rules: {
      "no-console": "warn",
      "unicorn/consistent-function-scoping": "warn",
      "unicorn/prefer-module": "off",
    },
  },
  {
    files: GLOB_TS_SRC,
    rules: {
      "@eslint-react/no-unstable-context-value": "warn",
      "react-compiler/react-compiler": "warn",
    },
  },
)
