import { cn } from "@follow/utils"
import type { TextProps } from "react-native"
import { Text } from "react-native"

export function ThemedText(props: TextProps) {
  return <Text {...props} className={cn("font-sn text-label", props.className)} />
}
