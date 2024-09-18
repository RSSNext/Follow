import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"

export const [, , useMainContainerElement, , getMainContainerElement, setMainContainerElement] =
  createAtomHooks(atom<HTMLElement | null>(null))
