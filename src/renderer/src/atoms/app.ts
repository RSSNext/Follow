import { createAtomHooks } from "@renderer/lib/jotai"
import { getStorageNS } from "@renderer/lib/ns"
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const [, , useAppIsReady, , appIsReady, setAppIsReady] = createAtomHooks(
  atom(false),
)

export const [, , useAppSearchOpen, , , setAppSearchOpen] = createAtomHooks(
  atom(false),
)

export const [, , useFeedColumnShow, , , setFeedColumnShow] = createAtomHooks(
  atomWithStorage(
    getStorageNS("feed-column-show"),
    true,
  ),
)
