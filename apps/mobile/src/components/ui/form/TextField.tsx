import { cn } from "@follow/utils/src/utils"
import type { FC } from "react"
import type { StyleProp, TextInputProps, ViewStyle } from "react-native"
import { StyleSheet, TextInput, View } from "react-native"

interface TextFieldProps {
  wrapperClassName?: string
  wrapperStyle?: StyleProp<ViewStyle>
}
export const TextField: FC<TextInputProps & TextFieldProps> = ({
  className,
  style,
  wrapperClassName,
  wrapperStyle,
  ...rest
}) => {
  return (
    <View
      className={cn(
        "bg-system-fill/40 relative h-10 flex-row items-center rounded-lg px-4",
        wrapperClassName,
      )}
      style={wrapperStyle}
    >
      <TextInput
        className={cn("text-text placeholder:text-placeholder-text", className)}
        style={StyleSheet.flatten([styles.textField, style])}
        {...rest}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  textField: {
    fontSize: 16,
  },
})
