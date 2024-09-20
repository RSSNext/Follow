import type { User } from "@auth/core/types"
import { atom } from "jotai"

import { createAtomHooks } from "~/lib/jotai"

export const [, , useWhoami, , whoami, setWhoami] = createAtomHooks(atom<Nullable<User>>(null))

export const [, , useLoginModalShow, useSetLoginModalShow, getLoginModalShow, setLoginModalShow] =
  createAtomHooks(atom<boolean>(false))
