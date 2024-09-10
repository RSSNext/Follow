import { ModalStackProvider } from "@renderer/components/ui/modal"
import { Toaster } from "@renderer/components/ui/sonner"
import { HotKeyScopeMap } from "@renderer/constants"
import { jotaiStore } from "@renderer/lib/jotai"
import { persistConfig, queryClient } from "@renderer/lib/query-client"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { LazyMotion, MotionConfig } from "framer-motion"
import { Provider } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { HotkeysProvider } from "react-hotkeys-hook"

import { ContextMenuProvider } from "./context-menu-provider"
import { EventProvider } from "./event-provider"
import { InvalidateQueryProvider } from "./invalidate-query-provider"
import { StableRouterProvider } from "./stable-router-provider"
import { SettingSync } from "./ui-setting-sync"
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
      <PersistQueryClientProvider persistOptions={persistConfig} client={queryClient}>
        <HotkeysProvider initiallyActiveScopes={HotKeyScopeMap.Home}>
          <Provider store={jotaiStore}>
            <EventProvider />
            <UserProvider />
            <SettingSync />
            <ModalStackProvider />
            <ContextMenuProvider />
            <StableRouterProvider />
            {import.meta.env.DEV && <Devtools />}
            {children}
          </Provider>
        </HotkeysProvider>

        <InvalidateQueryProvider />
      </PersistQueryClientProvider>
    </MotionConfig>
    <Toaster />
  </LazyMotion>
)

const Devtools = () => (
  <>
    {!window.electron && <ReactQueryDevtools buttonPosition="bottom-left" client={queryClient} />}
  </>
)
