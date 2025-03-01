import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"

export const [, , useShowAITranslation, , getShowAITranslation, setShowAITranslation] =
  createAtomHooks(atom<boolean>(false))

export const toggleShowAITranslation = () => setShowAITranslation(!getShowAITranslation())
export const enableShowAITranslation = () => setShowAITranslation(true)
export const disableShowAITranslation = () => setShowAITranslation(false)
