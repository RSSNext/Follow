import { IN_ELECTRON } from "@follow/shared/constants"
import { cn, getOS } from "@follow/utils/utils"
import { useEffect, useLayoutEffect } from "react"
import { Outlet } from "react-router-dom"

import { queryClient } from "~/lib/query-client"

import { useAppIsReady } from "./atoms/app"
import { useUISettingKey } from "./atoms/settings/ui"
import { navigateEntry } from "./hooks/biz/useNavigateEntry"
import { applyAfterReadyCallbacks } from "./initialize/queue"
import { appLog } from "./lib/log"
import { Titlebar } from "./modules/app/Titlebar"
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

  useLayoutEffect(() => {
    // Electron app register in app scope, but web app should register in window scope
    if (IN_ELECTRON) return
    const handleOpenSettings = (e) => {
      if (e.key === "," && (e.metaKey || e.ctrlKey)) {
        window.router.showSettings()
        e.preventDefault()
      }
    }
    document.addEventListener("keydown", handleOpenSettings)

    return () => {
      document.removeEventListener("keydown", handleOpenSettings)
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

  useEffect(() => {
    const doneTime = Math.trunc(performance.now())
    window.analytics?.capture("ui_render_init", {
      time: doneTime,
    })
    appLog("App is ready", `${doneTime}ms`)

    applyAfterReadyCallbacks()
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
