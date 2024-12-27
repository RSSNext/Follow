import { cn } from "@follow/utils"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import type { StyleProp, TouchableOpacityProps, ViewStyle } from "react-native"
import {
  Animated as RnAnimated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  useWindowDimensions,
  View,
} from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import type { ViewProps } from "react-native-svg/lib/typescript/fabric/utils"

import { accentColor } from "@/src/theme/colors"

import { AnimatedScrollView } from "../../common/AnimatedComponents"

type Tab = {
  name: string
  activeColor?: string
  value: string
}

export type TabComponent = FC<{ isSelected: boolean; tab: Tab } & Pick<ViewProps, "onLayout">>
interface TabViewProps {
  tabs: Tab[]
  Tab?: TabComponent
  TabItem?: FC<{ isSelected: boolean; tab: Tab } & Pick<TouchableOpacityProps, "onLayout">>
  initialTab?: number
  onTabChange?: (tab: number) => void

  // styles
  tabbarClassName?: string
  tabbarStyle?: StyleProp<ViewStyle>
  scrollerStyle?: StyleProp<ViewStyle>
  scrollerContainerStyle?: StyleProp<ViewStyle>
  scrollerContainerClassName?: string
  scrollerClassName?: string

  lazyTab?: boolean
  lazyOnce?: boolean
}

const springConfig = {
  stiffness: 100,
  damping: 10,
}

