import { IN_ELECTRON } from "@follow/shared/constants"
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useMediaQuery } from "usehooks-ts"

import { getStorageNS } from "~/lib/ns"

export const useDarkQuery = () => useMediaQuery("(prefers-color-scheme: dark)")
export type ColorMode = "light" | "dark" | "system"

export const themeAtom = !IN_ELECTRON
  ? atomWithStorage(getStorageNS("color-mode"), "system" as ColorMode, undefined, {
      getOnInit: true,
    })
  : atom("system" as ColorMode)
