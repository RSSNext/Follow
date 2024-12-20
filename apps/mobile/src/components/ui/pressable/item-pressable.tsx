import { cn, composeEventHandlers } from "@follow/utils"
import { memo, useState } from "react"
import { Pressable } from "react-native"

export const ItemPressable: typeof Pressable = memo(({ children, ...props }) => {
  const [isPressing, setIsPressing] = useState(false)
  return (
    <Pressable
      {...props}
      onPressIn={composeEventHandlers(props.onPressIn, () => setIsPressing(true))}
      onPressOut={composeEventHandlers(props.onPressOut, () => setIsPressing(false))}
      className={cn(
        isPressing ? "bg-tertiary-system-background" : "bg-system-background",
        props.className,
      )}
    >
      {children}
    </Pressable>
  )
})
