import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"

export const [, , useShowSourceContent, , getShowSourceContent, setShowSourceContent] =
  createAtomHooks(atom<boolean>(false))

export const toggleShowSourceContent = () => setShowSourceContent(!getShowSourceContent())
export const resetShowSourceContent = () => setShowSourceContent(false)
