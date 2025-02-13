import { createContext } from "react"

export const LoginTermsCheckedContext = createContext(__DEV__)

export const LoginTermsCheckGuardContext = createContext<((callback: () => void) => void) | null>(
  () => {},
)
