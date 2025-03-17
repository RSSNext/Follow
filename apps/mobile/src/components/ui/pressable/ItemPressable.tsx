import { useTypeScriptHappyCallback } from "@follow/hooks"
import { cn, composeEventHandlers } from "@follow/utils"
import type { FC } from "react"
import { Fragment, memo } from "react"
import type { PressableProps } from "react-native"
import { StyleSheet } from "react-native"

import { useColor } from "@/src/theme/colors"

import { ReAnimatedPressable } from "../../common/AnimatedComponents"
import { ItemPressableStyle } from "./enum"

interface ItemPressableProps extends PressableProps {
  itemStyle?: ItemPressableStyle
}

export const ItemPressable: FC<ItemPressableProps> = memo(
  ({ children, itemStyle = ItemPressableStyle.Grouped, ...props }) => {
    const secondarySystemGroupedBackground = useColor("secondarySystemGroupedBackground")
    const plainBackground = useColor("systemBackground")

    const itemNormalColor =
      itemStyle === ItemPressableStyle.Plain ? plainBackground : secondarySystemGroupedBackground

    return (
      <ReAnimatedPressable
        {...props}
        // This is a workaround to prevent context menu crash when release too quickly
        // https://github.com/nandorojo/zeego/issues/61
        onLongPress={composeEventHandlers(props.onLongPress, () => {})}
        delayLongPress={props.delayLongPress ?? 100}
        className={cn(props.className, "relative")}
        style={StyleSheet.flatten([props.style, { backgroundColor: itemNormalColor }])}
      >
        {useTypeScriptHappyCallback(
          (props) => {
            return (
              <Fragment>{typeof children === "function" ? children(props) : children}</Fragment>
            )
          },
          [children],
        )}
      </ReAnimatedPressable>
    )
  },
)
