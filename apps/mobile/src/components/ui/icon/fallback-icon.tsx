import { getBackgroundGradient, isCJKChar } from "@follow/utils"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { useMemo, useState } from "react"
import type { StyleProp, ViewStyle } from "react-native"
import { StyleSheet, Text, View } from "react-native"

export const FallbackIcon = ({
  title,
  url,
  size,
  className,
  style,
}: {
  title: string
  url?: string
  size: number
  className?: string
  style?: StyleProp<ViewStyle>
}) => {
  const colors = useMemo(() => getBackgroundGradient(title || url || ""), [title, url])
  const sizeStyle = useMemo(() => ({ width: size, height: size }), [size])

  const [, , , bgAccent, bgAccentLight, bgAccentUltraLight] = colors

  const renderedText = useMemo(() => {
    const isCJK = isCJKChar(title[0])
    return <Text style={styles.text}>{isCJK ? title[0] : title.slice(0, 2)}</Text>
  }, [title])

  return (
    <LinearGradient
      className={className}
      colors={[bgAccent, bgAccentLight, bgAccentUltraLight]}
      locations={[0, 0.99, 1]}
      style={[sizeStyle, styles.container, style]}
    >
      {renderedText}
    </LinearGradient>
  )
}

export const IconWithFallback = (props: {
  url?: string | undefined | null
  size: number
  title?: string
  className?: string
  style?: StyleProp<ViewStyle>
}) => {
  const { url, size, title = "", className, style } = props
  const [hasError, setHasError] = useState(false)

  if (!url || hasError) {
    return <FallbackIcon title={title} size={size} className={className} style={style} />
  }

  return (
    <View className={className} style={style}>
      <Image
        source={{ uri: url }}
        style={[{ width: size, height: size }]}
        onError={() => setHasError(true)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    color: "#fff",
  },
})
