import type { User } from "@auth/core/types"
import { atom } from "jotai"

import type { UserRole } from "~/lib/enum"
import { createAtomHooks } from "~/lib/jotai"

export const [, , useWhoami, , whoami, setWhoami] = createAtomHooks(atom<Nullable<User>>(null))

export const [, , useLoginModalShow, useSetLoginModalShow, getLoginModalShow, setLoginModalShow] =
  createAtomHooks(atom<boolean>(false))

/**
 * For public beta trial user
 */
export const [, , useUserRole, , getUserRole, setUserRole] = createAtomHooks(
  atom<Nullable<UserRole>>(null),
)
