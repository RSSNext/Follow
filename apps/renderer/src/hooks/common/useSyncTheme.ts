import { IN_ELECTRON } from "@follow/shared/constants"
import { useAtomValue } from "jotai"
import { useCallback, useLayoutEffect } from "react"

import { tipcClient } from "~/lib/client"
import { nextFrame } from "~/lib/dom"
import { jotaiStore } from "~/lib/jotai"

import type { ColorMode } from "./internal/for-theme"
import { themeAtom, useDarkQuery } from "./internal/for-theme"

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

export const useSyncTheme = IN_ELECTRON ? useSyncThemeElectron : useSyncThemeWebApp

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
