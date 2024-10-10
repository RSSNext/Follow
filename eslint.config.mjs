// @ts-check
import { defineConfig, GLOB_TS_SRC } from "eslint-config-hyoban"

import checkI18nJson from "./plugins/eslint/eslint-check-i18n-json.js"
import noDebug from "./plugins/eslint/eslint-no-debug.js"
import recursiveSort from "./plugins/eslint/eslint-recursive-sort.js"

export default defineConfig(
  {
    formatting: false,
    lessOpinionated: true,
    ignores: [
      "src/renderer/src/hono.ts",
      "src/hono.ts",
      "packages/shared/src/hono.ts",
      "resources/**",
    ],
    preferESM: false,
    projectService: {
      allowDefaultProject: ["apps/main/preload/index.d.ts"],
      defaultProject: "tsconfig.json",
    },
    typeChecked: "essential",
  },
  {
    files: GLOB_TS_SRC,
    rules: {
      "require-await": "off",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": [
        "warn",
        {
          checksVoidReturn: { arguments: false, attributes: false },
        },
      ],
    },
  },
  {
    settings: {
      tailwindcss: {
        whitelist: ["center"],
      },
    },
    plugins: {
      "no-debug": noDebug,
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
      "no-debug/no-debug-stack": "error",
      "unicorn/prefer-math-trunc": "off",
      "@eslint-react/no-clone-element": 0,
      "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": 0,
      "@typescript-eslint/no-misused-promises": 0,
      // NOTE: Disable this temporarily
      "react-compiler/react-compiler": 0,
      "no-restricted-syntax": 0,
      "no-restricted-globals": [
        "error",
        {
          name: "location",
          message:
            "Since you don't use the same router instance in electron and browser, you can't use the global location to get the route info. \n\n" +
            "You can use `useLocaltion` or `getReadonlyRoute` to get the route info.",
        },
      ],
    },
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "@stylistic/jsx-self-closing-comp": "error",
    },
  },
  // @ts-expect-error
  {
    files: ["locales/**/*.json"],
    plugins: {
      "recursive-sort": recursiveSort,
      "check-i18n-json": checkI18nJson,
    },
    rules: {
      "recursive-sort/recursive-sort": "error",
      "check-i18n-json/valid-i18n-keys": "error",
      "check-i18n-json/no-extra-keys": "error",
    },
  },
)
