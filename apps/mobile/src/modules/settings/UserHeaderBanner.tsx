import { cn, getLuminance } from "@follow/utils"
import { LinearGradient } from "expo-linear-gradient"
import { useMemo } from "react"
import { StyleSheet, Text, View } from "react-native"
import type { SharedValue } from "react-native-reanimated"
import ReAnimated, { FadeIn, FadeOut, interpolate, useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { useImageColors, usePrefetchImageColors } from "@/src/store/image/hooks"
import { useWhoami } from "@/src/store/user/hooks"

const defaultGradientColors = ["#000", "#100", "#200"]

export const UserHeaderBanner = ({ scrollY }: { scrollY: SharedValue<number> }) => {
  const whoami = useWhoami()
  usePrefetchImageColors(whoami?.image)
  const insets = useSafeAreaInsets()

  const MAX_PULL = 100
  const SCALE_FACTOR = 1.8

  const imageColors = useImageColors(whoami?.image)
  const gradientColors = useMemo(() => {
    if (!imageColors || imageColors.platform === "web") return defaultGradientColors
    if (imageColors.platform === "android") {
      return [
        imageColors.dominant,
        imageColors.average || imageColors.vibrant,
        imageColors.vibrant || imageColors.dominant,
      ]
    }
    return [imageColors.primary, imageColors.secondary, imageColors.background]
  }, [imageColors])

  const gradientLight = useMemo(() => {
    if (!imageColors) return false
    if (imageColors.platform === "web") return false
    const dominantLuminance = getLuminance(
      imageColors.platform === "android" ? imageColors.dominant : imageColors.primary,
    )
    return dominantLuminance > 0.5
  }, [imageColors])

  const styles = useAnimatedStyle(() => {
    const scaleValue = interpolate(scrollY.value, [-MAX_PULL, 0], [SCALE_FACTOR, 1], {
      extrapolateLeft: "extend",
      extrapolateRight: "clamp",
    })

    if (!gradientColors) return {}
    return {
      transform: [{ scale: scaleValue }],
      height: 250 + (scrollY.value < 0 ? -scrollY.value : 0),
    }
  })

  // Add animated style for avatar
  const avatarStyles = useAnimatedStyle(() => {
    // Scale avatar when pulling down
    const avatarScale = interpolate(scrollY.value, [-MAX_PULL, 0], [1.3, 1], {
      extrapolateLeft: "extend",
      extrapolateRight: "clamp",
    })

    // Move avatar up when pulling down
    const avatarTranslateY = interpolate(scrollY.value, [-MAX_PULL, 0], [-20, 0], {
      extrapolateLeft: "extend",
      extrapolateRight: "clamp",
    })

    return {
      marginTop: insets.top,
      transform: [{ scale: avatarScale }, { translateY: avatarTranslateY }],
    }
  })

  if (!whoami) return null
  return (
    <View
      className="relative h-[200px] items-center justify-center"
      style={{ marginTop: -insets.top }}
    >
      <ReAnimated.View entering={FadeIn} className="absolute inset-x-0 bottom-0" style={styles}>
        <LinearGradient
          colors={defaultGradientColors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        {gradientColors && (
          <ReAnimated.View
            style={StyleSheet.absoluteFillObject}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <LinearGradient
              colors={gradientColors as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </ReAnimated.View>
        )}
      </ReAnimated.View>
      <ReAnimated.View
        className="bg-system-background overflow-hidden rounded-full"
        style={avatarStyles}
      >
        <UserAvatar image={whoami.image} name={whoami.name!} size={60} />
      </ReAnimated.View>

      <View className="mt-2">
        <Text className={cn("text-2xl font-bold", gradientLight ? "text-black" : "text-white/95")}>
          {whoami.name}
        </Text>
        {!!whoami.handle && (
          <Text className={cn(gradientLight ? "text-black/70" : "text-white/70")}>
            @{whoami.handle}
          </Text>
        )}
      </View>
    </View>
  )
}
