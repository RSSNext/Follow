import { getDefaultHeaderHeight } from "@react-navigation/elements"
import { useTheme } from "@react-navigation/native"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from "react-native"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"

import { HeaderBlur } from "@/src/components/common/HeaderBlur"
import { Search2CuteReIcon } from "@/src/icons/search_2_cute_re"
import { accentColor, useColor } from "@/src/theme/colors"

import { useDiscoverPageContext } from "./ctx"

export const SearchableHeader = () => {
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top)

  return (
    <View style={{ height: headerHeight, paddingTop: insets.top }} className="relative">
      <HeaderBlur />
      <View style={styles.header}>
        <ComposeSearchBar />
      </View>
    </View>
  )
}

const ComposeSearchBar = () => {
  const { searchFocusedAtom, searchValueAtom } = useDiscoverPageContext()
  const [isFocused, setIsFocused] = useAtom(searchFocusedAtom)
  const setSearchValue = useSetAtom(searchValueAtom)
  return (
    <>
      <SearchInput />
      {isFocused && (
        <TouchableOpacity
          hitSlop={10}
          onPress={() => {
            setIsFocused(false)
            setSearchValue("")
          }}
        >
          <Text className="ml-2 text-accent">Cancel</Text>
        </TouchableOpacity>
      )}
    </>
  )
}

const SearchInput = () => {
  const { colors } = useTheme()
  const { searchFocusedAtom, searchValueAtom } = useDiscoverPageContext()
  const [isFocused, setIsFocused] = useAtom(searchFocusedAtom)
  const placeholderTextColor = useColor("placeholderText")
  const searchValue = useAtomValue(searchValueAtom)
  const setSearchValue = useSetAtom(searchValueAtom)
  const inputRef = useRef<TextInput>(null)

  const skeletonOpacityValue = useAnimatedValue(0)
  const skeletonTranslateXValue = useAnimatedValue(0)
  const placeholderOpacityValue = useAnimatedValue(1)

  useEffect(() => {
    if (isFocused) {
      Animated.timing(skeletonOpacityValue, {
        toValue: 0,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()
      Animated.timing(skeletonTranslateXValue, {
        toValue: -150,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start()

      Animated.timing(placeholderOpacityValue, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(skeletonOpacityValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()

      Animated.timing(skeletonTranslateXValue, {
        toValue: 0,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start()

      Animated.timing(placeholderOpacityValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()
    }
  }, [isFocused, skeletonOpacityValue, placeholderOpacityValue, skeletonTranslateXValue])

  useEffect(() => {
    if (!isFocused) {
      inputRef.current?.blur()
    }
  }, [isFocused])
  return (
    <View style={{ backgroundColor: colors.card, ...styles.searchbar }}>
      {isFocused && (
        <Animated.View
          style={{
            opacity: placeholderOpacityValue,
          }}
          className="absolute inset-y-0 left-3 flex flex-row items-center justify-center"
        >
          <Search2CuteReIcon color={placeholderTextColor} height={18} width={18} />
          {!searchValue && (
            <Text className="text-placeholder-text ml-2" style={styles.searchPlaceholderText}>
              Search
            </Text>
          )}
        </Animated.View>
      )}
      <TextInput
        ref={inputRef}
        value={searchValue}
        cursorColor={accentColor}
        selectionColor={accentColor}
        style={styles.searchInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChangeText={(text) => setSearchValue(text)}
      />

      <Animated.View
        style={{
          opacity: skeletonOpacityValue,
          transform: [{ translateX: skeletonTranslateXValue }],
        }}
        className="absolute inset-0 flex flex-row items-center justify-center"
        pointerEvents="none"
      >
        <Search2CuteReIcon color={placeholderTextColor} height={18} width={18} />
        <Text className="text-placeholder-text ml-1" style={styles.searchPlaceholderText}>
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
    marginTop: -3,
    flexDirection: "row",
    marginBottom: 6,
    marginHorizontal: 16,
    position: "relative",
  },
  searchbar: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 50,
    height: "100%",
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
