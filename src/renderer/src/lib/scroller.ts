// @see https://github.com/Innei/sprightly/blob/2444dcdb789ca585337a4d241095640a524231db/src/lib/scroller.ts
import { microDampingPreset } from "@renderer/components/ui/constants/spring"
import { animateValue } from "framer-motion"

// TODO scroller lock
export const springScrollTo = (
  y: number,
  scrollerElement: HTMLElement = document.documentElement,
) => {
  const scrollTop = scrollerElement?.scrollTop

  const stopSpringScrollHandler = () => {
    animation.stop()
  }
  const el = scrollerElement || window
  const animation = animateValue({
    keyframes: [scrollTop + 1, y],
    autoplay: true,
    ...microDampingPreset,
    onPlay() {
      el.addEventListener("wheel", stopSpringScrollHandler)
      el.addEventListener("touchmove", stopSpringScrollHandler)
    },

    onUpdate(latest) {
      if (latest <= 0) {
        animation.stop()
      }

      el.scrollTo(0, latest)
    },
  })

  animation.then(() => {
    el.removeEventListener("wheel", stopSpringScrollHandler)
    el.removeEventListener("touchmove", stopSpringScrollHandler)
  })

  return animation
}

export const springScrollToElement = (
  element: HTMLElement,
  delta = 40,

  scrollerElement: HTMLElement = document.documentElement,
) => {
  const y = calculateElementTop(element)

  const to = y + delta

  return springScrollTo(to, scrollerElement)
}

const calculateElementTop = (el: HTMLElement) => {
  let top = 0
  while (el) {
    top += el.offsetTop
    el = el.offsetParent as HTMLElement
  }
  return top
}
