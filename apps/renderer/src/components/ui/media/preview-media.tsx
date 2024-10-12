import { IN_ELECTRON } from "@follow/shared/constants"
import type { MediaModel } from "@follow/shared/hono"
import type { FC } from "react"
import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { Blurhash } from "react-blurhash"
import { useTranslation } from "react-i18next"
import { Keyboard, Mousewheel } from "swiper/modules"
import type { SwiperRef } from "swiper/react"
import { Swiper, SwiperSlide } from "swiper/react"

import { m } from "~/components/common/Motion"
import { COPY_MAP } from "~/constants"
import { tipcClient } from "~/lib/client"
import { stopPropagation } from "~/lib/dom"
import { replaceImgUrlIfNeed } from "~/lib/img-proxy"
import { cn } from "~/lib/utils"
import { EntryContent } from "~/modules/entry-content"

import { ActionButton, MotionButtonBase } from "../button"
import { microReboundPreset } from "../constants/spring"
import { useCurrentModal } from "../modal"
import { RootPortal } from "../portal"
import { VideoPlayer } from "./VideoPlayer"

const Wrapper: Component<{
  src: string
  showActions?: boolean
  entryId?: string
}> = ({ children, src, showActions, entryId }) => {
  const { dismiss } = useCurrentModal()
  const { t } = useTranslation(["shortcuts", "external"])

  return (
    <div className="center relative size-full px-20 pb-8 pt-10" onClick={dismiss}>
      <m.div
        className="center flex size-full"
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={microReboundPreset}
      >
        <div
          className={cn(
            "relative flex h-full w-auto overflow-hidden",
            entryId ? "min-w-96 items-center justify-center rounded-l-xl bg-native" : "rounded-xl",
          )}
        >
          {children}
          <RootPortal to={entryId ? null : undefined}>
            <div
              className="pointer-events-auto absolute bottom-4 right-4 z-[99] flex gap-3 text-white/70 [&_button]:hover:text-white"
              onClick={stopPropagation}
            >
              {showActions && (
                <Fragment>
                  {IN_ELECTRON && (
                    <ActionButton
                      tooltip={t("external:header.download")}
                      onClick={() => {
                        tipcClient?.download(src)
                      }}
                    >
                      <i className="i-mgc-download-2-cute-re" />
                    </ActionButton>
                  )}
                  <ActionButton
                    tooltip={t(COPY_MAP.OpenInBrowser())}
                    onClick={() => {
                      window.open(src)
                    }}
                  >
                    <i className="i-mgc-external-link-cute-re" />
                  </ActionButton>
                </Fragment>
              )}
            </div>
          </RootPortal>
        </div>
        {entryId && (
          <div
            className="box-border flex h-full w-[400px] min-w-0 shrink-0 flex-col rounded-r-xl bg-theme-background px-2 pt-1"
            onClick={stopPropagation}
          >
            <EntryContent entryId={entryId} noMedia compact />
          </div>
        )}
      </m.div>
    </div>
  )
}

