import { cn } from "@follow/utils"
import { FlashList } from "@shopify/flash-list"
import type { FC } from "react"
import { useRef, useState } from "react"
import type { StyleProp, TouchableOpacityProps, ViewStyle } from "react-native"
import {
  Animated as RnAnimated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  useWindowDimensions,
  View,
} from "react-native"
import { useSharedValue } from "react-native-reanimated"
import type { ViewProps } from "react-native-svg/lib/typescript/fabric/utils"

import { AnimatedScrollView } from "../../common/AnimatedComponents"

type Tab = {
  name: string
  activeColor?: string
  value: string
}
const AnimatedFlashList = RnAnimated.createAnimatedComponent(FlashList)
const AnimatedFlatList = RnAnimated.createAnimatedComponent(FlatList)
interface TabViewProps {
  tabs: Tab[]
  Tab?: FC<{ isSelected: boolean; tab: Tab } & Pick<ViewProps, "onLayout">>
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
}) => {
  const tabRef = useRef<ScrollView>(null)

  const indicatorPosition = useSharedValue(0)

  const [tabWidths, setTabWidths] = useState<number[]>([])
  const [tabPositions, setTabPositions] = useState<number[]>([])

  const [currentTab, setCurrentTab] = useState(initialTab ?? 0)

  const pagerOffsetX = useAnimatedValue(0)

  // const indicatorStyle = useAnimatedStyle(() => {
  //   const pagerScrollOffset = pagerOffsetX
  //   return {
  //     transform: [
  //       {
  //         translateX: indicatorPosition.value + 10 + Math.abs(pagerScrollOffset),
  //       },
  //     ],
  //     backgroundColor: tabs[currentTab].activeColor || accentColor,
  //     width: (tabWidths[currentTab] || 20) - 40 + Math.abs(pagerScrollOffset),
  //   }
  // })

  const { width: windowWidth } = useWindowDimensions()

  return (
    <>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        className={cn("border-tertiary-system-background shrink-0 grow-0", tabbarClassName)}
        horizontal
        ref={tabRef}
        contentContainerStyle={styles.tabScroller}
        style={[styles.root, tabbarStyle]}
      >
        {tabs.map((tab, index) => (
          <TabItem
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
        {/* <Animated.View style={[styles.indicator, indicatorStyle]} /> */}
        <View style={styles.indicator} className="bg-accent" />
      </ScrollView>

      <AnimatedScrollView
        onScroll={RnAnimated.event([{ nativeEvent: { contentOffset: { x: pagerOffsetX } } }], {
          useNativeDriver: true,
        })}
        horizontal
        pagingEnabled
        className={cn("bg-red flex-1", scrollerClassName)}
        style={scrollerStyle}
        contentContainerStyle={scrollerContainerStyle}
        contentContainerClassName={scrollerContainerClassName}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
      >
        {tabs.map((tab) => (
          <AnimatedFlatList
            style={{ width: windowWidth }}
            nestedScrollEnabled
            data={Array.from({ length: 100 }).fill(0)}
            renderItem={() => (
              <View className="bg-red flex-1">
                <Text>{tab.name}</Text>
              </View>
            )}
            key={tab.value}
          />
        ))}
      </AnimatedScrollView>
    </>
  )
}

const TabItemInner = ({ tab }: { tab: Tab }) => {
  return (
    <View>
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
