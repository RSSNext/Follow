import { Slot } from "@radix-ui/react-slot"
import { cn } from "@renderer/lib/utils"
import type { FC } from "react"

import { getSupportedPlatformIconName } from "./utils"

export const PlatformIcon: FC<{
  url: string
  children: React.JSX.Element
  className?: string
  style?: React.CSSProperties
}> = ({ className, url, children, style, ...rest }) => {
  const iconName = getSupportedPlatformIconName(url)

  if (!iconName) {
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

const IconMap = {
  github: tw`i-mgc-github-2-cute-fi text-black dark:text-white`,
  twitter: tw`i-mgc-twitter-cute-fi text-[#55acee]`,
  x: tw`i-mgc-social-x-cute-li`,
  youtube: tw`i-mgc-youtube-cute-fi text-[#ff0000]`,
}
