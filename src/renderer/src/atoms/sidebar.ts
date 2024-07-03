import { getRouteParams } from "@renderer/hooks/biz/useRouteParams"
import { FeedViewType } from "@renderer/lib/enum"
import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

const [
  sidebarActiveViewAtom,
  useSidebarActiveView,
  useSidebarActiveViewValue,
  useSetSidebarActiveView,
  getSidebarActiveView,
  setSidebarActiveView,
] = createAtomHooks(atom(FeedViewType.Articles))

sidebarActiveViewAtom.onMount = () => {
  const { view } = getRouteParams()
  if (typeof view === "number") { setSidebarActiveView(view) }
}
export {
  getSidebarActiveView,
  setSidebarActiveView,
  useSetSidebarActiveView,
  useSidebarActiveView,
  useSidebarActiveViewValue,
}
