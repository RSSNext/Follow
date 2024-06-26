import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

export const [
  ,
  useSidebarActiveView,
  useSidebarActiveViewValue,
  useSetSidebarActiveView,
  getSidebarActiveView,
  setSidebarActiveView,
] = createAtomHooks(atom(0))
