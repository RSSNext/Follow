import { createContext, useContext } from "react"

export const useRootPortal = () => {
  const ctx = useContext(RootPortalContext)

  return ctx || document.body
}

const RootPortalContext = createContext<HTMLElement | undefined>(undefined)

export const RootPortalProvider = RootPortalContext.Provider
