import { jotaiStore } from "@renderer/lib/jotai"
import { atom, useAtomValue } from "jotai"
import { useLayoutEffect } from "react"
import { useMediaQuery } from "usehooks-ts"

const darkAtom = atom(false)
export function useDark() {
  return useAtomValue(darkAtom)
}

export const useSyncDark = () => {
  const isDark = useMediaQuery("(prefers-color-scheme: dark)")

  useLayoutEffect(() => {
    jotaiStore.set(darkAtom, isDark)

    document.documentElement.dataset.theme = isDark ? "dark" : "light"
    disableTransition([
      "[role=switch]>*",
    ])
  }, [isDark])
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
    setTimeout(() => {
      css.remove()
    }, 1)
  }
}
