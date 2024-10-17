import { EventProvider } from "@follow/components/providers/event-provider.jsx"
import { StableRouterProvider } from "@follow/components/providers/stable-router-provider.jsx"
import { Toaster } from "@follow/components/ui/toast/index.jsx"
import { QueryClientProvider } from "@tanstack/react-query"
import { LazyMotion, MotionConfig } from "framer-motion"
import { Provider } from "jotai"
import { ModalStackContainer } from "rc-modal-sheet/m"
import { MobileDetector } from "rc-modal-sheet/mobile-detector"
import type { FC, PropsWithChildren } from "react"

import { queryClient } from "../lib/query-client"
import { jotaiStore } from "../lib/store"
import { UserProvider } from "./user-provider"

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
      <Provider store={jotaiStore}>
        <QueryClientProvider client={queryClient}>
          <EventProvider />
          <StableRouterProvider />
          <ModalStackContainer>
            <MobileDetector />
            <UserProvider />
            <Toaster />
            {children}
          </ModalStackContainer>
        </QueryClientProvider>
      </Provider>
    </MotionConfig>
  </LazyMotion>
)
