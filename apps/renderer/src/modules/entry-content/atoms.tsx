import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"

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
