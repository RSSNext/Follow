export default {
  entry: ["./src/index.ts", "./src/link-parser.ts"],
  format: ["esm"],
  dts: true,
  external: ["react", "react-dom"],
  clean: true,
  outDir: "dist",
}
