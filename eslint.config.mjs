// @ts-check
import { defineConfig } from "eslint-config-hyoban"

export default defineConfig(
  {
    stylistic: {
      quotes: "double",
      arrowParens: true,
      braceStyle: "1tbs",
      lineBreak: "after",
    },
    lessOpinionated: true,
    ignores: ["src/renderer/src/hono.ts"],
    preferESM: false,
  },
  {
    settings: {
      tailwindcss: {
        callees: ["cn"],
        whitelist: [
          "center",
        ],
      },
    },
    rules: {
      "unicorn/prefer-module": "off",
      "no-restricted-globals": [
        "error",
        {
          name: "location",
          message: "Since you don't use the same router instance in electron and browser, you can't use the global location to get the route info. \n\n" + "You can use `useLocaltion` or `getReadonlyRoute` to get the route info.",
        },
      ],
    },
  },
)
