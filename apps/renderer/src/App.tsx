import type { URLOpenListenerEvent } from "@capacitor/app"
import { App as CapacitorApp } from "@capacitor/app"
import { CapacitorHttp } from "@capacitor/core"
import { isMobile } from "@follow/components/hooks/useMobile.js"
import { IN_ELECTRON } from "@follow/shared/constants"
import { env } from "@follow/shared/env"
import { cn, getOS } from "@follow/utils/utils"
import { useEffect } from "react"
import { Outlet } from "react-router"
import { toast } from "sonner"

import { queryClient } from "~/lib/query-client"

import { useAppIsReady } from "./atoms/app"
import { useUISettingKey } from "./atoms/settings/ui"
import { navigateEntry } from "./hooks/biz/useNavigateEntry"
import { applyAfterReadyCallbacks } from "./initialize/queue"
import { removeAppSkeleton } from "./lib/app"
import { appLog } from "./lib/log"
import { Titlebar } from "./modules/app/Titlebar"
import { useRegisterFollowCommands } from "./modules/command/use-register-follow-commands"
import { RootProviders } from "./providers/root-providers"
import { handlers } from "./tipc"

function App() {
  useEffect(() => {
    const cleanup = handlers?.invalidateQuery.listen((queryKey) => {
      queryClient.invalidateQueries({
        queryKey,
      })
    })

    handlers?.navigateEntry.listen((options) => {
      navigateEntry(options)
    })

    return cleanup
  }, [])

  useEffect(() => {
    CapacitorApp.addListener("appUrlOpen", async (event: URLOpenListenerEvent) => {
      const authUrl = new URL(event.url)
      const token = authUrl.searchParams.get("token")
      if (token) {
        try {
          await CapacitorHttp.get({
            url: `${env.VITE_API_URL}/auth/session`,
            headers: {
              Cookie: `authjs.session-token=${token}`,
            },
          })
        } catch (e) {
          toast.error(`Login failed ${e}`)
        }
      }
    })

    return () => {
      CapacitorApp.removeAllListeners()
    }
  }, [])

  const windowsElectron = IN_ELECTRON && getOS() === "Windows"
  return (
    <RootProviders>
      {IN_ELECTRON && (
        <div
          className={cn(
            "drag-region fixed inset-x-0 top-0 h-12 shrink-0",
            windowsElectron && "pointer-events-none z-[9999]",
          )}
          aria-hidden
        >
          {windowsElectron && <Titlebar />}
        </div>
      )}

      <AppLayer />
    </RootProviders>
  )
}

const AppLayer = () => {
  const appIsReady = useAppIsReady()

  useRegisterFollowCommands()
  useEffect(() => {
    removeAppSkeleton()

    const doneTime = Math.trunc(performance.now())
    window.analytics?.capture("ui_render_init", {
      time: doneTime,
    })
    appLog("App is ready", `${doneTime}ms`)

    applyAfterReadyCallbacks()

    if (isMobile()) {
      const handler = (e: MouseEvent) => {
        e.preventDefault()
      }
      document.addEventListener("contextmenu", handler)

      return () => {
        document.removeEventListener("contextmenu", handler)
      }
    }
  }, [appIsReady])

  return appIsReady ? <Outlet /> : <AppSkeleton />
}

const AppSkeleton = () => {
  const entryColWidth = useUISettingKey("entryColWidth")
  const feedColWidth = useUISettingKey("feedColWidth")
  return (
    <div className="flex size-full">
      <div
        className="h-full shrink-0"
        style={{
          width: `${feedColWidth}px`,
        }}
      />
      <div className="relative size-full grow bg-theme-background">
        <div className="absolute inset-y-0 w-px bg-border" style={{ left: entryColWidth }} />
      </div>
    </div>
  )
}

export { App as Component }
