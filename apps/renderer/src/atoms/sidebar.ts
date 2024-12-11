import { FeedViewType } from "@follow/constants"
import { atom } from "jotai"

import { getRouteParams } from "~/hooks/biz/useRouteParams"
import { createAtomHooks } from "~/lib/jotai"

import { getIsZenMode, useIsZenMode } from "./settings/ui"

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
const [, , internal_useFeedColumnShow, , internal_getFeedColumnShow, setFeedColumnShow] =
  createAtomHooks(atom(true))

export const useFeedColumnShow = () => {
  const isZenMode = useIsZenMode()
  return internal_useFeedColumnShow() && !isZenMode
}

export const getFeedColumnShow = () => {
  const isZenMode = getIsZenMode()
  return internal_getFeedColumnShow() && !isZenMode
}

export { setFeedColumnShow }

export const [, , useFeedColumnTempShow, , getFeedColumnTempShow, setFeedColumnTempShow] =
  createAtomHooks(atom(false))
