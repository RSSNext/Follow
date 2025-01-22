import { cn } from "@follow/utils"
import type { FC, PropsWithChildren } from "react"
import * as React from "react"
import { Fragment } from "react"
import type { ViewProps } from "react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"

import { RightCuteReIcon } from "@/src/icons/right_cute_re"
import { useColor } from "@/src/theme/colors"

export const GroupedInsetListCard: FC<PropsWithChildren & ViewProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <View
      {...props}
      className={cn(
        "bg-secondary-system-grouped-background mx-4 flex-1 overflow-hidden rounded-[10px]",
        className,
      )}
    >
      {React.Children.map(children, (child, index) => {
        const isLast = index === React.Children.count(children) - 1

        const isNavigationLink =
          React.isValidElement(child) &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
          (child.type as Function).name === GroupedInsetListNavigationLink.name

        return (
          <Fragment key={index}>
            {child}
            {!isLast && (
              <View
                className={cn("bg-opaque-separator", isNavigationLink ? "ml-16" : "mx-4")}
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

export const GroupedInsetListBaseCell: FC<PropsWithChildren & ViewProps> = ({
  children,
  ...props
}) => {
  return (
    <View
      {...props}
      className={cn("flex-row items-center justify-between px-5 py-4", props.className)}
    >
      {children}
    </View>
  )
}

export const GroupedInsetListNavigationLink: FC<{
  label: string
  icon?: React.ReactNode
  onPress: () => void
  disabled?: boolean
}> = ({ label, icon, onPress, disabled }) => {
  const rightIconColor = useColor("tertiaryLabel")

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <GroupedInsetListBaseCell
          className={cn(pressed ? "bg-system-fill" : undefined, disabled && "opacity-40")}
        >
          <View className={"flex-1 flex-row items-center justify-between"}>
            <View className="flex-row items-center">
              {icon}
              <Text className={"text-label text-[16px]"}>{label}</Text>
            </View>
            <View className="-mr-2 ml-4">
              <RightCuteReIcon height={18} width={18} color={rightIconColor} />
            </View>
          </View>
        </GroupedInsetListBaseCell>
      )}
    </Pressable>
  )
}

export const GroupedInsetListNavigationLinkIcon: FC<
  {
    backgroundColor: string
  } & PropsWithChildren
> = ({ backgroundColor, children }) => {
  return (
    <View
      className="mr-4 items-center justify-center rounded-[5px] p-1"
      style={{
        backgroundColor,
      }}
    >
      {children}
    </View>
  )
}

export const GroupedInsetListCell: FC<{
  label: string
  description?: string
  children?: React.ReactNode
}> = ({ label, description, children }) => {
  return (
    <GroupedInsetListBaseCell className="flex-1">
      <View className="flex-1">
        <Text>{label}</Text>
        {!!description && <Text className="text-secondary-label text-sm">{description}</Text>}
      </View>

      <View className="mb-auto ml-4 shrink-0">{children}</View>
    </GroupedInsetListBaseCell>
  )
}

export const GroupedInsetListActionCell: FC<{
  label: string
  description?: string
  onPress: () => void
  disabled?: boolean
}> = ({ label, description, onPress, disabled }) => {
  const rightIconColor = useColor("tertiaryLabel")
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <GroupedInsetListBaseCell
          className={cn(pressed ? "bg-system-fill" : undefined, disabled && "opacity-40")}
        >
          <View className="flex-1">
            <Text>{label}</Text>
            {!!description && <Text className="text-secondary-label text-sm">{description}</Text>}
          </View>

          <View className="-mr-2 ml-4">
            <RightCuteReIcon height={18} width={18} color={rightIconColor} />
          </View>
        </GroupedInsetListBaseCell>
      )}
    </Pressable>
  )
}
