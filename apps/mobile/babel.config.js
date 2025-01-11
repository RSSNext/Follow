const path = require("node:path")

module.exports = function (api) {
  api.cache(true)
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins: [
      ["inline-import", { extensions: [".sql"] }],
      [
        "module-resolver",
        {
          alias: {
            "es-toolkit/compat": path.resolve(
              __dirname,
              "../../node_modules/es-toolkit/dist/compat/index.js",
            ),
            "es-toolkit": path.resolve(__dirname, "../../node_modules/es-toolkit/dist/index.js"),
            "better-auth/react": path.resolve(
              __dirname,
              "../../node_modules/better-auth/dist/react.js",
            ),
            "@better-auth/expo/client": path.resolve(
              __dirname,
              "../../node_modules/@better-auth/expo/dist/client.js",
            ),
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
      "react-native-reanimated/plugin",
    ],
  }
}
