import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

export const [
  ,
  ,
  useMainContainerElement,
  ,
  getMainContainerElement,
  setMainContainerElement,
] = createAtomHooks(atom<HTMLElement | null>(null))
