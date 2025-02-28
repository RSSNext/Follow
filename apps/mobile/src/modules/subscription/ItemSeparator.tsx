import { View } from "react-native"

const el = (
  <View className="bg-secondary-system-grouped-background">
    <View
      className="bg-opaque-separator ml-12 h-px flex-1"
      collapsable={false}
      style={{ transform: [{ scaleY: 0.5 }] }}
    />
  </View>
)
export const ItemSeparator = () => {
  return el
}
