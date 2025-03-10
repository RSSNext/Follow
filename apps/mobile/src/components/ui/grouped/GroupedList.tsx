import { cn } from "@follow/utils"
import type { FC, PropsWithChildren } from "react"
import * as React from "react"
import { Fragment } from "react"
import type { PressableProps, ViewProps } from "react-native"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

import { CheckFilledIcon } from "@/src/icons/check_filled"
import { MingcuteRightLine } from "@/src/icons/mingcute_right_line"
import { accentColor, useColor } from "@/src/theme/colors"

export enum GroupedInsetListCardItemStyle {
  NavigationLink = "NavigationLink",
}
type GroupedInsetListCardProps = {
  showSeparator?: boolean
}

interface BaseCellClassNames {
  leftClassName?: string
  rightClassName?: string
}

export const GroupedOutlineDescription: FC<{
  description: string
}> = ({ description }) => {
  return <Text className="text-secondary-label mx-9 mt-1 text-sm">{description}</Text>
}

export const GroupedInsetListCard: FC<
  PropsWithChildren & ViewProps & GroupedInsetListCardProps
> = ({ children, className, showSeparator = true, ...props }) => {
  return (
    <View
      {...props}
      className={cn(
        "bg-secondary-system-grouped-background mx-4 flex-1 overflow-hidden rounded-[10px]",
        className,
      )}
    >
      {showSeparator
        ? React.Children.map(children, (child, index) => {
            const isLast = index === React.Children.count(children) - 1

            if (child === null) return null
            const isNavigationLink =
              React.isValidElement(child) &&
              // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
              ((child.type as Function).name === GroupedInsetListNavigationLink.name ||
                (child.type as any).itemStyle === GroupedInsetListCardItemStyle.NavigationLink)

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
          })
        : children}
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

export const GroupedInsetListNavigationLink: FC<
  {
    label: string
    icon?: React.ReactNode
    onPress: () => void
    disabled?: boolean
    postfix?: React.ReactNode
  } & BaseCellClassNames
> = ({ label, icon, onPress, disabled, leftClassName, rightClassName, postfix }) => {
  const rightIconColor = useColor("tertiaryLabel")

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <GroupedInsetListBaseCell
          className={cn(pressed ? "bg-system-fill" : undefined, disabled && "opacity-40")}
        >
          <View className={cn("flex-1 flex-row items-center justify-between", leftClassName)}>
            <View className="flex-row items-center">
              {icon}
              <Text className={"text-label"}>{label}</Text>
            </View>
            <View className={cn("-mr-2 ml-4 flex-row", rightClassName)}>
              {postfix}
              <MingcuteRightLine height={18} width={18} color={rightIconColor} />
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

export const GroupedInsetListCell: FC<
  {
    label: string
    description?: string
    children?: React.ReactNode
  } & BaseCellClassNames
> = ({ label, description, children, leftClassName, rightClassName }) => {
  return (
    <GroupedInsetListBaseCell className="flex-1">
      <View className={cn("flex-1", leftClassName)}>
        <Text className="text-label">{label}</Text>
        {!!description && (
          <Text className="text-secondary-label text-sm leading-tight">{description}</Text>
        )}
      </View>

      <View className={cn("mb-auto ml-4 shrink-0", rightClassName)}>{children}</View>
    </GroupedInsetListBaseCell>
  )
}

export const GroupedInsetListActionCellRadio: FC<{
  label: string
  description?: string
  onPress?: () => void
  disabled?: boolean
  selected?: boolean
}> = ({ label, description, onPress, disabled, selected }) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <GroupedInsetListBaseCell
          className={cn(pressed ? "bg-system-fill" : undefined, disabled && "opacity-40")}
        >
          <View className="flex-1">
            <Text className="text-label">{label}</Text>
            {!!description && (
              <Text className="text-secondary-label text-sm leading-tight">{description}</Text>
            )}
          </View>

          <View className="ml-4 size-[18px]">
            {selected && <CheckFilledIcon height={18} width={18} color={accentColor} />}
          </View>
        </GroupedInsetListBaseCell>
      )}
    </Pressable>
  )
}

export const GroupedInsetListActionCell: FC<{
  label: string
  description?: string
  onPress?: () => void
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
            <Text className="text-label">{label}</Text>
            {!!description && (
              <Text className="text-secondary-label text-sm leading-tight">{description}</Text>
            )}
          </View>

          <View className="-mr-2 ml-4">
            <MingcuteRightLine height={18} width={18} color={rightIconColor} />
          </View>
        </GroupedInsetListBaseCell>
      )}
    </Pressable>
  )
}

export const GroupedInsetButtonCell: FC<{
  label: string
  onPress?: () => void
  disabled?: boolean
  style?: "destructive" | "primary"
}> = ({ label, onPress, disabled, style = "primary" }) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      {({ pressed }) => (
        <GroupedInsetListBaseCell
          className={cn(pressed ? "bg-system-fill" : undefined, disabled && "opacity-40")}
        >
          <View className="flex-1 items-center justify-center">
            <Text className={`${style === "destructive" ? "text-red" : "text-label"}`}>
              {label}
            </Text>
          </View>
        </GroupedInsetListBaseCell>
      )}
    </Pressable>
  )
}

export const GroupedInformationCell: FC<{
  title: string
  description?: string
  icon?: React.ReactNode
  iconBackgroundColor?: string
}> = ({ title, description, icon, iconBackgroundColor }) => {
  return (
    <GroupedInsetListBaseCell className="flex-1 flex-col items-center justify-center rounded-[16px] p-6">
      {!!icon && (
        <View
          className="mb-3 size-[64px] items-center justify-center rounded-xl p-1"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          {icon}
        </View>
      )}
      <Text className="text-label text-3xl font-bold">{title}</Text>
      {!!description && (
        <Text className="text-label mt-3 text-balance text-center text-base leading-tight">
          {description}
        </Text>
      )}
    </GroupedInsetListBaseCell>
  )
}

export const GroupedPlainButtonCell: FC<
  {
    label: string
    textClassName?: string
  } & PressableProps
> = ({ label, textClassName, ...props }) => {
  return (
    <GroupedInsetListBaseCell className="p-0">
      <Pressable {...props} className="flex-1">
        {({ pressed }) => {
          return (
            <View className="flex-1 px-5 py-4">
              {/* Pressed Overlay Effect */}
              {pressed && (
                <Animated.View
                  className="bg-system-fill absolute inset-0"
                  entering={FadeIn.duration(100)}
                  exiting={FadeOut.duration(100)}
                />
              )}
              <Text className={cn("text-accent text-center", textClassName)}>{label}</Text>
            </View>
          )
        }}
      </Pressable>
    </GroupedInsetListBaseCell>
  )
}
