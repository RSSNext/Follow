import { StyleSheet } from "react-native"
import { useColor } from "react-native-uikit-colors"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"

const node = (
  <ThemedBlurView
    style={{
      ...StyleSheet.absoluteFillObject,
      overflow: "hidden",
      backgroundColor: "transparent",
    }}
  />
)
export const BlurEffect = () => {
  return node
}

const InternalBlurEffectWithBottomBorder = () => {
  const border = useColor("opaqueSeparator")
  return (
    <ThemedBlurView
      style={{
        ...StyleSheet.absoluteFillObject,
        overflow: "hidden",
        backgroundColor: "transparent",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: border,
      }}
    />
  )
}

export const BlurEffectWithBottomBorder = () => <InternalBlurEffectWithBottomBorder />
