import { createContext } from "react"

export const LoginTeamsCheckedContext = createContext(__DEV__)

export const LoginTeamsCheckGuardContext = createContext<((callback: () => void) => void) | null>(
  () => {},
)
