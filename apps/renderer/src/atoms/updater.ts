import { getStorageNS } from "@follow/utils/ns"
import { atomWithStorage } from "jotai/utils"

import { createAtomHooks } from "~/lib/jotai"

export type UpdaterStatus = "ready"
export type UpdaterStatusAtom = {
  type: "app" | "renderer"
  status: UpdaterStatus
} | null
export const [, , useUpdaterStatus, , getUpdaterStatus, setUpdaterStatus] = createAtomHooks(
  atomWithStorage(getStorageNS("update"), null as UpdaterStatusAtom, undefined, {
    getOnInit: true,
  }),
)
