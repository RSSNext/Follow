import { atomWithStorage } from "jotai/utils"

import { createAtomHooks } from "~/lib/jotai"
import { getStorageNS } from "~/lib/ns"

export const [
  ,
  ,
  useIsNewUserGuideFinished,
  ,
  getIsNewUserGuideFinished,
  setIsNewUserGuideFinished,
] = createAtomHooks(atomWithStorage(getStorageNS("is-new-user-guide-finished"), false))
