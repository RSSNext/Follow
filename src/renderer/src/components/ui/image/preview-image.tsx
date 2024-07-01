import { m } from "@renderer/components/common/Motion"
import { stopPropagation } from "@renderer/lib/dom"
import type { FC } from "react"
import { useState } from "react"
import { Mousewheel, Scrollbar, Virtual } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import { ActionButton } from "../button"
import {
  microReboundPreset,
} from "../constants/spring"
import { useCurrentModal } from "../modal"

const Wrapper: Component<{
  src: string
}> = ({ children, src }) => {
  const { dismiss } = useCurrentModal()

  return (
    <div className="center relative size-full p-12" onClick={dismiss}>
      <m.div
        className="size-full"
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
        className="absolute bottom-4 right-4"
        onClick={stopPropagation}
      >
        <ActionButton
          tooltip="Open in browser"
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
export const PreviewImageContent: FC<{
  images: string[]
  initialIndex?: number
}> = ({ images, initialIndex = 0 }) => {
  const [currentSrc, setCurrentSrc] = useState(images[initialIndex])

  if (images.length === 0) return null
  if (images.length === 1) {
    const src = images[0]
    return (
      <Wrapper src={src}>
        <img className="size-full object-contain" alt="cover" src={src} />
      </Wrapper>
    )
  }
  return (
    <Wrapper src={currentSrc}>
      <Swiper
        initialSlide={initialIndex}
        scrollbar={{
          hide: true,
        }}
        mousewheel={{
          forceToAxis: true,
        }}
        virtual
        onSlideChange={({ realIndex }) => {
          setCurrentSrc(images[realIndex])
        }}
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
    </Wrapper>
  )
}
