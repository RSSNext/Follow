import { Image } from "expo-image"
import { useEffect } from "react"
import type { StyleProp, ViewStyle } from "react-native"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Grayscale } from "react-native-color-matrix-image-filters"
import Animated, {
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"

import { ReAnimatedTouchableOpacity } from "@/src/components/common/AnimatedComponents"
import { FallbackIcon } from "@/src/components/ui/icon/fallback-icon"
import { gentleSpringPreset } from "@/src/constants/spring"
import type { ViewDefinition } from "@/src/constants/views"
import { views } from "@/src/constants/views"
import { selectTimeline, useSelectedFeed } from "@/src/modules/screen/atoms"
import { useList } from "@/src/store/list/hooks"
import { useAllListSubscription } from "@/src/store/subscription/hooks"
import { useUnreadCountByView } from "@/src/store/unread/hooks"
import { accentColor, useColor } from "@/src/theme/colors"

import { TimelineViewSelectorContextMenu } from "./TimelineViewSelectorContextMenu"

export function TimelineViewSelector() {
  const lists = useAllListSubscription()

  return (
    <View className="flex items-center justify-between py-2">
      <ScrollView
        horizontal
        scrollsToTop={false}
        contentContainerClassName="flex-row gap-3 items-center px-3"
        showsHorizontalScrollIndicator={false}
      >
        {views.map((view) => (
          <ViewItem key={view.name} view={view} />
        ))}
        {lists.length > 0 && <View className="bg-opaque-separator mx-3 h-8 w-px" />}
        {lists.map((listId) => (
          <ListItem key={listId} listId={listId} />
        ))}
      </ScrollView>
    </View>
  )
}

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
  const textWidth = useSharedValue(130)
  const width = useSharedValue(isActive ? Math.max(130, textWidth.value + 48) : 48)
  const bgColor = useColor("gray5")

  useEffect(() => {
    width.value = withSpring(
      isActive ? Math.max(130, textWidth.value + 48) : 48,
      gentleSpringPreset,
    )
  }, [isActive, width, textWidth])

  return (
    <ReAnimatedTouchableOpacity
      className="relative flex h-12 flex-row items-center justify-center gap-2 overflow-hidden rounded-[1.2rem]"
      onPress={onPress}
      style={useAnimatedStyle(() => ({
        backgroundColor: bgColor,
        width: width.value,
        ...style,
      }))}
    >
      <View
        className="flex-row items-center gap-2"
        onLayout={({ nativeEvent }) => {
          if (isActive) {
            textWidth.value = nativeEvent.layout.width
          }
        }}
      >
        {children}
      </View>
    </ReAnimatedTouchableOpacity>
  )
}

function ViewItem({ view }: { view: ViewDefinition }) {
  const textColor = useColor("gray")
  const selectedFeed = useSelectedFeed()
  const isActive = selectedFeed?.type === "view" && selectedFeed.viewId === view.view
  const unreadCount = useUnreadCountByView(view.view)
  const borderColor = useColor("gray5")

  const textWidth = useSharedValue(130)
  const width = useSharedValue(isActive ? Math.max(130, textWidth.value + 48) : 48)

  useEffect(() => {
    if (isActive) {
      width.value = withSpring(Math.max(130, textWidth.value + 48), gentleSpringPreset)
    }
  }, [isActive, unreadCount])

  return (
    <TimelineViewSelectorContextMenu type="view" viewId={view.view}>
      <ItemWrapper
        isActive={isActive}
        onPress={() => selectTimeline({ type: "view", viewId: view.view })}
        style={isActive ? { backgroundColor: view.activeColor } : undefined}
      >
        <view.icon color={isActive ? "#fff" : textColor} height={21} width={21} />
        {isActive ? (
          <>
            <Animated.Text
              key={view.name}
              exiting={FadeOut}
              className="text-sm font-semibold text-white"
              numberOfLines={1}
            >
              {view.name}
            </Animated.Text>
            {!!unreadCount && (
              <Animated.View exiting={FadeOut} className="size-1.5 rounded-full bg-white" />
            )}
          </>
        ) : (
          !!unreadCount &&
          !isActive && (
            <View
              className="absolute -right-0.5 -top-0.5 size-2 rounded-full border"
              style={{ backgroundColor: textColor, borderColor }}
            />
          )
        )}
      </ItemWrapper>
    </TimelineViewSelectorContextMenu>
  )
}

function ListItem({ listId }: { listId: string }) {
  const list = useList(listId)
  const selectedFeed = useSelectedFeed()

  if (!selectedFeed) return null
  const isActive = selectedFeed.type === "list" && selectedFeed.listId === listId

  if (!list) return null

  return (
    <ItemWrapper
      isActive={isActive}
      onPress={() => selectTimeline({ type: "list", listId })}
      style={isActive ? { backgroundColor: accentColor } : undefined}
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
        <FallbackIcon title={list.title} size={28} gray={!isActive} style={styles.fallbackIcon} />
      )}
      {isActive && (
        <Text className="max-w-24 text-sm font-semibold text-white" numberOfLines={1}>
          {list.title}
        </Text>
      )}
    </ItemWrapper>
  )
}

const styles = StyleSheet.create({
  fallbackIcon: {
    borderRadius: 8,
  },
})
