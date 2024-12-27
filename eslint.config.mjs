// @ts-check
import path from "node:path"

import { fixupPluginRules } from "@eslint/compat"
import { defineConfig, GLOB_TS_SRC } from "eslint-config-hyoban"
import reactNative from "eslint-plugin-react-native"

import checkI18nJson from "./plugins/eslint/eslint-check-i18n-json.js"
import noDebug from "./plugins/eslint/eslint-no-debug.js"
import packageJsonExtend from "./plugins/eslint/eslint-package-json.js"
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
      "apps/mobile/android/**",
      "apps/mobile/ios/**",
      "apps/mobile/.expo",
    ],
    preferESM: false,
    projectService: {
      allowDefaultProject: ["apps/main/preload/index.d.ts"],
      defaultProject: "tsconfig.json",
    },
    typeChecked: "essential",
    tailwindCSS: {
      order: false,
    },
  },
  {
    files: GLOB_TS_SRC,
    rules: {
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
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
      "no-debug/no-debug-stack": "error",
      "@eslint-react/no-clone-element": 0,
      "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": 0,
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
    files: ["apps/server/**/*"],
    settings: {
      tailwindcss: {
        config: path.join(import.meta.dirname, "apps/server/tailwind.config.ts"),
      },
    },
  },
  {
    files: ["apps/mobile/**/*"],
    settings: {
      tailwindcss: {
        config: path.join(import.meta.dirname, "apps/mobile/tailwind.config.ts"),
      },
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
  {
    files: ["package.json", "apps/**/package.json", "packages/**/package.json"],
    plugins: {
      "package-json-extend": packageJsonExtend,
    },
    rules: {
      "package-json-extend/ensure-package-version": "error",
      "package-json-extend/no-duplicate-package": "error",
    },
  },
  {
    plugins: {
      // @ts-expect-error
      "react-native": fixupPluginRules(reactNative),
    },
    files: ["apps/mobile/**/*"],
    rules: {
      "react-native/no-inline-styles": "warn",
    },
  },
)
