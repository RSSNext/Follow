import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

export const [, ,useAppIsReady, , , setAppIsReady] = createAtomHooks(
  atom(false),
)
