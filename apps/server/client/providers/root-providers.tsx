import { MotionProvider } from "@follow/components/common/MotionProvider.jsx"
import { EventProvider } from "@follow/components/providers/event-provider.jsx"
import { StableRouterProvider } from "@follow/components/providers/stable-router-provider.jsx"
import { Toaster } from "@follow/components/ui/toast/index.jsx"
import { QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "jotai"
import { ModalStackContainer } from "rc-modal-sheet/m"
import type { FC, PropsWithChildren } from "react"

import { queryClient } from "../lib/query-client"
import { jotaiStore } from "../lib/store"
import { OpenInAppDetector } from "./open-in-app-provider"
import { UserProvider } from "./user-provider"

export const RootProviders: FC<PropsWithChildren> = ({ children }) => (
  <MotionProvider>
    <Provider store={jotaiStore}>
      <QueryClientProvider client={queryClient}>
        <EventProvider />
        <StableRouterProvider />
        <ModalStackContainer>
          <OpenInAppDetector />

          <UserProvider />
          <Toaster />
          {children}
        </ModalStackContainer>
      </QueryClientProvider>
    </Provider>
  </MotionProvider>
)
