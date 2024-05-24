import type { ActiveList, ActivedEntry } from "@renderer/lib/types"
import { Outlet, useOutletContext } from "react-router-dom"

export interface MainLayoutContextType {
  activeList: ActiveList
  setActiveEntry: (value: ActivedEntry) => void

  activeEntry: ActivedEntry
  setActiveList: (value: ActiveList) => void
}

export const useMainLayoutContext = () =>
  useOutletContext<MainLayoutContextType>()

export const MainLayoutOutlet = (ctxValue: MainLayoutContextType) => (
  <Outlet context={ctxValue} />
)
