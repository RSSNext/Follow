import { useHeaderHeight } from "@react-navigation/elements"
import { useAtomValue } from "jotai"
import { memo, useEffect, useRef, useState } from "react"
import type { TouchableOpacityProps } from "react-native"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { WithSpringConfig } from "react-native-reanimated"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { ContextMenu } from "@/src/components/ui/context-menu"
import type { ViewDefinition } from "@/src/constants/views"
import { views } from "@/src/constants/views"
import { useUnreadCountByView } from "@/src/store/unread/hooks"
import { unreadSyncService } from "@/src/store/unread/store"

import { offsetAtom, setCurrentView, viewAtom } from "./atoms"
import { ViewTabHeight } from "./constants"

const springConfig: WithSpringConfig = {
  damping: 20,
  mass: 1,
  stiffness: 120,
}
export const ViewTab = () => {
  const headerHeight = useHeaderHeight()
  const offset = useAtomValue(offsetAtom)
  const currentView = useAtomValue(viewAtom)
  const tabRef = useRef<ScrollView>(null)

  const indicatorPosition = useSharedValue(0)

  const [tabWidths, setTabWidths] = useState<number[]>([])
  const [tabPositions, setTabPositions] = useState<number[]>([])
  const scrollOffsetX = useRef(0)

  useEffect(() => {
    if (tabWidths.length > 0) {
      indicatorPosition.value = withSpring(tabPositions[currentView] || 0, springConfig)

      if (tabRef.current) {
        const x = currentView > 0 ? tabPositions[currentView - 1]! + tabWidths[currentView - 1]! : 0

        const isCurrentTabVisible =
          scrollOffsetX.current < tabPositions[currentView]! &&
          scrollOffsetX.current + tabWidths[currentView]! > tabPositions[currentView]!

        if (!isCurrentTabVisible) {
          tabRef.current.scrollTo({ x, y: 0, animated: true })
        }
      }
    }
  }, [currentView, indicatorPosition, tabPositions, tabWidths])

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: indicatorPosition.value + 10 + Math.abs(offset),
        },
      ],
      backgroundColor: views[currentView]!.activeColor,
      width: (tabWidths[currentView] || 20) - 40 + Math.abs(offset),
    }
  })

  return (
    <ThemedBlurView
      style={[styles.tabContainer, { height: headerHeight + ViewTabHeight }]}
      className="border-opaque-separator border-b-hairline relative"
    >
      <View className="absolute inset-x-0 bottom-0" style={{ height: ViewTabHeight }}>
        <ScrollView
          onScroll={(event) => {
            scrollOffsetX.current = event.nativeEvent.contentOffset.x
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
          ref={tabRef}
          contentContainerStyle={styles.tabScroller}
          style={styles.root}
        >
          {views.map((view, index) => {
            const isSelected = currentView === view.view
            return (
              <TabItem
                isSelected={isSelected}
                key={view.name}
                view={view}
                onLayout={(event) => {
                  const { width, x } = event.nativeEvent.layout
                  setTabWidths((prev) => {
                    const newWidths = [...prev]
                    newWidths[index] = width
                    return newWidths
                  })
                  setTabPositions((prev) => {
                    const newPositions = [...prev]
                    newPositions[index] = x
                    return newPositions
                  })
                }}
              />
            )
          })}
          <Animated.View style={[styles.indicator, indicatorStyle]} />
        </ScrollView>
      </View>
    </ThemedBlurView>
  )
}

const TabItem = memo(
  ({
    isSelected,
    view,
    onLayout,
  }: { isSelected: boolean; view: ViewDefinition } & Pick<TouchableOpacityProps, "onLayout">) => {
    const unreadCount = useUnreadCountByView(view.view)
    return (
      <ContextMenu
        // actions={[{ title: "Mark all as read" }]}
        config={{ items: [{ title: "Mark all as read", actionKey: "markAllAsRead" }] }}
        onPressMenuItem={(e) => {
          switch (e.actionKey) {
            case "markAllAsRead": {
              unreadSyncService.markViewAsRead(view.view)
              break
            }
          }
        }}
        onLayout={onLayout}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setCurrentView(view.view)}
          className="relative mr-4 flex-row items-center justify-center rounded-full"
        >
          <view.icon color={isSelected ? view.activeColor : "gray"} height={18} width={18} />
          <Text
            style={{
              color: isSelected ? view.activeColor : "gray",
              fontWeight: isSelected ? "medium" : "normal",
            }}
            className="ml-2"
          >
            {view.name}
          </Text>
          {unreadCount > 0 && (
            <View className={"bg-red ml-1 rounded-full px-1"}>
              <Text className="text-xs font-medium text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ContextMenu>
    )
  },
)
const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
    borderRadius: 1,
  },
  tabContainer: {
    backgroundColor: "transparent",
    bottom: 0,
    left: 0,
    position: "absolute",
    width: "100%",
    top: 0,
  },
  tabScroller: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 4,
  },

  root: { paddingHorizontal: 6 },
})
