import { IN_ELECTRON } from "@follow/shared/constants"
import { atom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useCallback, useLayoutEffect } from "react"
import { useMediaQuery } from "usehooks-ts"

import { tipcClient } from "~/lib/client"
import { nextFrame } from "~/lib/dom"
import { jotaiStore } from "~/lib/jotai"
import { getStorageNS } from "~/lib/ns"

const useDarkQuery = () => useMediaQuery("(prefers-color-scheme: dark)")
type ColorMode = "light" | "dark" | "system"
const themeAtom = !IN_ELECTRON
  ? atomWithStorage(getStorageNS("color-mode"), "system" as ColorMode, undefined, {
      getOnInit: true,
    })
  : atom("system" as ColorMode)

function useDarkWebApp() {
  const systemIsDark = useDarkQuery()
  const mode = useAtomValue(themeAtom)
  return mode === "dark" || (mode === "system" && systemIsDark)
}
export const useIsDark = useDarkWebApp

export const useThemeAtomValue = () => useAtomValue(themeAtom)

const useSyncThemeElectron = () => {
  const appIsDark = useDarkQuery()

  useLayoutEffect(() => {
    let isMounted = true
    tipcClient?.getAppearance().then((appearance) => {
      if (!isMounted) return
      jotaiStore.set(themeAtom, appearance)
      disableTransition(["[role=switch]>*"])()

      document.documentElement.dataset.theme =
        appearance === "system" ? (appIsDark ? "dark" : "light") : appearance
    })
    return () => {
      isMounted = false
    }
  }, [appIsDark])
}

const useSyncThemeWebApp = () => {
  const colorMode = useAtomValue(themeAtom)
  const systemIsDark = useDarkQuery()
  useLayoutEffect(() => {
    const realColorMode: Exclude<ColorMode, "system"> =
      colorMode === "system" ? (systemIsDark ? "dark" : "light") : colorMode
    document.documentElement.dataset.theme = realColorMode
    disableTransition(["[role=switch]>*"])()
  }, [colorMode, systemIsDark])
}

export const useSyncThemeark = IN_ELECTRON ? useSyncThemeElectron : useSyncThemeWebApp

export const useSetTheme = () =>
  useCallback((colorMode: ColorMode) => {
    jotaiStore.set(themeAtom, colorMode)

    if (IN_ELECTRON) {
      tipcClient?.setAppearance(colorMode)
    }
  }, [])

function disableTransition(disableTransitionExclude: string[] = []) {
  const css = document.createElement("style")
  css.append(
    document.createTextNode(
      `
*${disableTransitionExclude.map((s) => `:not(${s})`).join("")} {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -o-transition: none !important;
  -ms-transition: none !important;
  transition: none !important;
}
      `,
    ),
  )
  document.head.append(css)

  return () => {
    // Force restyle
    ;(() => window.getComputedStyle(document.body))()

    // Wait for next tick before removing
    nextFrame(() => {
      css.remove()
    })
  }
}
