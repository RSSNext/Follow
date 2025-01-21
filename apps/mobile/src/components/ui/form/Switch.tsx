import { forwardRef } from "react"
import type { StyleProp, ViewStyle } from "react-native"
import { Text, View } from "react-native"

import type { SwitchProps, SwitchRef } from "../switch/Switch"
import { Switch } from "../switch/Switch"
import { FormLabel } from "./Label"

interface Props {
  wrapperClassName?: string
  wrapperStyle?: StyleProp<ViewStyle>

  label?: string
  description?: string

  size?: "sm" | "default"
}

export const FormSwitch = forwardRef<SwitchRef, Props & SwitchProps>(
  ({ wrapperClassName, wrapperStyle, label, description, size = "default", ...rest }, ref) => {
    const Trigger = <Switch size={size} ref={ref} {...rest} />

    if (!label) {
      return Trigger
    }
    return (
      <View className={"w-full flex-row"}>
        <View className="flex-1">
          <FormLabel className="pl-1" label={label} optional />
          {!!description && (
            <Text className="text-secondary-label mb-1 pl-1 text-sm">{description}</Text>
          )}
        </View>
        {Trigger}
      </View>
    )
  },
)
