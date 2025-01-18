import { RSSHubCategories } from "@follow/constants"
import type { RSSHubRouteDeclaration } from "@follow/models/src/rsshub"
import { isASCII } from "@follow/utils"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { FlashList } from "@shopify/flash-list"
import { useQuery } from "@tanstack/react-query"
import type { FC } from "react"
import { memo, useCallback, useMemo, useRef } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler"
import { PanGestureHandler } from "react-native-gesture-handler"

import type { TabComponent } from "@/src/components/ui/tabview/TabView"
import { TabView } from "@/src/components/ui/tabview/TabView"
import { apiClient } from "@/src/lib/api-fetch"

import { RSSHubCategoryCopyMap } from "./copy"
import { RecommendationListItem } from "./RecommendationListItem"

export const Recommendations = () => {
  const headerHeight = useHeaderHeight()

  return (
    <TabView
      lazyOnce
      lazyTab
      Tab={Tab}
      tabbarStyle={{ paddingTop: headerHeight }}
      tabs={RSSHubCategories.map((category) => ({
        name: RSSHubCategoryCopyMap[category],
        value: category,
      }))}
    />
  )
}

const _languageOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "English",
    value: "en",
  },
  {
    label: "中文",
    value: "zh-CN",
  },
] as const

type Language = (typeof _languageOptions)[number]["value"]
type DiscoverCategories = (typeof RSSHubCategories)[number] | string

const fetchRsshubPopular = (category: DiscoverCategories, lang: Language) => {
  return apiClient.discover.rsshub.$get({
    query: {
      category: "popular",
      categories: category === "all" ? "popular" : `popular,${category}`,
      lang: lang === "all" ? undefined : lang,
    },
  })
}

const Tab: TabComponent = ({ tab, ...rest }) => {
  const tabHeight = useBottomTabBarHeight()

  const { data, isLoading } = useQuery({
    queryKey: ["rsshub-popular", tab.value],
    queryFn: () => fetchRsshubPopular(tab.value, "all").then((res) => res.data),
  })
  const keys = useMemo(() => {
    if (!data) {
      return []
    }
    return Object.keys(data).sort((a, b) => {
      const aname = data[a].name
      const bname = data[b].name

      const aRouteName = data[a].routes[Object.keys(data[a].routes)[0]].name
      const bRouteName = data[b].routes[Object.keys(data[b].routes)[0]].name

      const ia = isASCII(aname) && isASCII(aRouteName)
      const ib = isASCII(bname) && isASCII(bRouteName)

      if (ia && ib) {
        return aname.toLowerCase() < bname.toLowerCase() ? -1 : 1
      } else if (ia || ib) {
        return ia > ib ? -1 : 1
      } else {
        return 0
      }
    })
  }, [data])

  const alphabetGroups = useMemo(() => {
    const groups = keys.reduce(
      (acc, key) => {
        // A-Z -> A-Z, 0-9 -> #, other -> #, # push to the end
        const firstChar = key[0].toUpperCase()
        if (/[A-Z]/.test(firstChar)) {
          acc[firstChar] = acc[firstChar] || []
          acc[firstChar].push(key)
        } else {
          acc["#"] = acc["#"] || []
          acc["#"].push(key)
        }

        return acc
      },
      {} as Record<string, string[]>,
    )

    const sortedGroups = Object.entries(groups).sort((a, b) => {
      const aLetter = a[0]
      const bLetter = b[0]

      return aLetter.localeCompare(bLetter)
    })

    const result = [] as ({ key: string; data: RSSHubRouteDeclaration } | string)[]
    for (const [letter, items] of sortedGroups) {
      result.push(letter)

      for (const item of items) {
        if (!data) {
          continue
        }
        result.push({ key: item, data: data[item] })
      }
    }

    return result
  }, [data, keys])

  // Add ref for FlashList
  const listRef = useRef<FlashList<{ key: string; data: RSSHubRouteDeclaration } | string>>(null)

  const getItemType = useCallback((item: string | { key: string }) => {
    return typeof item === "string" ? "sectionHeader" : "row"
  }, [])

  const keyExtractor = useCallback((item: string | { key: string }) => {
    return typeof item === "string" ? item : item.key
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <View className="bg-system-background flex-1" {...rest}>
      <FlashList
        estimatedItemSize={150}
        ref={listRef}
        data={alphabetGroups}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        renderItem={ItemRenderer}
        scrollIndicatorInsets={{ right: -2 }}
        contentContainerStyle={{ paddingBottom: tabHeight }}
        removeClippedSubviews
      />
      {/* Right Sidebar */}
      <NavigationSidebar alphabetGroups={alphabetGroups} listRef={listRef} />
    </View>
  )
}

const ItemRenderer = ({
  item,
}: {
  item: string | { key: string; data: RSSHubRouteDeclaration }
}) => {
  if (typeof item === "string") {
    // Rendering header
    return (
      <View className="border-b-opaque-separator border-b-hairline mx-6 mb-1 mt-2 pb-1">
        <Text className="text-secondary-label text-base">{item}</Text>
      </View>
    )
  } else {
    // Render item
    return (
      <View className="mr-4">
        <RecommendationListItem data={item.data} routePrefix={item.key} />
      </View>
    )
  }
}

const NavigationSidebar: FC<{
  alphabetGroups: (string | { key: string; data: RSSHubRouteDeclaration })[]
  listRef: React.RefObject<FlashList<string | { key: string; data: RSSHubRouteDeclaration }>>
}> = memo(({ alphabetGroups, listRef }) => {
  const scrollToLetter = useCallback(
    (letter: string, animated = true) => {
      const index = alphabetGroups.findIndex((group) => {
        if (typeof group !== "string") return false
        const firstChar = group[0].toUpperCase()
        const firstCharIsAlphabet = /[A-Z]/.test(firstChar)
        if (firstCharIsAlphabet) {
          return firstChar === letter
        }

        if (letter === "#" && !firstCharIsAlphabet) {
          return true
        }

        return false
      })

      if (index !== -1) {
        listRef.current?.scrollToIndex({
          animated,
          index,
        })
      }
    },
    [alphabetGroups, listRef],
  )
  const titles = useMemo(() => {
    return alphabetGroups.filter((item) => typeof item === "string")
  }, [alphabetGroups])
  // Replace PanResponder with gesture handler
  const handleGesture = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      const { y } = event.nativeEvent
      const letterHeight = 20 // Approximate height of each letter
      const letter = titles[Math.floor(y / letterHeight)]
      if (!letter) {
        return
      }

      const firstChar = letter[0].toUpperCase()
      const firstCharIsAlphabet = /[A-Z]/.test(firstChar)
      if (firstCharIsAlphabet) {
        scrollToLetter(letter, false)
      } else {
        scrollToLetter("#", false)
      }
    },
    [scrollToLetter, titles],
  )

  return (
    <View className="absolute inset-y-0 right-1 h-full items-center justify-center">
      <PanGestureHandler onGestureEvent={handleGesture}>
        <View className="gap-0.5">
          {titles.map((title) => (
            <TouchableOpacity
              hitSlop={5}
              key={title}
              onPress={() => {
                scrollToLetter(title)
              }}
            >
              <Text className="text-tertiary-label text-sm">{title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </PanGestureHandler>
    </View>
  )
})
