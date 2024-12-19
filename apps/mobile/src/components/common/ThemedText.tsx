import type { TextProps } from "react-native"
import { Text } from "react-native"

export function ThemedText(props: TextProps) {
  return <Text {...props} className={`font-sn ${props.className}`} />
}
