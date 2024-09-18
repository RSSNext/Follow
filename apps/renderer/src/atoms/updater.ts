import { createAtomHooks } from "@renderer/lib/jotai"
import { getStorageNS } from "@renderer/lib/ns"
import { atomWithStorage } from "jotai/utils"

export const [, , useUpdaterStatus, , , setUpdaterStatus] = createAtomHooks(
  atomWithStorage(getStorageNS("updater"), false, undefined, {
    getOnInit: true,
  }),
)
