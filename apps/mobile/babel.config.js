module.exports = function (api) {
  api.cache(true)
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins: [
      ["inline-import", { extensions: [".sql"] }],
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "es-toolkit/compat": "../../node_modules/es-toolkit/dist/compat/index.js",
            "es-toolkit": "../../node_modules/es-toolkit/dist/index.js",
            "better-auth/react": "../../node_modules/better-auth/dist/react.js",
            "better-auth/client/plugins": "../../node_modules/better-auth/dist/client/plugins.js",
            "@better-auth/expo/client": "../../node_modules/@better-auth/expo/dist/client.js",
          },
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      ],
      "react-native-reanimated/plugin",
    ],
  }
}
