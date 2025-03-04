import { createContext, useContext } from "react"

/**
 * @internal
 */
export const IsInParagraphContext = createContext<boolean>(false)

export const useIsInParagraphContext = () => {
  return useContext(IsInParagraphContext)
}
