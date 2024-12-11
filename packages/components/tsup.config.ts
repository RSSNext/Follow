import cssModulesPlugin from "esbuild-css-modules-plugin"

export default {
  entry: ["exports.ts"],
  format: ["esm"],
  dts: true,
  external: ["react", "react-dom"],
  clean: true,
  outDir: "dist",
  noExternal: ["@follow/shared", "@follow/utils"],
  esbuildPlugins: [cssModulesPlugin()],
}
