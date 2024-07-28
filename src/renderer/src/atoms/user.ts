import type { User } from "@auth/core/types"
import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

export const [, , useMe, useSetMe, getMe, setMe] = createAtomHooks(
  atom<Nullable<User>>(null),
)

export { useMe as useWhoAmI }

export const [
  ,
  ,
  useLoginModalShow,
  useSetLoginModalShow,
  getLoginModalShow,
  setLoginModalShow,
] = createAtomHooks(atom<boolean>(false))
