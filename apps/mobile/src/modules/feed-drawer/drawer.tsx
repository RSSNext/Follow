import type { PropsWithChildren } from "react"
import { useCallback } from "react"
import { useWindowDimensions, View } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import type { PanGestureType } from "react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture"

import { useFeedDrawer } from "@/src/lib/hooks/drawer-open"
import { useIsDrawerSwipeDisabled } from "@/src/lib/hooks/drawer-swipe-disabled"
import { isIOS } from "@/src/lib/platform"

import { CollectionPanel } from "./collection-panel"
import { FeedPanel } from "./feed-panel"

export const FeedDrawer = ({ children }: PropsWithChildren) => {
  const { isDrawerOpen, openDrawer, closeDrawer } = useFeedDrawer()
  const winDim = useWindowDimensions()
  const isDrawerSwipeDisabled = useIsDrawerSwipeDisabled()

  const renderDrawerContent = useCallback(() => <DrawerContent />, [])
  const configureGestureHandler = useCallback(
    (handler: PanGestureType) => {
      const swipeEnabled = !isDrawerSwipeDisabled
      if (swipeEnabled) {
        if (isDrawerOpen) {
          return handler.activeOffsetX([-1, 1])
        } else {
          return (
            handler
              // Any movement to the left is a pager swipe
              // so fail the drawer gesture immediately.
              .failOffsetX(-1)
              // Don't rush declaring that a movement to the right
              // is a drawer swipe. It could be a vertical scroll.
              .activeOffsetX(5)
          )
        }
      } else {
        // Fail the gesture immediately.
        // This seems more reliable than the `swipeEnabled` prop.
        // With `swipeEnabled` alone, the gesture may freeze after toggling off/on.
        return handler.failOffsetX([0, 0]).failOffsetY([0, 0])
      }
    },
    [isDrawerOpen, isDrawerSwipeDisabled],
  )

  return (
    <Drawer
      open={isDrawerOpen}
      drawerStyle={{ width: Math.min(400, winDim.width * 0.85) }}
      onOpen={openDrawer}
      onClose={closeDrawer}
      renderDrawerContent={renderDrawerContent}
      configureGestureHandler={configureGestureHandler}
      swipeEdgeWidth={winDim.width}
      swipeMinVelocity={100}
      swipeMinDistance={10}
      drawerType={isIOS ? "slide" : "front"}
    >
      {children}
    </Drawer>
  )
}

const DrawerContent = () => {
  return (
    <View className="bg-system-background flex h-[500px] flex-1 flex-row overflow-hidden">
      <CollectionPanel />
      <FeedPanel />
    </View>
  )
}
