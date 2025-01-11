import { atom } from "jotai"

export const loadingVisibleAtom = atom(false)

export const loadingAtom = atom<{
  finish?: null | (() => any)
  cancel?: null | (() => any)
  error?: null | ((err: any) => any)
  done?: null | ((r: unknown) => any)
  thenable: null | Promise<any>
}>({
  finish: null,
  cancel: null,
  error: null,
  done: null,
  thenable: null,
})
