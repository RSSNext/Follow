/* eslint-disable unicorn/no-unreadable-array-destructuring */
import type { User } from "@auth/core/types"
import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

export const [, , useUser, useSetUser, getUser, setUser] = createAtomHooks(
  atom<Nullable<User>>(null),
)
