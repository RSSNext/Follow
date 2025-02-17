import { StyleSheet, View } from "react-native"

const el = (
  <View className="bg-opaque-separator mx-4" style={{ height: StyleSheet.hairlineWidth }} />
)

export const ItemSeparator = () => {
  return el
}
const el2 = (
  <View className="bg-opaque-separator w-full" style={{ height: StyleSheet.hairlineWidth }} />
)
export const ItemSeparatorFullWidth = () => {
  return el2
}
