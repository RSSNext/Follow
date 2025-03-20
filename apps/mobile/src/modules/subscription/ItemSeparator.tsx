import { View } from "react-native"

const el = (
  <View className="bg-secondary-system-grouped-background mx-2">
    <View
      className="bg-opaque-separator/50 ml-12 h-px flex-1"
      collapsable={false}
      style={{ transform: [{ scaleY: 0.5 }] }}
    />
  </View>
)
export const ItemSeparator = () => {
  return el
}

const el2 = (
  <View className="bg-secondary-system-grouped-background mx-2">
    <View
      className="bg-opaque-separator/50 ml-16 h-px flex-1"
      collapsable={false}
      style={{ transform: [{ scaleY: 0.5 }] }}
    />
  </View>
)
export const SecondaryItemSeparator = () => {
  return el2
}
