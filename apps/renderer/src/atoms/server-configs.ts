import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"
import type { ServerConfigs } from "~/models"

export const [, , useServerConfigs, , getServerConfigs, setServerConfigs] = createAtomHooks(
  atom<Nullable<ServerConfigs>>(null),
)
