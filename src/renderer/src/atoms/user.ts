import type { User } from "@auth/core/types"
import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

export const [, , useUser, useSetUser, getUser, setUser] = createAtomHooks(
  atom<Nullable<User>>(null),
)
