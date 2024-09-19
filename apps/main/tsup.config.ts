import { defineConfig } from "tsup"

export default defineConfig(() => ({
  entry: ["./export.ts"],
  outDir: "dist",
  format: "esm",
  clean: true,
  dts: true,
  splitting: false,
  sourcemap: true,
  skipNodeModulesBundle: true,
}))
