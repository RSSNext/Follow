import { createAtomHooks } from "@renderer/lib/jotai"
import { getStorageNS } from "@renderer/lib/ns"
import { atomWithStorage } from "jotai/utils"

type CornerPlayerAtomValue = {
  show: boolean
  type?: "audio"
  entryId?: string
  url?: string
}

const cornerPlayerInitialValue: CornerPlayerAtomValue = {
  show: false,
}

export const [
  cornerPlayerAtom,
  useCornerPlayerAtom,
  useCornerPlayerAtomValue,
  useSetCornerPlayerAtom,
  getCornerPlayerAtomValue,
  setCornerPlayerAtomValue,
] = createAtomHooks<CornerPlayerAtomValue>(
  atomWithStorage(
    getStorageNS("corner-player"),
    cornerPlayerInitialValue,
    undefined,
    { getOnInit: true },
  ),
)
