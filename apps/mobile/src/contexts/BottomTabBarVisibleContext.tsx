import type { Dispatch, SetStateAction } from "react"
import { createContext } from "react"

export const SetBottomTabBarVisibleContext = createContext<Dispatch<SetStateAction<boolean>>>(
  () => {},
)
