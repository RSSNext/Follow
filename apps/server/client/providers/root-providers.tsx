import { LazyMotion, MotionConfig } from "framer-motion"
import type { FC, PropsWithChildren } from "react"

const loadFeatures = () => import("../framer-lazy-feature").then((res) => res.default)
export const RootProviders: FC<PropsWithChildren> = ({ children }) => (
  <LazyMotion features={loadFeatures} strict key="framer">
    <MotionConfig
      transition={{
        type: "tween",
        duration: 0.15,
        ease: "easeInOut",
      }}
    >
      {children}
    </MotionConfig>
  </LazyMotion>
)
