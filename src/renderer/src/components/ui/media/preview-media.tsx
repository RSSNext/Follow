import { m } from "@renderer/components/common/Motion"
import { COPY_MAP } from "@renderer/constants"
import { tipcClient } from "@renderer/lib/client"
import { stopPropagation } from "@renderer/lib/dom"
import { replaceImgUrlIfNeed } from "@renderer/lib/img-proxy"
import { showNativeMenu } from "@renderer/lib/native-menu"
import type { FC } from "react"
import { Fragment, useCallback, useState } from "react"
import type { MediaModel } from "src/hono"
import { Keyboard, Mousewheel, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { ActionButton, MotionButtonBase } from "../button"
import { microReboundPreset } from "../constants/spring"
import { useCurrentModal } from "../modal"
import { VideoPlayer } from "./video-player"

const Wrapper: Component<{
  src: string
}> = ({ children, src }) => {
  const { dismiss } = useCurrentModal()

  return (
    <div className="center relative size-full p-12" onClick={dismiss}>
      <m.div
        className="center size-full"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={microReboundPreset}
      >
        {children}
      </m.div>
      <m.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute bottom-4 right-4 flex gap-3"
        onClick={stopPropagation}
      >
        <button
          onClick={dismiss}
          className="center fixed right-6 top-6 size-8 rounded-full border bg-theme-background text-foreground/60"
          type="button"
        >
          <i className="i-mgc-close-cute-re" />
        </button>
        {!!window.electron && (
          <ActionButton
            tooltip="Download"
            onClick={() => {
              tipcClient?.saveImage(src)
            }}
          >
            <i className="i-mgc-download-2-cute-re" />
          </ActionButton>
        )}
        <ActionButton
          tooltip={COPY_MAP.OpenInBrowser()}
          onClick={() => {
            window.open(src)
          }}
        >
          <i className="i-mgc-external-link-cute-re" />
        </ActionButton>
      </m.div>
    </div>
  )
}
export const PreviewMediaContent: FC<{
  media: MediaModel[]
  initialIndex?: number
}> = ({ media, initialIndex = 0 }) => {
  const [currentMedia, setCurrentMedia] = useState(media[initialIndex])

  const handleContextMenu = useCallback(
    (image: string, e: React.MouseEvent<HTMLImageElement>) => {
      if (!window.electron) return

      showNativeMenu(
        [
          {
            label: COPY_MAP.OpenInBrowser(),
            type: "text",
            click: () => {
              window.open(image)
            },
          },
          {
            label: "Copy image address",
            type: "text",
            click: () => {
              navigator.clipboard.writeText(image)
            },
          },
          {
            label: "Save image as...",
            type: "text",
            click: () => {
              tipcClient?.saveImage(image)
            },
          },
        ],
        e,
      )
    },
    [],
  )
  if (media.length === 0) return null
  if (media.length === 1) {
    const src = media[0].url
    return (
      <Wrapper src={src}>
        {media[0].type === "video" ? (
          <VideoPlayer
            src={src}
            controls
            autoPlay
            muted
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <FallbackableImage
            className="size-full object-contain"
            alt="cover"
            src={src}
            onContextMenu={(e) => handleContextMenu(src, e)}
          />
        )}
      </Wrapper>
    )
  }
  return (
    <Wrapper src={currentMedia.url}>
      <Swiper
        loop
        initialSlide={initialIndex}
        scrollbar={{
          hide: true,
        }}
        mousewheel={{
          forceToAxis: true,
        }}
        keyboard={{
          enabled: true,
        }}
        onSlideChange={({ realIndex }) => {
          setCurrentMedia(media[realIndex])
        }}
        modules={[Scrollbar, Mousewheel, Keyboard]}
        className="size-full"
      >
        {media.map((med, index) => (
          <SwiperSlide
            key={med.url}
            virtualIndex={index}
            className="center !flex"
          >
            {med.type === "video" ? (
              <VideoPlayer
                src={med.url}
                controls
                className="max-h-full max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <FallbackableImage
                onContextMenu={(e) => handleContextMenu(med.url, e)}
                className="size-full object-contain"
                alt="cover"
                src={med.url}
                loading="lazy"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </Wrapper>
  )
}

const FallbackableImage: FC<
  Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
    src: string
  }
> = ({ src, onError, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(() => replaceImgUrlIfNeed(src))

  const [isAllError, setIsAllError] = useState(false)

  const handleError = useCallback(
    (e) => {
      if (currentSrc !== src) {
        setCurrentSrc(src)
      } else {
        onError?.(e as any)
        setIsAllError(true)
      }
    },
    [currentSrc, onError, src],
  )
  return (
    <Fragment>
      {!isAllError && <img src={currentSrc} onError={handleError} {...props} />}
      {isAllError && (
        <div className="center flex-col gap-6">
          <i className="i-mgc-close-cute-re text-[60px] text-red-500" />

          <span>Failed to load image</span>
          <div className="center gap-4">
            <MotionButtonBase
              className="underline underline-offset-4"
              onClick={() => {
                setCurrentSrc(replaceImgUrlIfNeed(src))
                setIsAllError(false)
              }}
            >
              Retry
            </MotionButtonBase>
            Or
            <a
              className="underline underline-offset-4"
              href={src}
              target="_blank"
              rel="noreferrer"
            >
              Visit Original
            </a>
          </div>
        </div>
      )}
    </Fragment>
  )
}
