import { nextFrame } from "@renderer/lib/dom"
import { jotaiStore } from "@renderer/lib/jotai"
import { getStorageNS } from "@renderer/lib/ns"
import { atom, useAtomValue } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { useCallback, useLayoutEffect } from "react"
import { useMediaQuery } from "usehooks-ts"

const useDarkQuery = () => useMediaQuery("(prefers-color-scheme: dark)")
type ColorMode = "light" | "dark" | "system"
const darkAtom = !window.electron ?
  atomWithStorage(
    getStorageNS("color-mode"),
    "system" as ColorMode,
    undefined,
    {
      getOnInit: true,
    },
  ) :
  atom("system" as ColorMode)
function useDarkElectron() {
  return useAtomValue(darkAtom) === "dark"
}
function useDarkWebApp() {
  const systemIsDark = useDarkQuery()
  const mode = useAtomValue(darkAtom)
  return mode === "dark" || (mode === "system" && systemIsDark)
}
export const useDark = window.electron ? useDarkElectron : useDarkWebApp

const useSyncDarkElectron = () => {
  const appIsDark = useDarkQuery()

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = appIsDark ? "dark" : "light"
    disableTransition(["[role=switch]>*"])()

    jotaiStore.set(darkAtom, appIsDark ? "dark" : "light")
  }, [appIsDark])
}

const useSyncDarkWebApp = () => {
  const colorMode = useAtomValue(darkAtom)
  const systemIsDark = useDarkQuery()
  useLayoutEffect(() => {
    const realColorMode: Exclude<ColorMode, "system"> =
      colorMode === "system" ? (systemIsDark ? "dark" : "light") : colorMode
    document.documentElement.dataset.theme = realColorMode
    disableTransition(["[role=switch]>*"])()
  }, [colorMode, systemIsDark])
}

export const useSyncDark = window.electron ?
  useSyncDarkElectron :
  useSyncDarkWebApp

export const useSetDarkInWebApp = () => {
  const systemColorMode = useDarkQuery() ? "dark" : "light"
  return useCallback(
    (colorMode: Exclude<ColorMode, "system">) =>
      jotaiStore.set(
        darkAtom,
        colorMode === systemColorMode ? "system" : colorMode,
      ),
    [systemColorMode],
  )
}

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
    (() => window.getComputedStyle(document.body))()

    // Wait for next tick before removing
    nextFrame(() => {
      css.remove()
    })
  }
}
