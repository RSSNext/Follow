import { getStorageNS } from "@follow/utils/ns"
import { atomWithStorage } from "jotai/utils"

import { createAtomHooks } from "~/lib/jotai"

export const [, , useUpdaterStatus, , , setUpdaterStatus] = createAtomHooks(
  atomWithStorage(getStorageNS("updater"), false, undefined, {
    getOnInit: true,
  }),
)
