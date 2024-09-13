import { Slot } from "@radix-ui/react-slot"
import * as LinkParsers from "@renderer/lib/link-parser"
import { cn } from "@renderer/lib/utils"
import type { FC } from "react"

import { getSupportedPlatformIconName } from "./utils"

const IconMap = Object.values(LinkParsers).reduce(
  (acc, parser) => {
    acc[parser.parserName] = parser.icon
    return acc
  },
  {} as Record<string, string>,
)

export const PlatformIcon: FC<{
  url: string
  children: React.JSX.Element
  className?: string
  style?: React.CSSProperties
}> = ({ className, url, children, style, ...rest }) => {
  const iconName = getSupportedPlatformIconName(url)

  if (!iconName || !IconMap[iconName]) {
    return (
      <Slot className={className} style={style} {...rest}>
        {children}
      </Slot>
    )
  }

  return (
    <i
      className={cn(`${IconMap[iconName]} ${className}`)}
      style={{
        ...style,
        maskImage: "var(--svg)",
      }}
    />
  )
}
