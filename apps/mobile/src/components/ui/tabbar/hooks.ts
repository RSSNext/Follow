import { useCallback, useContext } from "react"
import type { FlatList, ScrollView } from "react-native"

import { AttachNavigationScrollViewContext } from "./contexts/AttachNavigationScrollViewContext"
import { BottomTabBarHeightContext } from "./contexts/BottomTabBarHeightContext"

export const useBottomTabBarHeight = () => {
  const height = useContext(BottomTabBarHeightContext)
  return height
}

export const useNavigationScrollToTop = (
  overrideScrollerRef?: React.RefObject<ScrollView> | React.RefObject<FlatList<any>> | null,
) => {
  const attachNavigationScrollViewRef = useContext(AttachNavigationScrollViewContext)
  return useCallback(() => {
    const $scroller = overrideScrollerRef?.current ?? attachNavigationScrollViewRef?.current
    if (!$scroller) return

    if ("scrollTo" in $scroller) {
      ;($scroller as ScrollView).scrollTo({
        y: 0,
        animated: true,
      })
    } else if ("scrollToIndex" in $scroller) {
      ;($scroller as FlatList<any>).scrollToIndex({
        index: 0,
        animated: true,
      })
    } else if ("scrollToOffset" in $scroller) {
      ;($scroller as FlatList<any>).scrollToOffset({
        offset: 0,
        animated: true,
      })
    }
    return
  }, [attachNavigationScrollViewRef, overrideScrollerRef])
}
