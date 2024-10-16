import { defineConfig } from "tsup"

export default defineConfig(() => {
  return {
    entry: ["index.ts"],
    outDir: "dist/server",
    splitting: false,
    clean: true,
    format: ["esm"],
  }
})
