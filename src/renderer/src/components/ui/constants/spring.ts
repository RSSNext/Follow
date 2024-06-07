import type { Spring } from "framer-motion"

export const reboundPreset: Spring = {
  type: "spring",
  bounce: 10,
  stiffness: 140,
  damping: 8,
}

export const microDampingPreset: Spring = {
  type: "spring",
  damping: 24,
}

export const microReboundPreset: Spring = {
  type: "spring",
  stiffness: 300,
  damping: 20,
}

export const softSpringPreset: Spring = {
  duration: 0.35,
  type: "spring",
  stiffness: 120,
  damping: 20,
}

export const softBouncePreset: Spring = {
  type: "spring",
  damping: 10,
  stiffness: 100,
}