export const TabView: FC<TabViewProps> = ({
  tabs,
  Tab = View,
  TabItem = TouchableOpacity,
  initialTab,
  onTabChange,

  tabbarClassName,
  tabbarStyle,
  scrollerClassName,
  scrollerStyle,
  scrollerContainerStyle,
  scrollerContainerClassName,

  lazyOnce,
  lazyTab,
  // indicator
}) => {
  const tabRef = useRef<ScrollView>(null)

  const [tabWidths, setTabWidths] = useState<number[]>([])
  const [tabPositions, setTabPositions] = useState<number[]>([])

  const [currentTab, setCurrentTab] = useState(initialTab ?? 0)

  const pagerOffsetX = useAnimatedValue(0)
  const sharedPagerOffsetX = useSharedValue(0)
  useEffect(() => {
    const id = pagerOffsetX.addListener(({ value }) => {
      sharedPagerOffsetX.value = value
    })
    return () => {
      pagerOffsetX.removeListener(id)
    }
  }, [pagerOffsetX, sharedPagerOffsetX])

  // const indicatorX = useAnimatedValue(0)
  // const indicatorWidth = useAnimatedValue(0)

  const indicatorPosition = useSharedValue(0)
  const { width: windowWidth } = useWindowDimensions()

  useEffect(() => {
    if (tabWidths.length > 0) {
      indicatorPosition.value = withSpring(tabPositions[currentTab] || 0, springConfig)

      if (tabRef.current) {
        const x = currentTab > 0 ? tabPositions[currentTab - 1] + tabWidths[currentTab - 1] : 0

        const isCurrentTabVisible =
          sharedPagerOffsetX.value < tabPositions[currentTab] &&
          sharedPagerOffsetX.value + tabWidths[currentTab] > tabPositions[currentTab]

        if (!isCurrentTabVisible) {
          tabRef.current.scrollTo({ x, y: 0, animated: true })
        }
      }
    }
  }, [currentTab, indicatorPosition, sharedPagerOffsetX.value, tabPositions, tabWidths])

  const indicatorStyle = useAnimatedStyle(() => {
    const scrollProgress = sharedPagerOffsetX.value / windowWidth

    const currentIndex = Math.floor(scrollProgress)
    const nextIndex = Math.min(currentIndex + 1, tabs.length - 1)
    const progress = scrollProgress - currentIndex

    // Interpolate between current and next tab positions
    const xPosition =
      tabPositions[currentIndex] + (tabPositions[nextIndex] - tabPositions[currentIndex]) * progress

    // Interpolate between current and next tab widths
    const width =
      tabWidths[currentIndex] + (tabWidths[nextIndex] - tabWidths[currentIndex]) * progress

    return {
      transform: [{ translateX: xPosition }],
      width,
      backgroundColor: tabs[currentTab].activeColor || accentColor,
    }
  })
  // useEffect(() => {
  //   RnAnimated.spring(indicatorWidth, {
  //     toValue: tabWidths[currentTab],
  //     useNativeDriver: false,
  //     damping: 10,
  //     stiffness: 100,
  //   }).start()
  //   RnAnimated.spring(indicatorX, {
  //     toValue: tabPositions[currentTab],
  //     useNativeDriver: true,
  //     damping: 10,
  //     stiffness: 100,
  //   })
  // }, [currentTab, indicatorWidth, indicatorX, tabPositions, tabWidths])

  useEffect(() => {
    const listener = pagerOffsetX.addListener(({ value }) => {
      // Calculate which tab should be active based on scroll position
      const tabIndex = Math.round(value / windowWidth)
      if (tabIndex !== currentTab) {
        setCurrentTab(tabIndex)
        onTabChange?.(tabIndex)
      }
    })

    return () => pagerOffsetX.removeListener(listener)
  }, [tabWidths, tabPositions, currentTab, pagerOffsetX, windowWidth, onTabChange])

  const [lazyTabSet, setLazyTabSet] = useState(() => new Set<number>())

  const shouldRenderCurrentTab = (index: number) => {
    if (!lazyTab) return true
    if (index === currentTab) return true
    if (lazyOnce && lazyTabSet.has(index)) return true
    return lazyTabSet.has(index)
  }

  useEffect(() => {
    setLazyTabSet((prev) => {
      const newSet = new Set(prev)
      newSet.add(currentTab)
      return newSet
    })
  }, [currentTab])

  const contentScrollerRef = useRef<ScrollView>(null)

  return (
    <>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        className={cn(
          "border-tertiary-system-background relative shrink-0 grow-0",
          tabbarClassName,
        )}
        horizontal
        ref={tabRef}
        contentContainerStyle={styles.tabScroller}
        style={[styles.root, tabbarStyle]}
      >
        {tabs.map((tab, index) => (
          <TabItem
            onPress={() => {
              // setCurrentTab(index)
              contentScrollerRef.current?.scrollTo({ x: index * windowWidth, y: 0, animated: true })
              onTabChange?.(index)
            }}
            key={tab.value}
            isSelected={index === currentTab}
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
            tab={tab}
          >
            <TabItemInner tab={tab} />
          </TabItem>
        ))}
        {/* <RnAnimated.View
          style={[
            styles.indicator,
            {
              transform: [{ translateX: indicatorX }],
            },
          ]}
        >
          <RnAnimated.View
            className={"h-full"}
            style={{
              width: indicatorWidth,
              backgroundColor: accentColor,
            }}
          />
        </RnAnimated.View> */}
        <Animated.View style={[styles.indicator, indicatorStyle]} />
      </ScrollView>

      <AnimatedScrollView
        onScroll={RnAnimated.event([{ nativeEvent: { contentOffset: { x: pagerOffsetX } } }], {
          useNativeDriver: true,
        })}
        ref={contentScrollerRef}
        horizontal
        pagingEnabled
        className={cn("flex-1", scrollerClassName)}
        style={scrollerStyle}
        contentContainerStyle={scrollerContainerStyle}
        contentContainerClassName={scrollerContainerClassName}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
      >
        {tabs.map((tab, index) => (
          <View style={{ width: windowWidth }} key={tab.value}>
            {shouldRenderCurrentTab(index) && <Tab isSelected={currentTab === index} tab={tab} />}
          </View>
        ))}
      </AnimatedScrollView>
    </>
  )
}

const TabItemInner = ({ tab }: { tab: Tab }) => {
  return (
    <View className="p-2">
      <Text>{tab.name}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  tabScroller: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 4,
  },

  root: { paddingHorizontal: 6 },
  indicator: {
    position: "absolute",
    bottom: 0,
    height: 2,
    borderRadius: 1,
  },
})
