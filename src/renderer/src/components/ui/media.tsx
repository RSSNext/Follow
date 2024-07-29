import { tipcClient } from "@renderer/lib/client"
import { getProxyUrl } from "@renderer/lib/img-proxy"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import type { FC, ImgHTMLAttributes, VideoHTMLAttributes } from "react"
import { memo, useMemo, useState } from "react"
import { toast } from "sonner"
import { useEventCallback } from "usehooks-ts"

import { usePreviewMedia } from "./media/hooks"

const failedList = new Set<string | undefined>()

type BaseProps = {
  mediaContainerClassName?: string
}
export type MediaProps = BaseProps &
  (
    | (ImgHTMLAttributes<HTMLImageElement> & {
      proxy?: {
        width: number
        height: number
      }
      disableContextMenu?: boolean
      popper?: boolean
      type: "photo"
      previewImageUrl?: string
    })
    | (VideoHTMLAttributes<HTMLVideoElement> & {
      proxy?: {
        width: number
        height: number
      }
      disableContextMenu?: boolean
      popper?: boolean
      type: "video"
      previewImageUrl?: string
    })
  )
const MediaImpl: FC<MediaProps> = ({
  className,
  proxy,
  disableContextMenu,
  popper = false,
  mediaContainerClassName,
  ...props
}) => {
  const { src, style, type, previewImageUrl, ...rest } = props
  const [hidden, setHidden] = useState(!src)
  const [imgSrc, setImgSrc] = useState(
    proxy && src && !failedList.has(src) ?
      getProxyUrl({
        url: src,
        width: proxy.width,
        height: proxy.height,
      }) :
      src,
  )

  const errorHandle: React.ReactEventHandler<HTMLImageElement> =
    useEventCallback((e) => {
      if (imgSrc !== props.src) {
        setImgSrc(props.src)
        failedList.add(props.src)
      } else {
        setHidden(true)
        props.onError?.(e as any)
      }
    })
  const previewMedia = usePreviewMedia()
  const handleClick = useEventCallback((e: React.MouseEvent) => {
    if (popper && src) {
      e.stopPropagation()
      previewMedia(
        [
          {
            url: src,
            type,
          },
        ],
        0,
      )
    }
    props.onClick?.(e as any)
  })

  const InnerContent = useMemo(() => {
    switch (type) {
      case "photo": {
        return (
          <img
            {...(rest as ImgHTMLAttributes<HTMLImageElement>)}
            onError={errorHandle}
            className={cn(
              hidden && "hidden",
              !(props.width || props.height) && "size-full",
              "bg-gray-200 object-cover dark:bg-neutral-800",
              popper && "cursor-zoom-in",
              mediaContainerClassName,
            )}
            src={imgSrc}
            onClick={handleClick}
            {...(!disableContextMenu ?
                {
                  onContextMenu: (e) => {
                    e.stopPropagation()
                    props.onContextMenu?.(e)
                    showNativeMenu(
                      [
                        {
                          type: "text",
                          label: "Open Image in New Window",
                          click: () => {
                            if (props.src && imgSrc && tipcClient) {
                              window.open(props.src, "_blank")
                            }
                          },
                        },
                        {
                          type: "text",
                          label: "Copy Image Address",
                          click: () => {
                            if (props.src) {
                              navigator.clipboard.writeText(props.src)
                              toast("Address copied to clipboard.", {
                                duration: 1000,
                              })
                            }
                          },
                        },
                      ],
                      e,
                    )
                  },
                } :
                {})}
          />
        )
      }
      case "video": {
        return (
          <div
            className={cn(
              hidden && "hidden",
              !(props.width || props.height) && "size-full",
              "relative bg-stone-100 object-cover",
              mediaContainerClassName,
            )}
            onClick={handleClick}
          >
            {previewImageUrl ? (
              <img src={previewImageUrl} className="size-full object-cover" />
            ) : (
              <video
                src={src}
                muted
                className="relative size-full object-cover"
              />
            )}
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-3xl text-white/80">
              <i className="i-mgc-play-cute-fi" />
            </div>
          </div>
        )
      }
      default: {
        throw new Error("Invalid type")
      }
    }
  }, [
    disableContextMenu,
    errorHandle,
    handleClick,
    hidden,
    imgSrc,
    mediaContainerClassName,
    popper,
    previewImageUrl,
    props,
    rest,
    src,
    type,
  ])

  return (
    <div className={cn("overflow-hidden rounded", className)} style={style}>
      {InnerContent}
    </div>
  )
}

export const Media: FC<MediaProps> = memo((props) => (
  <MediaImpl {...props} key={props.src} />
))
