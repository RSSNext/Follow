import { getRouteParams } from "@renderer/hooks/biz/useRouteParams"
import type { FeedViewType } from "@renderer/lib/enum"
import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

const viewAtom = atom<FeedViewType | -1>(-1)
const [
  ,
  useSidebarActiveView,
  useSidebarActiveViewValue,
  useSetSidebarActiveView,
  getSidebarActiveView,
  setSidebarActiveView,
] = createAtomHooks(viewAtom)

export {
  getSidebarActiveView,
  setSidebarActiveView,
  useSetSidebarActiveView,
  useSidebarActiveView,
  useSidebarActiveViewValue,
}

viewAtom.onMount = () => {
  const { view } = getRouteParams()
  if (view !== undefined) {
    setSidebarActiveView(view)
  }
}
