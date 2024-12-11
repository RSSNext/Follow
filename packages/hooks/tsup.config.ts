export default {
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  external: ["react", "react-dom"],
  clean: true,
  outDir: "dist",
  noExternal: ["@follow/shared", "@follow/utils"],
}
