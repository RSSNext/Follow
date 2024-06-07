import type { FC } from "react"
import { Mousewheel, Scrollbar, Virtual } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { useCurrentModal } from "../modal"

export const PreviewImageContent: FC<{
  images: string[]
  initialIndex?: number
}> = ({ images, initialIndex = 0 }) => {
  const { dismiss } = useCurrentModal()

  if (images.length === 0) return null
  if (images.length === 1) {
    return (
      <div className="center relative size-full p-12" onClick={dismiss}>
        <img className="size-full object-contain" alt="cover" src={images[0]} />
      </div>
    )
  }
  return (
    <div className="center relative size-full p-12" onClick={dismiss}>
      <Swiper
        initialSlide={initialIndex}
        scrollbar={{
          hide: true,
        }}
        mousewheel={{
          forceToAxis: true,
        }}
        virtual
        modules={[Scrollbar, Mousewheel, Virtual]}
        className="size-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={image} virtualIndex={index}>
            <img
              className="size-full object-contain"
              alt="cover"
              src={image}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
