import { cn, getLuminance } from "@follow/utils"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import ImageColors from "react-native-image-colors"
import type { SharedValue } from "react-native-reanimated"
import ReAnimated, { FadeIn, FadeOut, interpolate, useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { useWhoami } from "@/src/store/user/hooks"
import { accentColor } from "@/src/theme/colors"

const defaultGradientColors = ["#000", "#100", "#200"]

export const UserHeaderBanner = ({ scrollY }: { scrollY: SharedValue<number> }) => {
  const whoami = useWhoami()
  const insets = useSafeAreaInsets()

  const MAX_PULL = 100
  const SCALE_FACTOR = 1.8

  const [gradientColors, setGradientColors] = useState<string[]>()
  const [gradientLight, setGradientLight] = useState<boolean>(false)

  useEffect(() => {
    const extractColors = async () => {
      if (!whoami?.image) return

      try {
        const result = await ImageColors.getColors(whoami.image, {
          fallback: accentColor,
          cache: true,
        })

        if (result.platform === "web") return
        if (result.platform === "android") {
          setGradientColors([
            result.dominant,
            result.average || result.vibrant,
            result.vibrant || result.dominant,
          ])

          const dominantLuminance = getLuminance(result.dominant)
          const isLight = dominantLuminance > 0.5
          setGradientLight(isLight)
        } else {
          const dominantLuminance = getLuminance(result.primary)
          const isLight = dominantLuminance > 0.5

          setGradientLight(isLight)
          setGradientColors([result.primary, result.secondary, result.background])
        }
      } catch (error) {
        console.warn("Failed to extract colors:", error)
      }
    }

    extractColors()
  }, [whoami?.image])
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
