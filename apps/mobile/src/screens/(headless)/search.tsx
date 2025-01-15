import { Stack } from "expo-router"
import { useAtomValue } from "jotai"
import * as React from "react"
import { useEffect, useRef, useState } from "react"
import type { ScrollView } from "react-native"
import { Animated, Dimensions, View } from "react-native"

import { AnimatedScrollView } from "@/src/components/common/AnimatedComponents"
import { SearchTabs, SearchType } from "@/src/modules/discover/constants"
import {
  SearchBarHeightProvider,
  SearchPageContext,
  SearchPageProvider,
  SearchPageScrollContainerAnimatedXProvider,
  useSearchPageContext,
  useSearchPageScrollContainerAnimatedX,
  useSetSearchBarHeight,
} from "@/src/modules/discover/ctx"
import { SearchHeader } from "@/src/modules/discover/search"
import { SearchFeed } from "@/src/modules/discover/search-tabs/SearchFeed"
import { SearchList } from "@/src/modules/discover/search-tabs/SearchList"

const Search = () => {
  return (
    <View className="flex-1">
      <SearchPageScrollContainerAnimatedXProvider>
        <SearchPageProvider>
          <SearchBarHeightProvider>
            <SearchbarMount />
            <Content />
          </SearchBarHeightProvider>
        </SearchPageProvider>
      </SearchPageScrollContainerAnimatedXProvider>
    </View>
  )
}

const SearchType2RenderContent: Record<SearchType, React.FC> = {
  [SearchType.Feed]: SearchFeed,
  [SearchType.List]: SearchList,
  // [SearchType.User]: SearchUser,
}
const PlaceholderLazyView = () => {
  const windowWidth = Dimensions.get("window").width
  return <View className="flex-1" style={{ width: windowWidth }} />
}
const Content = () => {
  const scrollContainerAnimatedX = useSearchPageScrollContainerAnimatedX()
  const { searchTypeAtom } = useSearchPageContext()
  const searchType = useAtomValue(searchTypeAtom)

  const scrollRef = useRef<ScrollView>(null)
  useEffect(() => {
    if (scrollRef.current) {
      const pageIndex = SearchTabs.findIndex((tab) => tab.value === searchType)
      scrollRef.current.scrollTo({
        x: pageIndex * Dimensions.get("window").width,
        y: 0,
        animated: true,
      })
    }
  }, [searchType])

  const [loadedContentSet, setLoadedContentSet] = useState(() => new Set())

  useEffect(() => {
    setLoadedContentSet((prev) => {
      const newSet = new Set(prev)
      newSet.add(searchType)
      return newSet
    })
  }, [searchType])

  return (
    <AnimatedScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      nestedScrollEnabled
      scrollEnabled
      showsHorizontalScrollIndicator={false}
      className={"flex-1"}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollContainerAnimatedX } } }],
        {
          useNativeDriver: true,
        },
      )}
    >
      {SearchTabs.map(({ value }) =>
        loadedContentSet.has(value) ? (
          React.createElement(SearchType2RenderContent[value], { key: value })
        ) : (
          <PlaceholderLazyView key={value} />
        ),
      )}
    </AnimatedScrollView>
  )
}

const SearchbarMount = () => {
  const ctx = useSearchPageContext()
  const scrollContainerAnimatedX = useSearchPageScrollContainerAnimatedX()
  const setSearchBarHeight = useSetSearchBarHeight()

  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTransparent: true,

        header: () => {
          return (
            <SearchPageContext.Provider value={ctx}>
              <SearchHeader
                animatedX={scrollContainerAnimatedX}
                onLayout={(e) => setSearchBarHeight(e.nativeEvent.layout.height)}
              />
            </SearchPageContext.Provider>
          )
        },
      }}
    />
  )
}

export default Search
