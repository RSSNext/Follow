import { jotaiStore } from "@follow/utils"
import type { FlashList } from "@shopify/flash-list"
import { atom } from "jotai"
import { useEffect, useRef } from "react"

const defaultScrollToTop = { scrollToTop: () => {} }
const scrollToTopAtom = atom<{ scrollToTop: () => void }>(defaultScrollToTop)

export const scrollToTop = () => {
  const { scrollToTop } = jotaiStore.get(scrollToTopAtom)
  scrollToTop()
}

export const useScrollToTopRef = <T extends FlashList<unknown>>(enabled = true) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!enabled) return
    const scrollToTop = () => {
      ref.current?.scrollToOffset({ animated: true, offset: 0 })
    }
    jotaiStore.set(scrollToTopAtom, { scrollToTop })
    // return () => {
    //   jotaiStore.set(scrollToTopAtom, defaultScrollToTop)
    // }
  }, [enabled, ref])
  return ref
}
