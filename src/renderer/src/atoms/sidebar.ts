import { getRouteParams } from "@renderer/hooks/biz/useRouteParams"
import { FeedViewType } from "@renderer/lib/enum"
import { createAtomHooks } from "@renderer/lib/jotai"
import { atom } from "jotai"

const defaultFeedView = FeedViewType.Articles
const viewAtom = atom<FeedViewType | -1>(-1)
const [
  ,
  useSidebarActiveView,
  useSidebarActiveViewValue_,
  useSetSidebarActiveView,
  _getSidebarActiveView,
  setSidebarActiveView,
] = createAtomHooks(viewAtom)

const getSidebarActiveView = (): FeedViewType => {
  const view = _getSidebarActiveView()
  if (view === -1) {
    return defaultFeedView
  }
  return view
}

const useSidebarActiveViewValue = (): FeedViewType => {
  const view = useSidebarActiveViewValue_()
  if (view === -1) {
    return defaultFeedView
  }
  return view
}

export {
  getSidebarActiveView,
  setSidebarActiveView,
  useSetSidebarActiveView,
  /**
   * Get original value of sidebar active view
   */
  useSidebarActiveView,
  useSidebarActiveViewValue,
}

viewAtom.onMount = () => {
  const { view } = getRouteParams()
  if (view !== undefined) {
    setSidebarActiveView(view)
  }
}
