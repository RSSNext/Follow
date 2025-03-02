import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"

export const [, , useShowAISummary, , getShowAISummary, setShowAISummary] = createAtomHooks(
  atom<boolean>(false),
)

export const toggleShowAISummary = () => setShowAISummary(!getShowAISummary())
export const enableShowAISummary = () => setShowAISummary(true)
export const disableShowAISummary = () => setShowAISummary(false)
