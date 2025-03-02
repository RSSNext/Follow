import { RSSHubCategories } from "@follow/constants"
import { getDefaultHeaderHeight } from "@react-navigation/elements"
import { router } from "expo-router"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import type { FC } from "react"
import { useContext, useEffect, useRef, useState } from "react"
import type { Animated as RnAnimated, LayoutChangeEvent } from "react-native"
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"

import { BlurEffect } from "@/src/components/common/BlurEffect"
import { TabBar } from "@/src/components/ui/tabview/TabBar"
import { Search2CuteReIcon } from "@/src/icons/search_2_cute_re"
import { accentColor, useColor } from "@/src/theme/colors"

import { AddFeedButton } from "../screen/action"
import { RSSHubCategoryCopyMap } from "./copy"
import { useSearchPageContext } from "./ctx"
import { DiscoverContext } from "./DiscoverContext"
import { SearchTabBar } from "./SearchTabBar"

export const SearchHeader: FC<{
  animatedX: RnAnimated.Value
  onLayout: (e: LayoutChangeEvent) => void
}> = ({ animatedX, onLayout }) => {
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top)

  return (
    <View
      style={{ minHeight: headerHeight, paddingTop: insets.top }}
      className="relative"
      onLayout={onLayout}
    >
      <BlurEffect />

      <View style={styles.header}>
        <ComposeSearchBar />
      </View>
      <SearchTabBar animatedX={animatedX} />
    </View>
  )
}

const DynamicBlurEffect = () => {
  const { animatedY } = useContext(DiscoverContext)
  const blurStyle = useAnimatedStyle(() => ({
    opacity: Math.max(0, Math.min(1, animatedY.value / 50)),
  }))
  return (
    <Animated.View className="absolute inset-0 flex-1" style={blurStyle} pointerEvents={"none"}>
      <BlurEffect />
    </Animated.View>
  )
}
export const DiscoverHeader = () => {
  return <DiscoverHeaderImpl />
}
const DiscoverHeaderImpl = () => {
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top)
  const { animatedX, currentTabAtom, headerHeightAtom } = useContext(DiscoverContext)
  const setCurrentTab = useSetAtom(currentTabAtom)
  const setHeaderHeight = useSetAtom(headerHeightAtom)

  return (
    <View
      style={{ minHeight: headerHeight, paddingTop: insets.top }}
      className="relative"
      onLayout={(e) => {
        setHeaderHeight(e.nativeEvent.layout.height)
      }}
    >
      <DynamicBlurEffect />

      <View style={[styles.header, styles.discoverHeader]}>
        <PlaceholerSearchBar />

        {/* Right actions group */}
        <View className="ml-2">
          <AddFeedButton />
        </View>
      </View>

      <TabBar
        tabs={RSSHubCategories.map((category) => ({
          name: RSSHubCategoryCopyMap[category],
          value: category,
        }))}
        tabScrollContainerAnimatedX={animatedX}
        onTabItemPress={(index) => {
          setCurrentTab(index)
        }}
        tabbarClassName="border-b border-b-quaternary-system-fill"
      />
    </View>
  )
}

const PlaceholerSearchBar = () => {
  const labelColor = useColor("secondaryLabel")
  return (
    <Pressable
      style={styles.searchbar}
      className="bg-tertiary-system-fill"
      onPress={() => {
        router.push("/search")
      }}
    >
      <View
        className="absolute inset-0 flex flex-row items-center justify-center"
        pointerEvents="none"
      >
        <Search2CuteReIcon color={labelColor} height={18} width={18} />
        <Text className="text-secondary-label ml-1" style={styles.searchPlaceholderText}>
          Search
        </Text>
      </View>
    </Pressable>
  )
}

