import { forwardRef } from "react"
import type { StyleProp, SwitchProps, ViewStyle } from "react-native"
import { Switch, Text, View } from "react-native"

import { accentColor } from "@/src/theme/colors"

import { FormLabel } from "./Label"

interface Props {
  wrapperClassName?: string
  wrapperStyle?: StyleProp<ViewStyle>

  label?: string
  description?: string
}

export const FormSwitch = forwardRef<Switch, Props & SwitchProps>(
  ({ wrapperClassName, wrapperStyle, label, description, ...rest }, ref) => {
    return (
      <View className={"w-full flex-row"}>
        <View className="flex-1">
          {!!label && <FormLabel className="pl-1" label={label} optional />}
          {!!description && (
            <Text className="text-secondary-label mb-1 pl-1 text-sm">{description}</Text>
          )}
        </View>
        <Switch trackColor={{ true: accentColor }} ref={ref} {...rest} />
      </View>
    )
  },
)
