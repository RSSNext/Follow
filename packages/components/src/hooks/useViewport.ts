import { jotaiStore } from "@follow/utils/jotai"
import type { ExtractAtomValue } from "jotai"
import { useAtomValue } from "jotai"
import { selectAtom } from "jotai/utils"
import { useCallback } from "react"

import { viewportAtom } from "../atoms/viewport"

export const useViewport = <T>(selector: (value: ExtractAtomValue<typeof viewportAtom>) => T): T =>
  useAtomValue(
    selectAtom(
      viewportAtom,
      useCallback((atomValue) => selector(atomValue), []),
    ),
  )

export const useIsMobile = () =>
  useViewport(useCallback((v: ExtractAtomValue<typeof viewportAtom>) => isMobile(v), []))

const isMobile = (v: ExtractAtomValue<typeof viewportAtom>) => (v.sm || v.md || !v.sm) && !v.lg
export const currentIsMobile = () => {
  const v = jotaiStore.get(viewportAtom)
  return isMobile(v)
}

export const getViewport = () => jotaiStore.get(viewportAtom)
