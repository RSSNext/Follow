import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { createAtomHooks } from "~/lib/jotai"
import { getStorageNS } from "~/lib/ns"

export const [, , useEntryTitleMeta, , getEntryTitleMeta, setEntryTitleMeta] = createAtomHooks(
  atom(
    null as Nullable<{
      title: string
      description: string
    }>,
  ),
)

export const [
  ,
  ,
  useEntryContentScrollToTop,
  ,
  getEntryContentScrollToTop,
  setEntryContentScrollToTop,
] = createAtomHooks(atom(false))

export const [
  ,
  ,
  useEntryContentPlaceholderLogoShow,
  ,
  getEntryContentPlaceholderLogoShow,
  setEntryContentPlaceholderLogoShow,
] = createAtomHooks(atom(true))

export const [, , , , getTranslationCache, setTranslationCache] = createAtomHooks(
  atomWithStorage(getStorageNS("translation-cache"), {} as Record<string, string>),
)
