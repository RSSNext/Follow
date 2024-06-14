import { createContext, useContext } from "react"

export const useRootPortal = () => {
  const ctx = useContext(RootPortalContext)

  return ctx.to || document.body
}

const RootPortalContext = createContext<{
  to?: HTMLElement | undefined
}>({
  to: undefined,
})

export const RootPortalProvider = RootPortalContext.Provider
