import { atom } from "jotai"

export const loadingVisibleAtom = atom(false)

export const loadingAtom = atom<{
  finish: null | (() => any)
  cancel: null | (() => any)
  thenable: null | Promise<any>
}>({
  finish: null,
  cancel: null,
  thenable: null,
})
