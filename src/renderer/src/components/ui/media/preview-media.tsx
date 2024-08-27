import { m } from "@renderer/components/common/Motion"
import { COPY_MAP } from "@renderer/constants"
import { tipcClient } from "@renderer/lib/client"
import { stopPropagation } from "@renderer/lib/dom"
import { replaceImgUrlIfNeed } from "@renderer/lib/img-proxy"
import { showNativeMenu } from "@renderer/lib/native-menu"
import { cn } from "@renderer/lib/utils"
import type { FC } from "react"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import type { MediaModel } from "src/hono"
import { Keyboard, Mousewheel } from "swiper/modules"
import type { SwiperRef } from "swiper/react"
import { Swiper, SwiperSlide } from "swiper/react"

import { ActionButton, MotionButtonBase } from "../button"
import { microReboundPreset } from "../constants/spring"
import { useCurrentModal } from "../modal"
import { VideoPlayer } from "./VideoPlayer"

const Wrapper: Component<{
  src: string
  showActions?: boolean
}> = ({ children, src, showActions }) => {
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
        className="absolute bottom-4 right-4 flex gap-3 text-white/70 [&_button]:hover:text-white"
        onClick={stopPropagation}
      >
        <button
          onClick={dismiss}
          className="center fixed right-6 top-6 size-8 rounded-full border border-white/20 bg-neutral-900 text-white"
          type="button"
        >
          <i className="i-mgc-close-cute-re" />
        </button>
        {showActions && (
          <Fragment>
            {!!window.electron && (
              <ActionButton
                tooltip="Download"
                onClick={() => {
                  tipcClient?.download(src)
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
          </Fragment>
        )}
      </m.div>
    </div>
  )
}
export const PreviewMediaContent: FC<{
  media: MediaModel[]
  initialIndex?: number
}> = ({ media, initialIndex = 0 }) => {
  const [currentMedia, setCurrentMedia] = useState(media[initialIndex])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialIndex)

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
              tipcClient?.download(image)
            },
          },
        ],
        e,
      )
    },
    [],
  )

  const swiperRef = useRef<SwiperRef>(null)
  // This only to delay show
  const [showActions, setShowActions] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowActions(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (media.length === 0) return null
  if (media.length === 1) {
    const src = media[0].url
    const { type } = media[0]
    return (
      <Wrapper src={src} showActions={type !== "video"}>
        {type === "video" ? (
          <VideoPlayer
            src={src}
            controls
            autoPlay
            muted
            className="max-h-full max-w-full object-contain"
            onClick={stopPropagation}
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
    <Wrapper src={currentMedia.url} showActions={currentMedia.type !== "video"}>
      <Swiper
        ref={swiperRef}
        loop
        initialSlide={initialIndex}
        mousewheel={{
          forceToAxis: true,
        }}
        keyboard={{
          enabled: true,
        }}
        onSlideChange={({ realIndex }) => {
          setCurrentMedia(media[realIndex])
          setCurrentSlideIndex(realIndex)
        }}
        modules={[Mousewheel, Keyboard]}
        className="size-full"
      >
        {showActions && (
          <div tabIndex={-1} onClick={stopPropagation}>
            <m.button
              initial={{ opacity: 0, x: -20, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ ease: "easeInOut", duration: 0.2 }}
              onClick={() => swiperRef.current?.swiper.slidePrev()}
              type="button"
              className="center fixed left-2 top-1/2 z-[99] size-8 -translate-y-1/2 rounded-full border border-white/20 bg-neutral-900/80 text-white backdrop-blur duration-200 hover:bg-neutral-900"
            >
              <i className="i-mingcute-arrow-left-line" />
            </m.button>

            <m.button
              initial={{ opacity: 0, x: 20, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ ease: "easeInOut", duration: 0.2 }}
              onClick={() => swiperRef.current?.swiper.slideNext()}
              type="button"
              className="center fixed right-2 top-1/2 z-[99] size-8 -translate-y-1/2 rounded-full border border-white/20 bg-neutral-900/80 text-white backdrop-blur duration-200 hover:bg-neutral-900"
            >
              <i className="i-mingcute-arrow-right-line" />
            </m.button>
          </div>
        )}

        {showActions && (
          <div>
            <div className="fixed bottom-4 left-4 text-sm tabular-nums text-white/60 animate-in fade-in-0 slide-in-from-bottom-6">
              {currentSlideIndex + 1} / {media.length}
            </div>
            <div
              tabIndex={-1}
              onClick={stopPropagation}
              className="center fixed bottom-4 left-1/2 h-6 gap-2 rounded-full bg-neutral-700/90 px-4 duration-200 animate-in fade-in-0 slide-in-from-bottom-6"
            >
              {Array.from({ length: media.length })
                .fill(0)
                .map((_, index) => (
                  <button
                    onClick={() => {
                      swiperRef.current?.swiper.slideTo(index)
                    }}
                    type="button"
                    key={index}
                    className={cn(
                      "inline-block size-[6px] rounded-full",
                      currentSlideIndex === index ? "bg-white" : "bg-white/20",
                    )}
                  />
                ))}
            </div>
          </div>
        )}

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
        <div
          className="center flex-col gap-6 text-white/80"
          onClick={stopPropagation}
          tabIndex={-1}
        >
          <i className="i-mgc-close-cute-re text-[60px] text-red-400" />

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
