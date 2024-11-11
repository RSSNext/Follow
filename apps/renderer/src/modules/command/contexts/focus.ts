import { createAtomHooks } from "@follow/utils/jotai"
import { atom } from "jotai"

type UserFocus =
  | {
      type: "unknown"
    }
  | {
      type: "entry"
      feedId: string
      entryId: string
    }
  | {
      type: "feed"
      feedId: string
    }
  | {
      type: "list"
      listId: string
    }
  | {
      type: "category"
    }

export const [, useUserFocus, useUserFocusValue, useSetUserFocus, getUserFocus, setUserFocus] =
  createAtomHooks(
    atom<UserFocus>({
      type: "unknown" as const,
    }),
  )
