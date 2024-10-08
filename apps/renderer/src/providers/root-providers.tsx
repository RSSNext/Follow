import { IN_ELECTRON } from "@follow/shared/constants"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { LazyMotion, MotionConfig } from "framer-motion"
import { Provider } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { HotkeysProvider } from "react-hotkeys-hook"

import { LottieRenderContainer } from "~/components/ui/lottie-container"
import { ModalStackProvider } from "~/components/ui/modal"
import { Toaster } from "~/components/ui/sonner"
import { HotKeyScopeMap } from "~/constants"
import { jotaiStore } from "~/lib/jotai"
import { persistConfig, queryClient } from "~/lib/query-client"
import { FeatureFlagDebugger } from "~/modules/ab/providers"

import { ContextMenuProvider } from "./context-menu-provider"
import { EventProvider } from "./event-provider"
import { ExtensionExposeProvider } from "./extension-expose-provider"
import { I18nProvider } from "./i18n-provider"
import { InvalidateQueryProvider } from "./invalidate-query-provider"
import { SettingSync } from "./setting-sync"
import { StableRouterProvider } from "./stable-router-provider"
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
            <I18nProvider>
              <ExtensionExposeProvider />
              <EventProvider />
              <UserProvider />
              <SettingSync />
              <ModalStackProvider />
              <ContextMenuProvider />
              <LottieRenderContainer />
              <StableRouterProvider />
              <FeatureFlagDebugger />
              {import.meta.env.DEV && <Devtools />}
              {children}
              <Toaster />
            </I18nProvider>
          </Provider>
        </HotkeysProvider>

        <InvalidateQueryProvider />
      </PersistQueryClientProvider>
    </MotionConfig>
  </LazyMotion>
)

const Devtools = () => (
  <>{!IN_ELECTRON && <ReactQueryDevtools buttonPosition="bottom-left" client={queryClient} />}</>
)