export interface PreviewMediaProps extends MediaModel {
  fallbackUrl?: string
}
export const PreviewMediaContent: FC<{
  media: PreviewMediaProps[]
  initialIndex?: number
  entryId?: string
}> = ({ media, initialIndex = 0, entryId }) => {
  const [currentMedia, setCurrentMedia] = useState(media[initialIndex])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialIndex)
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
      <Wrapper src={src} showActions={type !== "video"} entryId={entryId}>
        {type === "video" ? (
          <VideoPlayer
            src={src}
            controls
            autoPlay
            muted
            className={cn("h-full w-auto object-contain", entryId && "rounded-l-xl")}
            onClick={stopPropagation}
          />
        ) : (
          <FallbackableImage
            fallbackUrl={media[0].fallbackUrl}
            containerClassName="w-auto"
            className="h-full w-auto object-contain"
            alt="cover"
            src={src}
            height={media[0].height}
            width={media[0].width}
            blurhash={media[0].blurhash}
          />
        )}
      </Wrapper>
    )
  }
  return (
    <Wrapper src={currentMedia.url} showActions={currentMedia.type !== "video"} entryId={entryId}>
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
        className="h-full w-auto"
      >
        {showActions && (
          <div tabIndex={-1} onClick={stopPropagation}>
            <m.button
              initial={{ opacity: 0, x: -20, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ ease: "easeInOut", duration: 0.2 }}
              onClick={() => swiperRef.current?.swiper.slidePrev()}
              type="button"
              className="center absolute left-2 top-1/2 z-[99] size-8 -translate-y-1/2 rounded-full border border-white/20 bg-neutral-900/80 text-white backdrop-blur duration-200 hover:bg-neutral-900"
            >
              <i className="i-mingcute-arrow-left-line" />
            </m.button>

            <m.button
              initial={{ opacity: 0, x: 20, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ ease: "easeInOut", duration: 0.2 }}
              onClick={() => swiperRef.current?.swiper.slideNext()}
              type="button"
              className="center absolute right-2 top-1/2 z-[99] size-8 -translate-y-1/2 rounded-full border border-white/20 bg-neutral-900/80 text-white backdrop-blur duration-200 hover:bg-neutral-900"
            >
              <i className="i-mingcute-arrow-right-line" />
            </m.button>
          </div>
        )}

        {showActions && (
          <div>
            <div className="absolute bottom-4 left-4 text-sm tabular-nums text-white/60 animate-in fade-in-0 slide-in-from-bottom-6">
              {currentSlideIndex + 1} / {media.length}
            </div>
            <div
              tabIndex={-1}
              onClick={stopPropagation}
              className="center absolute bottom-4 left-1/2 z-[99] h-6 -translate-x-1/2 gap-2 rounded-full bg-neutral-700/90 px-4 duration-200 animate-in fade-in-0 slide-in-from-bottom-6"
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
          <SwiperSlide key={med.url} virtualIndex={index} className="center !flex">
            {med.type === "video" ? (
              <VideoPlayer
                src={med.url}
                autoPlay
                muted
                controls
                className="size-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <FallbackableImage
                fallbackUrl={med.fallbackUrl}
                className="size-full object-contain"
                alt="cover"
                src={med.url}
                loading="lazy"
                height={med.height}
                width={med.width}
                blurhash={med.blurhash}
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
    containerClassName?: string
    fallbackUrl?: string
    blurhash?: string
  }
> = ({ src, onError, fallbackUrl, containerClassName, blurhash, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(() => replaceImgUrlIfNeed(src))
  const [isAllError, setIsAllError] = useState(false)

  const [isLoading, setIsLoading] = useState(true)

  const [currentState, setCurrentState] = useState<"proxy" | "origin" | "fallback">(() =>
    currentSrc === src ? "origin" : "proxy",
  )

  const handleError = useCallback(() => {
    switch (currentState) {
      case "proxy": {
        if (currentSrc !== src) {
          setCurrentSrc(src)
          setCurrentState("origin")
        } else {
          if (fallbackUrl) {
            setCurrentSrc(fallbackUrl)
            setCurrentState("fallback")
          }
        }

        break
      }
      case "origin": {
        if (fallbackUrl) {
          setCurrentSrc(fallbackUrl)
          setCurrentState("fallback")
        } else {
          setIsAllError(true)
        }
        break
      }
      case "fallback": {
        setIsAllError(true)
      }
    }
  }, [currentSrc, currentState, fallbackUrl, src])

  const height = Number.parseInt(props.height as string)
  const width = Number.parseInt(props.width as string)
  return (
    <div className={cn("center flex size-full flex-col", containerClassName)}>
      {isLoading && !isAllError && (
        // FIXME: optimize this if image load, the placeholder background will flash
        <div className="center absolute inset-0 size-full">
          {blurhash ? (
            <div style={{ aspectRatio: `${props.width} / ${props.height}` }} className="w-full">
              <Blurhash hash={blurhash} resolutionX={32} resolutionY={32} className="!size-full" />
            </div>
          ) : (
            <i className="i-mgc-loading-3-cute-re size-8 animate-spin text-white/80" />
          )}
        </div>
      )}
      {!isAllError && (
        <img
          data-blurhash={blurhash}
          src={currentSrc}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
          height={props.height}
          width={props.width}
          {...props}
          className={cn(
            blurhash && !isLoading ? "duration-500 ease-in-out animate-in fade-in-0" : "",
            props.className,
          )}
          style={
            Number.isNaN(height) || Number.isNaN(width) || height === 0 || width === 0
              ? props.style
              : {
                  maxHeight: `min(100%, ${height}px)`,
                  maxWidth: `min(100%, ${width}px)`,
                  ...props.style,
                }
          }
        />
      )}
      {isAllError && (
        <div
          className="center pointer-events-none absolute inset-0 flex-col gap-6 text-white/80"
          onClick={stopPropagation}
          tabIndex={-1}
        >
          <i className="i-mgc-close-cute-re text-[60px] text-red-400" />

          <span>Failed to load image</span>
          <div className="center gap-4">
            <MotionButtonBase
              className="pointer-events-auto underline underline-offset-4"
              onClick={() => {
                setCurrentSrc(replaceImgUrlIfNeed(src))
                setIsAllError(false)
              }}
            >
              Retry
            </MotionButtonBase>
            or
            <a
              className="pointer-events-auto underline underline-offset-4"
              href={src}
              target="_blank"
              rel="noreferrer"
            >
              Visit Original
            </a>
          </div>
        </div>
      )}

      {currentState === "fallback" && (
        <div className="mt-4 text-center text-xs text-white/60">
          <span>
            This image is preview in low quality, because the original image is not available.
          </span>
          <br />
          <span>
            You can{" "}
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="underline duration-200 hover:text-accent"
            >
              visit the original image
            </a>{" "}
            if you want to see the full quality.
          </span>
        </div>
      )}
    </div>
  )
}
