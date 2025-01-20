import { cn } from "@follow/utils"
import { useEffect, useMemo, useState } from "react"
import type { StyleProp, ViewStyle } from "react-native"
import { Text, View } from "react-native"
import { useEventCallback } from "usehooks-ts"

import { MingcuteDownLineIcon } from "@/src/icons/mingcute_down_line"
import { accentColor } from "@/src/theme/colors"

import { DropdownMenu } from "../dropdown/DropdownMenu"
import { FormLabel } from "./Label"

interface SelectProps<T> {
  options: { label: string; value: T }[]

  value: T
  onValueChange: (value: T) => void

  wrapperClassName?: string
  wrapperStyle?: StyleProp<ViewStyle>

  label?: string
}
export function Select<T>({
  options,
  value,
  onValueChange,
  wrapperClassName,
  wrapperStyle,
  label,
}: SelectProps<T>) {
  const [currentValue, setCurrentValue] = useState(() => {
    if (!value) {
      return options[0]!.value
    }
    return value
  })

  const valueToLabelMap = useMemo(() => {
    return options.reduce((acc, option) => {
      acc.set(option.value, option.label)
      return acc
    }, new Map<T, string>())
  }, [options])

  const handleChangeValue = useEventCallback((value: T) => {
    setCurrentValue(value)
    onValueChange(value)
  })

  useEffect(() => {
    onValueChange(currentValue)
  }, [])

  return (
    <View className="flex-1 flex-row items-center">
      {!!label && <FormLabel className="pl-2" label={label} />}

      <View className="flex-1" />
      {/* Trigger */}
      <DropdownMenu<T>
        options={options.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        currentValue={currentValue}
        handleChangeValue={handleChangeValue}
      >
        <View
          className={cn(
            "h-8 flex-row items-center rounded-lg pl-3 pr-2",
            "min-w-[80px]",
            wrapperClassName,
          )}
          style={wrapperStyle}
        >
          <Text className="font-semibold text-accent">{valueToLabelMap.get(currentValue)}</Text>
          <View className="ml-auto shrink-0 pl-1">
            <MingcuteDownLineIcon color={accentColor} height={18} width={18} />
          </View>
        </View>
      </DropdownMenu>
    </View>
  )
}
