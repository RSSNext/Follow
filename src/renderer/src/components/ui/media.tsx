import { tipcClient } from "@renderer/lib/client"
import { nextFrame } from "@renderer/lib/dom"
import { getProxyUrl } from "@renderer/lib/img-proxy"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import { saveImageDimensionsToDb } from "@renderer/store/image/db"
import { useForceUpdate } from "framer-motion"
import type { FC, ImgHTMLAttributes, VideoHTMLAttributes } from "react"
import { memo, useMemo, useState } from "react"
import { toast } from "sonner"
import { useEventCallback } from "usehooks-ts"

import { usePreviewMedia } from "./media/hooks"
import type { VideoPlayerRef } from "./media/VideoPlayer"
import { VideoPlayer } from "./media/VideoPlayer"

const failedList = new Set<string | undefined>()

type BaseProps = {
  mediaContainerClassName?: string
  showFallback?: boolean
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
      cacheDimensions?: boolean
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
  const { src, style, type, previewImageUrl, showFallback, ...rest } = props
  const [hidden, setHidden] = useState(!src)
  const [imgSrc, setImgSrc] = useState(() =>
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
  const handleOnLoad: React.ReactEventHandler<HTMLImageElement> =
    useEventCallback((e) => {
      rest.onLoad?.(e as any)
      if ("cacheDimensions" in props && props.cacheDimensions && src) {
        saveImageDimensionsToDb(src, {
          src,
          width: e.currentTarget.naturalWidth,
          height: e.currentTarget.naturalHeight,
          ratio: e.currentTarget.naturalWidth / e.currentTarget.naturalHeight,
        })
      }
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
            onLoad={handleOnLoad}
            onClick={handleClick}
            {...(!disableContextMenu ?
                {
                  onContextMenu: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
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
            <VideoPreview src={src!} previewImageUrl={previewImageUrl} />
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
    handleOnLoad,
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

  if (hidden && showFallback) {
    return <FallbackMedia {...props} />
  }
  return (
    <div className={cn("overflow-hidden rounded", className)} style={style}>
      {InnerContent}
    </div>
  )
}

export const Media: FC<MediaProps> = memo((props) => (
  <MediaImpl {...props} key={props.src} />
))

const FallbackMedia: FC<MediaProps> = ({
  type,
  mediaContainerClassName,
  ...props
}) => (
  <div
    className={cn(
      !(props.width || props.height) && "size-full",
      "center relative h-24 rounded bg-zinc-100 object-cover dark:bg-neutral-900",
      "not-prose flex max-h-full flex-col space-y-1",
      mediaContainerClassName,
    )}
    style={{
      height: props.height ? `${props.height}px` : "",
      width: props.width ? `${props.width}px` : "100%",
      ...props.style,
    }}
  >
    <p>Media loaded failed</p>
    <p className="flex items-center gap-1">
      Go to
      {" "}
      <a
        href={props.src}
        target="_blank"
        rel="noreferrer"
        className="follow-link--underline"
      >
        {props.src}
      </a>
      <i className="i-mgc-external-link-cute-re" />
    </p>
  </div>
)

const VideoPreview: FC<{
  src: string
  previewImageUrl?: string
}> = ({ src, previewImageUrl }) => {
  const [isInitVideoPlayer, setIsInitVideoPlayer] = useState(!previewImageUrl)

  const [videoRef, setVideoRef] = useState<VideoPlayerRef | null>(null)
  const isPaused = videoRef?.getState().paused
  const [forceUpdate] = useForceUpdate()
  return (
    <div
      onMouseEnter={() => {
        videoRef?.controls.play()?.then(forceUpdate)
      }}
      onMouseLeave={() => {
        videoRef?.controls.pause()
        nextFrame(forceUpdate)
      }}
    >
      {isInitVideoPlayer ? (
        <img
          src={previewImageUrl}
          className="size-full object-cover"
          onMouseEnter={() => {
            setIsInitVideoPlayer(true)
          }}
        />
      ) : (
        <VideoPlayer
          variant="preview"
          controls={false}
          src={src}
          ref={setVideoRef}
          muted
          className="relative size-full object-cover"
        />
      )}

      <div
        className={cn(
          "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-3xl text-white/80 duration-200",
          isPaused ? "opacity-100" : "opacity-0",
        )}
      >
        <i className="i-mgc-play-cute-fi" />
      </div>
    </div>
  )
}
