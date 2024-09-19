import { atomWithStorage } from "jotai/utils"

import { createAtomHooks } from "~/lib/jotai"
import { getStorageNS } from "~/lib/ns"

export const [, , useUpdaterStatus, , , setUpdaterStatus] = createAtomHooks(
  atomWithStorage(getStorageNS("updater"), false, undefined, {
    getOnInit: true,
  }),
)
