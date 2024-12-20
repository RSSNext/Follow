import { useHeaderHeight } from "@react-navigation/elements"
import { useAtom } from "jotai"
import { useEffect, useRef, useState } from "react"
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { bottomViewTabHeight } from "@/src/constants/ui"
import { views } from "@/src/constants/views"

import { viewAtom } from "./atoms"

export const ViewTab = () => {
  const headerHeight = useHeaderHeight()
  const paddingHorizontal = 6
  const [currentView, setCurrentView] = useAtom(viewAtom)

  const tabRef = useRef<ScrollView>(null)

  const indicatorAnim = useRef(new Animated.Value(0)).current

  const [tabWidths, setTabWidths] = useState<number[]>([])
  const [tabPositions, setTabPositions] = useState<number[]>([])

  useEffect(() => {
    if (tabWidths.length > 0) {
      Animated.spring(indicatorAnim, {
        toValue: tabPositions[currentView] || 0,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }).start()

      if (tabRef.current) {
        tabRef.current.scrollTo({ x: currentView * 60, y: 0, animated: true })
      }
    }
  }, [currentView, tabWidths])

  return (
    <ThemedBlurView
      style={[
        styles.tabContainer,
        {
          backgroundColor: "transparent",
          top: headerHeight - StyleSheet.hairlineWidth,
        },
      ]}
      className="border-b border-system-fill/60"
    >
      <ScrollView
        showsHorizontalScrollIndicator={false}
        className="border-tertiary-system-background"
        horizontal
        ref={tabRef}
        contentContainerStyle={styles.tabScroller}
        style={{ paddingHorizontal, borderTopWidth: StyleSheet.hairlineWidth }}
      >
        {views.map((view, index) => {
          const isSelected = currentView === view.view
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setCurrentView(view.view)}
              key={view.name}
              className="mr-4 flex-row items-center justify-center"
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
            </TouchableOpacity>
          )
        })}
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [
                {
                  translateX: Animated.add(
                    indicatorAnim,
                    10, // Left add 10px to center
                  ),
                },
              ],
              backgroundColor: views[currentView].activeColor,
              width: (tabWidths[currentView] || 20) - 20, // Reduce 20px width
            },
          ]}
        />
      </ScrollView>
    </ThemedBlurView>
  )
}

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
    borderRadius: 1,
  },
  tabContainer: {
    bottom: 0,
    left: 0,
    position: "absolute",
    width: "100%",
    borderTopColor: "rgba(0,0,0,0.2)",
    borderTopWidth: StyleSheet.hairlineWidth,
    height: bottomViewTabHeight,
  },
  tabScroller: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 4,
  },
})
