import { View } from "react-native"

const el = (
  <View
    className="bg-opaque-separator mx-4 h-px"
    style={{ transform: [{ scaleY: 0.5 }] }}
    collapsable={false}
  />
)

export const ItemSeparator = () => {
  return el
}
const el2 = (
  <View
    className="bg-opaque-separator h-px w-full"
    style={{ transform: [{ scaleY: 0.5 }] }}
    collapsable={false}
  />
)
export const ItemSeparatorFullWidth = () => {
  return el2
}
