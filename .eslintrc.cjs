module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "@electron-toolkit/eslint-config-ts/recommended",
    "@electron-toolkit/eslint-config-prettier",
    "plugin:tailwindcss/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    "import/resolver": {
      node: { extensions: [".js", ".mjs", ".ts", ".d.ts"] },
    },
    tailwindcss: {
      callees: ["clsx", "cn"],
      whitelist: [],
    },
    react: {
      version: "detect",
    },
  },
  plugins: ["unused-imports"],
  rules: {
    "import/named": "off",
    "import/no-anonymous-default-export": "off",
    "import/no-named-as-default": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps":
      process.env.NODE_ENV === "production" ? "off" : "warn",
    "import/no-named-as-default-member": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/prop-types": "off",

    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
}
