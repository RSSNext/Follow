import { jotaiStore } from "@follow/utils"
import { atom } from "jotai"

// horizontal scrolling state

const horizontalScrollingAtom = atom<boolean>(false)

export const setHorizontalScrolling = (value: boolean) =>
  jotaiStore.set(horizontalScrollingAtom, value)

export const getHorizontalScrolling = () => jotaiStore.get(horizontalScrollingAtom)
