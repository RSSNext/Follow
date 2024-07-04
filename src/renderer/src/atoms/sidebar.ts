import { FeedViewType } from "@renderer/lib/enum"
import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

const [
  ,
  useSidebarActiveView,
  useSidebarActiveViewValue,
  useSetSidebarActiveView,
  getSidebarActiveView,
  setSidebarActiveView,
] = createAtomHooks(atom(FeedViewType.Articles))

export {
  getSidebarActiveView,
  setSidebarActiveView,
  useSetSidebarActiveView,
  useSidebarActiveView,
  useSidebarActiveViewValue,
}
