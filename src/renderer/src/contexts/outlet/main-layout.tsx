import type { ActiveList, ActiveEntry } from "@renderer/lib/types"
import { Outlet, useOutletContext } from "react-router-dom"

export interface MainLayoutContextType {
  activeList: ActiveList
  setActiveEntry: (value: ActiveEntry) => void

  activeEntry: ActiveEntry
  setActiveList: ((value: ActiveList) => void) | undefined
}

export const useMainLayoutContext = () =>
  useOutletContext<MainLayoutContextType>()

export const MainLayoutOutlet = (ctxValue: MainLayoutContextType) => (
  <Outlet context={ctxValue} />
)
