import type { RefObject } from "react"
import { useCallback, useContext, useEffect, useRef } from "react"
import type { FlatList, ScrollView } from "react-native"
import { findNodeHandle, Platform } from "react-native"

import { performNativeScrollToTop } from "@/src/lib/native"

import {
  AttachNavigationScrollViewContext,
  SetAttachNavigationScrollViewContext,
} from "./contexts/AttachNavigationScrollViewContext"
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

    if (Platform.OS === "ios") {
      const reactTag = findNodeHandle($scroller)
      if (reactTag) {
        performNativeScrollToTop(reactTag)
        return
      }
    }

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

export const useRegisterNavigationScrollView = <T = any>() => {
  const scrollViewRef = useRef<T>(null)
  const setAttachNavigationScrollViewRef = useContext(SetAttachNavigationScrollViewContext)
  useEffect(() => {
    if (setAttachNavigationScrollViewRef) {
      setAttachNavigationScrollViewRef(scrollViewRef as unknown as RefObject<ScrollView>)
    }
  }, [setAttachNavigationScrollViewRef, scrollViewRef])
  return scrollViewRef
}
