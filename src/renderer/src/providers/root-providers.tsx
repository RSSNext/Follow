import { SessionProvider } from "@hono/auth-js/react"
import { Toaster } from "@renderer/components/ui/toaster"
import { TooltipProvider } from "@renderer/components/ui/tooltip"
import { jotaiStore } from "@renderer/lib/jotai"
import { queryClient } from "@renderer/lib/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { LazyMotion, MotionConfig } from "framer-motion"
import { Provider } from "jotai"
import type { FC, PropsWithChildren } from "react"

const loadFeatures = () =>
  import("../framer-lazy-feature").then((res) => res.default)
export const RootProviders: FC<PropsWithChildren> = (props) => (
  <LazyMotion features={loadFeatures} strict key="framer">
    <MotionConfig
      transition={{
        type: "tween",
        duration: 0.15,
        ease: "easeInOut",
      }}
    >
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Provider store={jotaiStore}>{props.children}</Provider>
          </TooltipProvider>
        </QueryClientProvider>
      </SessionProvider>
    </MotionConfig>
    <Toaster />
  </LazyMotion>
)
