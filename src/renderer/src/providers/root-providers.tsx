import { ModalStackProvider } from "@renderer/components/ui/modal"
import { Toaster } from "@renderer/components/ui/sonner"
import { TooltipProvider } from "@renderer/components/ui/tooltip"
import { jotaiStore } from "@renderer/lib/jotai"
import { persistConfig, queryClient } from "@renderer/lib/query-client"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { LazyMotion, MotionConfig } from "framer-motion"
import { Provider } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { HelmetProvider } from "react-helmet-async"

import { StableRouterProvider } from "./biz-router-provider"
import { ContextMenuProvider } from "./context-menu-provider"
import { UISettingInitialize } from "./ui-setting-Initialize"
import { UserProvider } from "./user-provider"

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
      <PersistQueryClientProvider
        persistOptions={persistConfig}
        client={queryClient}
      >
        <TooltipProvider>
          <Provider store={jotaiStore}>
            <UserProvider />
            <UISettingInitialize />
            <ModalStackProvider />
            <ContextMenuProvider />
            <HelmetProvider>{children}</HelmetProvider>
            <StableRouterProvider />
          </Provider>
        </TooltipProvider>
      </PersistQueryClientProvider>
    </MotionConfig>
    <Toaster />
  </LazyMotion>
)
