import { createAtomHooks } from "@follow/utils"
import { atomWithStorage } from "jotai/utils"

import { JotaiPersistSyncStorage } from "../lib/jotai"

type Environment = "prod" | "dev" | "staging"
export const [, , useEnvironment, , getEnvironment, setEnvironment] = createAtomHooks(
  atomWithStorage<Environment>("debug-env", "prod", JotaiPersistSyncStorage, {
    getOnInit: true,
  }),
)
