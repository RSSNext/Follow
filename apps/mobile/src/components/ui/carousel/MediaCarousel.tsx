import { useEffect, useState } from "react"
import { ScrollView, View } from "react-native"
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"

import type { MediaModel } from "@/src/database/schemas/types"
import { EntryGridFooter } from "@/src/modules/entry-content/EntryGridFooter"

import { ImageContextMenu } from "../image/ImageContextMenu"
import type { PreviewImageProps } from "../image/PreviewImage"
import { PreviewImage } from "../image/PreviewImage"

export const MediaCarousel = ({
  entryId,
  media,
  onPreview,
  aspectRatio,
  Accessory,
  AccessoryProps,
  noPreview,
}: {
  entryId: string
  media: MediaModel[]
  onPreview?: () => void
  aspectRatio: number
  noPreview?: boolean
} & Pick<PreviewImageProps, "Accessory" | "AccessoryProps">) => {
  const [containerWidth, setContainerWidth] = useState(0)
  const containerHeight = Math.floor(containerWidth / aspectRatio)
  const hasMany = media.length > 1

  // const activeIndex = useSharedValue(0)
  const [activeIndex, setActiveIndex] = useState(0)

  const Wrapper = noPreview ? View : ImageContextMenu

  return (
    <View
      onLayout={(e) => {
        setContainerWidth(e.nativeEvent.layout.width)
      }}
    >
      <View className="relative overflow-hidden rounded-md">
        <ScrollView
          onScroll={(e) => {
            setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / containerWidth))
          }}
          scrollEventThrottle={16}
          scrollEnabled={hasMany}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          className="flex-1"
          // We need to fixed the height of the container to prevent the carousel from resizing
          // See https://github.com/Shopify/flash-list/issues/797
          style={{ height: containerHeight }}
        >
          {media.map((m, index) => {
            if (m.type === "photo") {
              return (
                <View key={index} className="relative" style={{ width: containerWidth }}>
                  <Wrapper entryId={entryId} imageUrl={m.url}>
                    <PreviewImage
                      noPreview={noPreview}
                      onPreview={onPreview}
                      imageUrl={m.url}
                      aspectRatio={aspectRatio}
                      Accessory={Accessory}
                      AccessoryProps={AccessoryProps}
                      proxy={{
                        width: containerWidth,
                      }}
                    />
                  </Wrapper>
                </View>
              )
            }

            return (
              <PreviewImage
                key={index}
                noPreview={noPreview}
                onPreview={() => {
                  // open player
                }}
                imageUrl={m.url}
                aspectRatio={aspectRatio}
              />
            )
          })}
        </ScrollView>

        {/* Indicators */}
        {hasMany && (
          <View className="absolute inset-x-0 bottom-0 flex-row items-center justify-center gap-1">
            {media.map((_, index) => (
              <Indicator key={index} index={index} activeIndex={activeIndex} />
            ))}
          </View>
        )}
      </View>
      <EntryGridFooter entryId={entryId} />
    </View>
  )
}

const Indicator = ({ index, activeIndex }: { index: number; activeIndex: number }) => {
  const activeValue = useSharedValue(0)
  useEffect(() => {
    activeValue.value = withSpring(index === activeIndex ? 1 : 0)
  }, [activeIndex, activeValue, index])
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      activeValue.value,
      [0, 1],
      ["rgba(0, 0, 0, 0.5)", "rgba(255, 255, 255, 0.9)"],
    ),
  }))
  return <Animated.View className="h-1 flex-1 rounded-sm" style={animatedStyle} />
}
