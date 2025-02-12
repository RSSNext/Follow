import { Image } from "expo-image"
import { useEffect } from "react"
import type { StyleProp, ViewStyle } from "react-native"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Grayscale } from "react-native-color-matrix-image-filters"
import Animated, { useSharedValue, withSpring } from "react-native-reanimated"

import { FallbackIcon } from "@/src/components/ui/icon/fallback-icon"
import type { ViewDefinition } from "@/src/constants/views"
import { views } from "@/src/constants/views"
import { useList } from "@/src/store/list/hooks"
import { useAllListSubscription } from "@/src/store/subscription/hooks"
import { useColor } from "@/src/theme/colors"

import { selectTimeline, useSelectedFeed } from "../feed-drawer/atoms"

export function ViewSelector() {
  const lists = useAllListSubscription()

  return (
    <View className="flex items-center justify-between py-2">
      <ScrollView
        horizontal
        contentContainerClassName="flex-row gap-3 items-center px-3"
        showsHorizontalScrollIndicator={false}
      >
        {views.map((view) => (
          <ViewItem key={view.name} view={view} />
        ))}
        {lists.map((listId) => (
          <ListItem key={listId} listId={listId} />
        ))}
      </ScrollView>
    </View>
  )
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

function ItemWrapper({
  children,
  isActive,
  onPress,
  style,
}: {
  children: React.ReactNode
  isActive: boolean
  onPress: () => void
  style?: Exclude<StyleProp<ViewStyle>, number>
}) {
  const width = useSharedValue(isActive ? 130 : 48)
  const bgColor = useColor("gray5")

  useEffect(() => {
    width.value = withSpring(isActive ? 130 : 48)
  }, [isActive, width])

  return (
    <AnimatedTouchableOpacity
      className="relative flex h-12 flex-row items-center justify-center gap-2 overflow-hidden rounded-[1.2rem]"
      onPress={onPress}
      style={{
        backgroundColor: bgColor,
        width,
        ...style,
      }}
    >
      {children}
    </AnimatedTouchableOpacity>
  )
}

function ViewItem({ view }: { view: ViewDefinition }) {
  const textColor = useColor("gray")

  const selectedFeed = useSelectedFeed()
  const isActive = selectedFeed?.type === "view" && selectedFeed.viewId === view.view

  return (
    <ItemWrapper
      isActive={isActive}
      onPress={() => selectTimeline({ type: "view", viewId: view.view })}
      style={isActive ? { backgroundColor: view.activeColor } : undefined}
    >
      <view.icon color={isActive ? "#fff" : textColor} height={21} width={21} />
      {isActive && (
        <Text className="text-sm font-semibold text-white" numberOfLines={1}>
          {view.name}
        </Text>
      )}
    </ItemWrapper>
  )
}

function ListItem({ listId }: { listId: string }) {
  const list = useList(listId)
  const selectedFeed = useSelectedFeed()
  const bgColor = useColor("orange")
  if (!selectedFeed) return null
  const isActive = selectedFeed.type === "list" && selectedFeed.listId === listId

  if (!list) return null

  return (
    <ItemWrapper
      isActive={isActive}
      onPress={() => selectTimeline({ type: "list", listId })}
      style={isActive ? { backgroundColor: bgColor } : undefined}
    >
      {list.image ? (
        isActive ? (
          <Image source={list.image} contentFit="cover" className="size-7 rounded-lg" />
        ) : (
          <Grayscale>
            <Image source={list.image} contentFit="cover" className="size-7 rounded-lg" />
          </Grayscale>
        )
      ) : (
        <FallbackIcon
          title={list.title}
          size={28}
          gray={!isActive}
          style={{
            borderRadius: 8,
          }}
        />
      )}
      {isActive && (
        <Text className="max-w-24 text-sm font-semibold text-white" numberOfLines={1}>
          {list.title}
        </Text>
      )}
    </ItemWrapper>
  )
}