const ComposeSearchBar = () => {
  const { searchFocusedAtom, searchValueAtom } = useSearchPageContext()
  const setIsFocused = useSetAtom(searchFocusedAtom)
  const setSearchValue = useSetAtom(searchValueAtom)
  return (
    <>
      <SearchInput />

      <TouchableOpacity
        hitSlop={10}
        onPress={() => {
          setIsFocused(false)
          setSearchValue("")

          if (router.canGoBack()) {
            router.back()
          }
        }}
      >
        <Text className="text-accent ml-3 text-lg font-medium">Cancel</Text>
      </TouchableOpacity>
    </>
  )
}

const SearchInput = () => {
  const { searchFocusedAtom, searchValueAtom } = useSearchPageContext()
  const [isFocused, setIsFocused] = useAtom(searchFocusedAtom)
  const placeholderTextColor = useColor("secondaryLabel")
  const searchValue = useAtomValue(searchValueAtom)
  const setSearchValue = useSetAtom(searchValueAtom)
  const inputRef = useRef<TextInput>(null)

  const skeletonOpacity = useSharedValue(0)
  const skeletonTranslateX = useSharedValue(0)
  const placeholderOpacity = useSharedValue(1)

  const [tempSearchValue, setTempSearchValue] = useState(searchValue)

  const focusOrHasValue = isFocused || searchValue || tempSearchValue

  useEffect(() => {
    if (focusOrHasValue) {
      skeletonOpacity.value = withTiming(0, { duration: 100, easing: Easing.ease })
      skeletonTranslateX.value = withTiming(-150, {
        duration: 100,
        easing: Easing.inOut(Easing.ease),
      })
      placeholderOpacity.value = withTiming(1, { duration: 200, easing: Easing.ease })
    } else {
      skeletonOpacity.value = withTiming(1, { duration: 100, easing: Easing.ease })
      skeletonTranslateX.value = withTiming(0, {
        duration: 100,
        easing: Easing.inOut(Easing.ease),
      })
      placeholderOpacity.value = withTiming(0, { duration: 200, easing: Easing.ease })
    }
  }, [focusOrHasValue, placeholderOpacity, skeletonOpacity, skeletonTranslateX])

  const skeletonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: skeletonOpacity.value,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: skeletonTranslateX.value }],
  }))

  const placeholderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: placeholderOpacity.value,

    position: "absolute",
    top: 0,
    bottom: 0,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  }))

  useEffect(() => {
    if (!isFocused) {
      inputRef.current?.blur()
    } else {
      inputRef.current?.focus()
    }
  }, [isFocused])

  return (
    <View style={styles.searchbar} className="bg-tertiary-system-fill">
      {focusOrHasValue && (
        <Animated.View style={placeholderAnimatedStyle}>
          <Search2CuteReIcon color={placeholderTextColor} height={18} width={18} />
          {!searchValue && !tempSearchValue && (
            <Text className="text-secondary-label ml-2" style={styles.searchPlaceholderText}>
              Search
            </Text>
          )}
        </Animated.View>
      )}
      <TextInput
        enterKeyHint="search"
        autoFocus={isFocused}
        ref={inputRef}
        onSubmitEditing={() => {
          setSearchValue(tempSearchValue)
          setTempSearchValue("")
        }}
        defaultValue={searchValue}
        cursorColor={accentColor}
        selectionColor={accentColor}
        style={styles.searchInput}
        className="text-text"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={(text) => {
          setTempSearchValue(text)
        }}
      />

      <Animated.View style={skeletonAnimatedStyle} pointerEvents="none">
        <Search2CuteReIcon color={placeholderTextColor} height={18} width={18} />
        <Text className="text-secondary-label ml-1" style={styles.searchPlaceholderText}>
          Search
        </Text>
      </Animated.View>
    </View>
  )
}
const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 14,
    marginHorizontal: 16,
    position: "relative",
  },

  discoverHeader: {
    marginRight: 0,
  },

  searchbar: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    height: 40,
    position: "relative",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingRight: 16,
    paddingLeft: 35,
    height: "100%",
  },
  searchPlaceholderText: {
    fontSize: 16,
  },
})
