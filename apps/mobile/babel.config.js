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
            "es-toolkit": path.resolve(__dirname, "../../node_modules/es-toolkit/dist/index.js"),
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
    ],
  }
}
