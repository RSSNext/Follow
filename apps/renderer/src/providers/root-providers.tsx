import { IN_ELECTRON } from "@follow/shared/constants"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { LazyMotion, MotionConfig } from "framer-motion"
import { Provider } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { Suspense } from "react"
import { HotkeysProvider } from "react-hotkeys-hook"

import { Toaster } from "~/components/ui/sonner"
import { HotKeyScopeMap } from "~/constants/hotkeys"
import { jotaiStore } from "~/lib/jotai"
import { persistConfig, queryClient } from "~/lib/query-client"

import { EventProvider } from "./event-provider"
import { I18nProvider } from "./i18n-provider"
import { InvalidateQueryProvider } from "./invalidate-query-provider"
import {
  LazyContextMenuProvider,
  LazyExtensionExposeProvider,
  LazyFeatureFlagDebugger,
  LazyLottieRenderContainer,
  LazyModalStackProvider,
  // specific import should add `index` postfix
} from "./lazy/index"
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
              <EventProvider />

              <UserProvider />

              <StableRouterProvider />
              <SettingSync />

              {import.meta.env.DEV && <Devtools />}
              {children}

              <Suspense>
                <LazyExtensionExposeProvider />
                <LazyModalStackProvider />
                <LazyContextMenuProvider />
                <LazyLottieRenderContainer />
                <LazyFeatureFlagDebugger />
              </Suspense>
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
