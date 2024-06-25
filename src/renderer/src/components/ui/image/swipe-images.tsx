import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/scrollbar"

import { Image } from "@renderer/components/ui/image"
import { cn } from "@renderer/lib/utils"
import { uniq } from "lodash-es"
import { useInView } from "react-intersection-observer"
import { Mousewheel, Navigation, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import styles from "./index.module.css"

export function SwipeImages({
  images,
  uniqueKey,
  className,
  imgClassName,
  onPreview,
}: {
  images?: string[] | null
  uniqueKey?: string
  className?: string
  imgClassName?: string
  onPreview?: (images: string[], index?: number) => void
}) {
  const uniqImages = uniq(images)

  const { ref, inView } = useInView()

  if (!images) return null
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full items-center overflow-hidden",
        styles["swipe-wrapper"],
        className,
      )}
    >
      {(uniqImages?.length || 0) > 1 ? (
        <>
          <Swiper
            loop
            autoplay={inView ? true : false}
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
            {uniqImages?.slice(0, 5).map((image, i) => (
              <SwiperSlide key={image}>
                <Image
                  className={cn(imgClassName, "rounded-none")}
                  alt="cover"
                  src={image}
                  loading="lazy"
                  proxy={{
                    width: 600,
                    height: 600,
                  }}
                  disableContextMenu
                  onClick={() => {
                    onPreview?.(images, i)
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
      ) : uniqImages?.length === 1 ?
          (
            <Image
              onClick={() => onPreview?.(uniqImages)}
              className="size-full rounded-none object-cover sm:transition-transform sm:duration-300 sm:ease-in-out sm:group-hover:scale-105"
              alt="cover"
              src={uniqImages[0]}
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
