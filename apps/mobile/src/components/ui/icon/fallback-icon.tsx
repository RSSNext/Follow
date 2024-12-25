import { getBackgroundGradient, isCJKChar } from "@follow/utils"
import { LinearGradient } from "expo-linear-gradient"
import { useMemo } from "react"
import type { StyleProp, ViewStyle } from "react-native"
import { StyleSheet, Text } from "react-native"

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
