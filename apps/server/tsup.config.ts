import { defineConfig } from "tsup"

export default defineConfig(() => {
  return {
    entry: ["index.ts"],
    outDir: "dist/server",
    splitting: false,
    clean: true,
    format: ["cjs"],
    external: ["lightningcss"],
    treeshake: true,
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
    },
  }
})
