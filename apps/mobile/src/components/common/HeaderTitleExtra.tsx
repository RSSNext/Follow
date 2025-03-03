import { cn } from "@follow/utils"
import { useTheme } from "@react-navigation/native"
import type { StyleProp, TextProps, TextStyle } from "react-native"
import { Animated, StyleSheet, Text, View } from "react-native"

type Props = Omit<TextProps, "style"> & {
  tintColor?: string
  children?: string
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>>
  subText?: string
  subTextStyle?: StyleProp<TextStyle>
  subTextClassName?: string
}

export function HeaderTitleExtra({
  tintColor,
  style,
  subText,
  subTextStyle,
  subTextClassName,
  ...rest
}: Props) {
  const { fonts } = useTheme()

  return (
    <View>
      <Animated.Text
        accessibilityRole="header"
        aria-level="1"
        numberOfLines={1}
        {...rest}
        className={"text-label"}
        style={[fonts.bold, styles.title, style]}
      />
      {!!subText && (
        <Text
          className={cn("text-text/50 text-center text-xs", subTextClassName)}
          style={subTextStyle}
        >
          {subText}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  title: { fontSize: 17 },
})
