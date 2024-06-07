import { SessionProvider } from "@hono/auth-js/react"
import { ModalStackProvider } from "@renderer/components/ui/modal"
import { Toaster } from "@renderer/components/ui/toaster"
import { TooltipProvider } from "@renderer/components/ui/tooltip"
import { jotaiStore } from "@renderer/lib/jotai"
import { queryClient } from "@renderer/lib/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { LazyMotion, MotionConfig } from "framer-motion"
import { Provider } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"

const loadFeatures = () =>
  import("../framer-lazy-feature").then((res) => res.default)
export const RootProviders: FC<PropsWithChildren> = ({ children }) => (
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
            <Provider store={jotaiStore}>
              <ModalStackProvider />
              <HelmetProvider>{children}</HelmetProvider>
            </Provider>
          </TooltipProvider>
        </QueryClientProvider>
      </SessionProvider>
    </MotionConfig>
    <Toaster />
  </LazyMotion>
)
