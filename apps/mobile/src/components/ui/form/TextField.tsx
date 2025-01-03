import { cn } from "@follow/utils/src/utils"
import { forwardRef } from "react"
import type { StyleProp, TextInputProps, ViewStyle } from "react-native"
import { StyleSheet, TextInput, View } from "react-native"

import { FormLabel } from "./Label"

interface TextFieldProps {
  wrapperClassName?: string
  wrapperStyle?: StyleProp<ViewStyle>

  label?: string
  required?: boolean
}

export const TextField = forwardRef<TextInput, TextInputProps & TextFieldProps>(
  ({ className, style, wrapperClassName, wrapperStyle, label, required, ...rest }, ref) => {
    return (
      <>
        {!!label && <FormLabel className="pl-1" label={label} optional={!required} />}
        <View
          className={cn(
            "bg-system-fill/40 relative h-10 flex-row items-center rounded-lg px-4",
            wrapperClassName,
          )}
          style={wrapperStyle}
        >
          <TextInput
            ref={ref}
            className={cn("text-text placeholder:text-placeholder-text w-full flex-1", className)}
            style={StyleSheet.flatten([styles.textField, style])}
            {...rest}
          />
        </View>
      </>
    )
  },
)

const styles = StyleSheet.create({
  textField: {
    fontSize: 16,
  },
})
