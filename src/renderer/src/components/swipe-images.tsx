import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/scrollbar"

import { Image } from "@renderer/components/ui/image"
import { cn } from "@renderer/lib/utils"
import { Mousewheel, Navigation, Scrollbar } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

export function SwipeImages({
  images,
  uniqueKey,
  className,
  imgClassName,
}: {
  images?: string[] | null
  uniqueKey?: string
  className?: string
  imgClassName?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden flex items-center relative w-full",
        className,
      )}
    >
      {(images?.length || 0) > 1 ?
          (
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
                {images?.slice(0, 5).map((image) => (
                  <SwiperSlide key={image}>
                    <Image
                      className={cn(
                        imgClassName,
                      )}
                      alt="cover"
                      src={image}
                      loading="lazy"
                      proxy={{
                        width: 600,
                        height: 600,
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
                <i className="i-mingcute-left-fill" />
              </div>
              <div
                id={`swiper-button-next-${uniqueKey}`}
                className="swiper-button right-2"
                onDoubleClick={(e) => e.stopPropagation()}
              >
                <i className="i-mingcute-right-fill" />
              </div>
            </>
          ) :
        images?.length === 1 ?
            (
              <Image
                className="object-cover size-full sm:group-hover:scale-105 sm:transition-transform sm:duration-300 sm:ease-in-out"
                alt="cover"
                src={images[0]}
                width={624}
                height={351}
              >
              </Image>
            ) :
            (
              <div className="rounded-t-2xl overflow-hidden flex items-center relative w-full aspect-video border-b">
                <div className="sm:group-hover:scale-105 sm:transition-transform sm:duration-500 sm:ease-in-out p-3 size-full text-center flex items-center justify-center">
                  <div className="text-zinc-600 text-xl font-extrabold">
                  </div>
                </div>
              </div>
            )}
    </div>
  )
}
