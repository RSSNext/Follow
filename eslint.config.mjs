// @ts-check
import defineConfig, { DEFAULT_GLOB_TS_SRC } from "eslint-config-hyoban"

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
    },
    ignores: ["src/renderer/src/hono.ts"],
  },
  {
    rules: {
      // change for less opinionated
      "curly": ["error", "multi-line", "consistent"],
      "antfu/if-newline": "off",
      "antfu/top-level-function": "off",
      "hyoban/prefer-early-return": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-definitions": "off",

      // change to more like prettier
      "@stylistic/operator-linebreak": ["error", "after"],
      "@stylistic/max-statements-per-line": "off",
    },
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
    files: DEFAULT_GLOB_TS_SRC,
    rules: {
      "@eslint-react/no-unstable-context-value": "warn",
      "react-compiler/react-compiler": "warn",
    },
  },
)
