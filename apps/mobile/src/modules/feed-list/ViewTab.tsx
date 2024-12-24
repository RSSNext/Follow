import { useHeaderHeight } from "@react-navigation/elements"
import { useAtomValue } from "jotai"
import { memo, useEffect, useRef, useState } from "react"
import type { TouchableOpacityProps } from "react-native"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import type { WithSpringConfig } from "react-native-reanimated"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { ContextMenu } from "@/src/components/ui/context-menu"
import { bottomViewTabHeight } from "@/src/constants/ui"
import type { ViewDefinition } from "@/src/constants/views"
import { views } from "@/src/constants/views"
import { useUnreadCountByView } from "@/src/store/unread/hooks"
import { unreadSyncService } from "@/src/store/unread/store"

import { offsetAtom, setCurrentView, viewAtom } from "./atoms"

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

  useEffect(() => {
    if (tabWidths.length > 0) {
      indicatorPosition.value = withSpring(tabPositions[currentView] || 0, springConfig)

      if (tabRef.current) {
        tabRef.current.scrollTo({ x: currentView * 60, y: 0, animated: true })
      }
    }
  }, [currentView, tabPositions, tabWidths])

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: indicatorPosition.value + 10 + Math.abs(offset),
        },
      ],
      backgroundColor: views[currentView].activeColor,
      width: (tabWidths[currentView] || 20) - 40 + Math.abs(offset),
    }
  })

  return (
    <ThemedBlurView
      style={[styles.tabContainer, { height: headerHeight + bottomViewTabHeight }]}
      className="border-system-fill/60 relative border-b"
    >
      <View className="absolute inset-x-0 bottom-0" style={{ height: bottomViewTabHeight }}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          className="border-tertiary-system-background"
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
        actions={[{ title: "Mark all as read" }]}
        onPress={(e) => {
          switch (e.nativeEvent.index) {
            case 0: {
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
          className="relative mr-4 flex-row items-center justify-center"
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

  root: { paddingHorizontal: 6, borderTopWidth: StyleSheet.hairlineWidth },
})
