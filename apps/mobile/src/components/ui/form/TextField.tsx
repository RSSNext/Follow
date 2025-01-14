import { cn } from "@follow/utils/src/utils"
import { forwardRef } from "react"
import type { StyleProp, TextInputProps, ViewStyle } from "react-native"
import { StyleSheet, Text, TextInput, View } from "react-native"

import { accentColor } from "@/src/theme/colors"

import { FormLabel } from "./Label"

interface TextFieldProps {
  wrapperClassName?: string
  wrapperStyle?: StyleProp<ViewStyle>

  label?: string
  description?: string
  required?: boolean
}

export const TextField = forwardRef<TextInput, TextInputProps & TextFieldProps>(
  (
    { className, style, wrapperClassName, wrapperStyle, label, description, required, ...rest },
    ref,
  ) => {
    return (
      <>
        {!!label && <FormLabel className="pl-2" label={label} optional={!required} />}
        {!!description && (
          <Text className="text-secondary-label mb-1 pl-1 text-sm">{description}</Text>
        )}
        <View
          className={cn(
            "bg-tertiary-system-fill relative h-10 flex-row items-center rounded-lg px-3",
            wrapperClassName,
          )}
          style={wrapperStyle}
        >
          <TextInput
            selectionColor={accentColor}
            ref={ref}
            className={cn("text-text placeholder:text-secondary-label w-full flex-1", className)}
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
