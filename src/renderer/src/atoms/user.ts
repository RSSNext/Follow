import type { User } from "@auth/core/types"
import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

export const [, , useWhoami, , whoami, setWhoami] = createAtomHooks(atom<Nullable<User>>(null))

export const [, , useLoginModalShow, useSetLoginModalShow, getLoginModalShow, setLoginModalShow] =
  createAtomHooks(atom<boolean>(false))
