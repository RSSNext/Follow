import { defineConfig, loadEnv } from "vite"

import type { env as EnvType } from "./packages/shared/src/env"

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const typedEnv = env as typeof EnvType

  return defineConfig({})
}
