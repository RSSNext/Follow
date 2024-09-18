import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"

export const [, , useAppIsReady, , appIsReady, setAppIsReady] = createAtomHooks(atom(false))

export const [, , useAppSearchOpen, , , setAppSearchOpen] = createAtomHooks(atom(false))
