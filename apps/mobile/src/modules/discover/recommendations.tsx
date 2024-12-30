import { RSSHubCategories } from "@follow/constants"
import { isASCII } from "@follow/utils"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { FlashList } from "@shopify/flash-list"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useMemo, useRef, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler"
import { PanGestureHandler } from "react-native-gesture-handler"

import type { TabComponent } from "@/src/components/ui/tabview"
import { TabView } from "@/src/components/ui/tabview"
import { apiClient } from "@/src/lib/api-fetch"

export const Recommendations = () => {
  const headerHeight = useHeaderHeight()
  const tabHeight = useBottomTabBarHeight()

  return (
    <TabView
      lazyOnce
      lazyTab
      Tab={Tab}
      tabbarStyle={{ paddingTop: headerHeight }}
      scrollerContainerStyle={{ paddingBottom: tabHeight }}
      tabs={RSSHubCategories.map((category) => ({ name: category, value: category }))}
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

const Tab: TabComponent = ({ tab }) => {
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
    return keys.reduce(
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
  }, [keys])

  // Add ref for FlashList
  const listRef = useRef<FlashList<string>>(null)
  // Add state for tracking current letter
  const [activeLetter, setActiveLetter] = useState<string>("")

  const scrollToLetter = useCallback(
    (letter: string, animated = true) => {
      const index = keys.findIndex((key) => {
        const firstChar = key[0].toUpperCase()
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
        listRef.current?.scrollToIndex({ index, animated })
      }
    },
    [keys],
  )

  // Replace PanResponder with gesture handler
  const handleGesture = useCallback(
    (event: PanGestureHandlerGestureEvent) => {
      const { y } = event.nativeEvent
      const letterHeight = 20 // Approximate height of each letter
      const letters = Object.keys(alphabetGroups).sort((a, b) => a.localeCompare(b))
      const index = Math.floor(y / letterHeight)
      const letter = letters[Math.min(Math.max(0, index), letters.length - 1)]

      if (letter && letter !== activeLetter) {
        setActiveLetter(letter)
        scrollToLetter(letter, false)
      }
    },
    [alphabetGroups, activeLetter, scrollToLetter],
  )

  if (isLoading) {
    return null
  }

  return (
    <View className="bg-system-background flex-1">
      <FlashList
        ref={listRef}
        data={keys}
        estimatedItemSize={100}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text key={item}>{item}</Text>}
      />

      {/* Right Sidebar */}
      <View className="absolute inset-y-0 right-1 h-full items-center justify-center">
        <PanGestureHandler onGestureEvent={handleGesture}>
          <View className="gap-0.5">
            {Object.keys(alphabetGroups)
              .sort((a, b) => a.localeCompare(b))
              .map((letter) => (
                <TouchableOpacity
                  hitSlop={5}
                  key={letter}
                  onPress={() => {
                    setActiveLetter(letter)
                    scrollToLetter(letter)
                  }}
                >
                  <Text
                    className={`text-sm ${activeLetter !== letter ? "text-secondary-text/60" : "text-accent"}`}
                  >
                    {letter}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </PanGestureHandler>
      </View>
    </View>
  )
}
