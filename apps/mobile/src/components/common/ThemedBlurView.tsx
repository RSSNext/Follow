import type { BlurViewProps } from "expo-blur"
import { BlurView } from "expo-blur"
import { useColorScheme } from "nativewind"
import type { FC } from "react"

export const ThemedBlurView: FC<BlurViewProps> = ({ tint, ...rest }) => {
  const { colorScheme } = useColorScheme()
  return (
    <BlurView
      tint={colorScheme === "light" ? "systemMaterialLight" : "systemMaterialDark"}
      {...rest}
    />
  )
}
