export default {
  entry: ["exports.ts"],
  format: ["esm"],
  dts: true,
  external: ["react", "react-dom"],
  clean: true,
  outDir: "dist",
}
