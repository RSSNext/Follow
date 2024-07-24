import type { MediaModel } from "@renderer/hono"
import { tipcClient } from "@renderer/lib/client"
import { getProxyUrl } from "@renderer/lib/img-proxy"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import type { FC, ImgHTMLAttributes } from "react"
import { memo, useState } from "react"
import { toast } from "sonner"
import { useEventCallback } from "usehooks-ts"

import { usePreviewMedia } from "./media/hooks"

const failedList = new Set<string | undefined>()
export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  proxy?: {
    width: number
    height: number
  }
  disableContextMenu?: boolean
  popper?: boolean
  type?: MediaModel["type"]
}
const MediaImpl: FC<ImageProps> = ({
  className,
  proxy,
  disableContextMenu,
  popper = false,
  ...props
}) => {
  const { src, style, type, ...rest } = props
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
        props.onError?.(e)
      }
    })
  const previewMedia = usePreviewMedia()
  const handleClick = useEventCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      if (popper && src) {
        e.stopPropagation()
        previewMedia([{
          url: src,
          type: "photo",
        }], 0)
      }
      props.onClick?.(e)
    },
  )

  return (
    <div className={cn("overflow-hidden rounded", className)} style={style}>
      {(!type || type === "photo") && (
        <img
          {...rest}
          onError={errorHandle}
          className={cn(
            hidden && "hidden",
            !(props.width || props.height) && "size-full",
            "bg-stone-100 object-cover",
            popper && "cursor-zoom-in",
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
      )}
    </div>
  )
}

export const Media = memo(MediaImpl)
