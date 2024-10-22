import { LazyMotion, MotionConfig } from "framer-motion"

const loadFeatures = () => import("../framer-lazy-feature").then((res) => res.default)
export const MotionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
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
}
