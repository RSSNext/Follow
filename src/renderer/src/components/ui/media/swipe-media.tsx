import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/scrollbar"

import { Media } from "@renderer/components/ui/media"
import type { MediaModel } from "@renderer/hono"
import { cn } from "@renderer/lib/utils"
import { useHover } from "@use-gesture/react"
import { uniqBy } from "lodash-es"
import { useRef, useState } from "react"
import { Mousewheel, Navigation, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import styles from "./index.module.css"

export function SwipeMedia({
  media,
  uniqueKey,
  className,
  imgClassName,
  onPreview,
}: {
  media?: MediaModel[] | null
  uniqueKey?: string
  className?: string
  imgClassName?: string
  onPreview?: (media: MediaModel[], index?: number) => void
}) {
  const uniqMedia = uniqBy(media, "url")

  const hoverRef = useRef<HTMLDivElement>(null)
  const [enableSwipe, setEnableSwipe] = useState(false)
  useHover(
    (event) => {
      if (event.active) {
        setEnableSwipe(event.active)
      }
    },
    {
      target: hoverRef,
    },
  )

  if (!media) return null
  return (
    <div
      ref={hoverRef}
      className={cn(
        "relative flex w-full items-center overflow-hidden",
        styles["swipe-wrapper"],
        className,
      )}
    >
      {enableSwipe && (uniqMedia?.length || 0) > 1 ? (
        <>
          <Swiper
            loop
            navigation={{
              prevEl: `#swiper-button-prev-${uniqueKey}`,
              nextEl: `#swiper-button-next-${uniqueKey}`,
            }}
            scrollbar={{
              hide: true,
            }}
            mousewheel={{
              forceToAxis: true,
            }}
            modules={[Navigation, Scrollbar, Mousewheel]}
            className="size-full"
          >
            {uniqMedia?.slice(0, 5).map((med, i) => (
              <SwiperSlide key={med.url}>
                <Media
                  className={cn(imgClassName, "size-full rounded-none")}
                  alt="cover"
                  src={med.url}
                  type={med.type}
                  previewImageUrl={med.preview_image_url}
                  loading="lazy"
                  proxy={{
                    width: 600,
                    height: 600,
                  }}
                  disableContextMenu
                  onClick={(e) => {
                    onPreview?.(uniqMedia, i)
                    e.stopPropagation()
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div
            id={`swiper-button-prev-${uniqueKey}`}
            className="swiper-button left-2"
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <i className="i-mgc-left-cute-fi" />
          </div>
          <div
            id={`swiper-button-next-${uniqueKey}`}
            className="swiper-button right-2"
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <i className="i-mgc-right-cute-fi" />
          </div>
        </>
      ) : uniqMedia?.length >= 1 ?
          (
            <Media
              onClick={(e) => {
                onPreview?.(uniqMedia)
                e.stopPropagation()
              }}
              className="size-full rounded-none object-cover sm:transition-transform sm:duration-300 sm:ease-in-out sm:group-hover:scale-105"
              alt="cover"
              src={uniqMedia[0].url}
              type={uniqMedia[0].type}
              previewImageUrl={uniqMedia[0].preview_image_url}
              loading="lazy"
              proxy={{
                width: 600,
                height: 600,
              }}
              disableContextMenu
            />
          ) :
          (
            <div className="relative flex aspect-video w-full items-center overflow-hidden rounded-t-2xl border-b">
              <div className="flex size-full items-center justify-center p-3 text-center sm:transition-transform sm:duration-500 sm:ease-in-out sm:group-hover:scale-105">
                <div className="text-xl font-extrabold text-zinc-600" />
              </div>
            </div>
          )}
    </div>
  )
}
