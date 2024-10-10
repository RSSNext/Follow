import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"

export const [
  ,
  useHaveUsedOtherRSSReaderAtom,
  useHaveUsedOtherRSSReader,
  ,
  getHaveUsedOtherRSSReader,
  setHaveUsedOtherRSSReader,
] = createAtomHooks(atom(false))
