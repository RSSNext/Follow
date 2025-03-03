import { useNavigation } from "expo-router"
import type { RefObject } from "react"
import { useCallback, useContext, useEffect, useRef } from "react"
import type { FlatList, ScrollView } from "react-native"
import { findNodeHandle, Platform } from "react-native"

import { performNativeScrollToTop } from "@/src/lib/native"

import {
  SetAttachNavigationScrollViewContext,
  useAttachNavigationScrollView,
} from "./contexts/AttachNavigationScrollViewContext"
import { BottomTabBarHeightContext } from "./contexts/BottomTabBarHeightContext"

export const useBottomTabBarHeight = () => {
  const height = useContext(BottomTabBarHeightContext)
  return height
}

export const useNavigationScrollToTop = (
  overrideScrollerRef?: React.RefObject<ScrollView> | React.RefObject<FlatList<any>> | null,
) => {
  const attachNavigationScrollViewRef = useAttachNavigationScrollView()
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
      void ($scroller as ScrollView).scrollTo({
        y: 0,
        animated: true,
      })
    } else if ("scrollToIndex" in $scroller) {
      void ($scroller as FlatList<any>).scrollToIndex({
        index: 0,
        animated: true,
      })
    } else if ("scrollToOffset" in $scroller) {
      void ($scroller as FlatList<any>).scrollToOffset({
        offset: 0,
        animated: true,
      })
    }
    return
  }, [attachNavigationScrollViewRef, overrideScrollerRef])
}

export const useRegisterNavigationScrollView = <T = unknown>(active = true) => {
  const scrollViewRef = useRef<T>(null)
  const navigation = useNavigation()
  const setAttachNavigationScrollViewRef = useContext(SetAttachNavigationScrollViewContext)
  useEffect(() => {
    if (!active) return
    if (!setAttachNavigationScrollViewRef) return

    setAttachNavigationScrollViewRef(scrollViewRef as unknown as RefObject<ScrollView>)
    const unsubscribe = navigation.addListener("focus", () => {
      setAttachNavigationScrollViewRef(scrollViewRef as unknown as RefObject<ScrollView>)
    })
    return unsubscribe
  }, [setAttachNavigationScrollViewRef, scrollViewRef, active, navigation])
  return scrollViewRef
}
