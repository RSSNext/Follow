import { cn } from "@follow/utils"
import type { FC, PropsWithChildren } from "react"
import * as React from "react"
import { Fragment } from "react"
import type { ViewProps } from "react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"

import { RightCuteReIcon } from "@/src/icons/right_cute_re"
import { useColor } from "@/src/theme/colors"

export const GroupedInsetListCard: FC<PropsWithChildren> = ({ children }) => {
  return (
    <View className="bg-secondary-system-grouped-background mx-4 flex-1 overflow-hidden rounded-[10px]">
      {React.Children.map(children, (child, index) => {
        const isLast = index === React.Children.count(children) - 1
        return (
          <Fragment key={index}>
            {child}
            {!isLast && (
              <View
                className="bg-opaque-separator ml-16"
                style={{ height: StyleSheet.hairlineWidth }}
              />
            )}
          </Fragment>
        )
      })}
    </View>
  )
}

export const GroupedInsetListSectionHeader: FC<{
  label: string
}> = ({ label }) => {
  return (
    <View className="mx-4 h-[23px] px-5">
      <Text className="text-secondary-label" ellipsizeMode="tail" numberOfLines={1}>
        {label}
      </Text>
    </View>
  )
}

export const GroupedInsetListItem: FC<PropsWithChildren & ViewProps> = ({ children, ...props }) => {
  return (
    <View {...props} className={cn("px-5 py-4", props.className)}>
      {children}
    </View>
  )
}

export const GroupedInsetListNavigationLink: FC<{
  label: string
  icon?: React.ReactNode
  onPress: () => void
}> = ({ label, icon, onPress }) => {
  const tertiaryLabelColor = useColor("tertiaryLabel")

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <GroupedInsetListItem className={cn(pressed && "bg-system-fill")}>
          <View className={"flex-row items-center"}>
            <View className="flex-row items-center">
              {icon}
              <Text className="text-[16px]">{label}</Text>
            </View>
            <View className="-mr-2 ml-auto">
              <RightCuteReIcon height={18} width={18} color={tertiaryLabelColor} />
            </View>
          </View>
        </GroupedInsetListItem>
      )}
    </Pressable>
  )
}
