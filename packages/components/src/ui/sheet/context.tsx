import { atom } from "jotai"
import { createContext, useContext } from "react"

interface SheetContextValue {
  dismiss: () => void
}
export const SheetContext = createContext<SheetContextValue | null>(null)

export const useSheetContext = () => useContext(SheetContext)
export const sheetStackAtom = atom([] as HTMLDivElement[])
