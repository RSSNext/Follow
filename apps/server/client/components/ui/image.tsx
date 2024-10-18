import { getImageProxyUrl } from "@follow/utils/img-proxy"
import { cn } from "@follow/utils/utils"
import * as Avatar from "@radix-ui/react-avatar"
import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"
import { Blurhash } from "react-blurhash"

export const LazyImage: FC<
  PropsWithChildren<{
    src?: string
    blurhash?: string

    className?: string

    height?: number
    width?: number

    proxy?: {
      width: number
      height: number
    }
  }>
> = ({ src, blurhash, className, height, width, proxy }) => {
  const nextSrc = useMemo(() => {
    if (!src) return src

    if (!proxy?.height && !proxy?.width) {
      return src
    }
    return getImageProxyUrl({
      url: src,
      width: proxy?.width,
      height: proxy?.height,
    })
  }, [proxy?.height, proxy?.width, src])
  return (
    <Avatar.Root>
      <Avatar.Image
        src={nextSrc}
        height={height}
        width={width}
        className={cn("size-full", className)}
      />
      <Avatar.Fallback asChild>
        <div className={cn("center size-full", className)}>
          {blurhash && (
            <Blurhash hash={blurhash} resolutionX={32} resolutionY={32} className="!size-full" />
          )}
        </div>
      </Avatar.Fallback>
    </Avatar.Root>
  )
}
