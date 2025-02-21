import { useTypeScriptHappyCallback } from "@follow/hooks"
import { cn, composeEventHandlers } from "@follow/utils"
import type { FC } from "react"
import { Fragment, memo, useEffect, useState } from "react"
import type { PressableProps } from "react-native"
import { StyleSheet } from "react-native"
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated"

import { useColor } from "@/src/theme/colors"

import { ReAnimatedPressable } from "../../common/AnimatedComponents"
import { ItemPressableStyle } from "./enum"

interface ItemPressableProps extends PressableProps {
  itemStyle?: ItemPressableStyle
}

export const ItemPressable: FC<ItemPressableProps> = memo(
  ({ children, itemStyle = ItemPressableStyle.Grouped, ...props }) => {
    const [isPressing, setIsPressing] = useState(false)

    const secondarySystemGroupedBackground = useColor("secondarySystemGroupedBackground")
    const plainBackground = useColor("systemBackground")

    const itemNormalColor =
      itemStyle === ItemPressableStyle.Plain ? plainBackground : secondarySystemGroupedBackground

    const systemFill = useColor("systemFill")
    const pressed = useSharedValue(0)

    useEffect(() => {
      if (isPressing) {
        pressed.value = 1
      } else {
        pressed.value = 0
      }
    }, [isPressing, pressed])

    const colorStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(pressed.value, [0, 1], [itemNormalColor, systemFill]),
      }
    })
    return (
      <ReAnimatedPressable
        {...props}
        onPressIn={composeEventHandlers(props.onPressIn, () => setIsPressing(true))}
        onPressOut={composeEventHandlers(props.onPressOut, () => setIsPressing(false))}
        onHoverIn={composeEventHandlers(props.onHoverIn, () => setIsPressing(true))}
        onHoverOut={composeEventHandlers(props.onHoverOut, () => setIsPressing(false))}
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
              <Fragment>
                <Animated.View className="absolute inset-0" style={colorStyle} />
                {typeof children === "function" ? children(props) : children}
              </Fragment>
            )
          },
          [children, colorStyle],
        )}
      </ReAnimatedPressable>
    )
  },
)
