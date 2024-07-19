import { ModalStackProvider } from "@renderer/components/ui/modal"
import { Toaster } from "@renderer/components/ui/sonner"
import { TooltipProvider } from "@renderer/components/ui/tooltip"
import { jotaiStore } from "@renderer/lib/jotai"
import { persistConfig, queryClient } from "@renderer/lib/query-client"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { LazyMotion, MotionConfig } from "framer-motion"
import { Provider } from "jotai"
import type { FC, PropsWithChildren } from "react"

import { ContextMenuProvider } from "./context-menu-provider"
import { StableRouterProvider } from "./stable-router-provider"
import { SettingSync } from "./ui-setting-sync"
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
            <SettingSync />
            <ModalStackProvider />
            <ContextMenuProvider />
            <StableRouterProvider />
            {import.meta.env.DEV && <Devtools />}
            {children}
          </Provider>
        </TooltipProvider>
      </PersistQueryClientProvider>
    </MotionConfig>
    <Toaster />
  </LazyMotion>
)

const Devtools = () => (
  <>
    {!ELECTRON && <ReactQueryDevtools buttonPosition="bottom-left" client={queryClient} />}
  </>
)
