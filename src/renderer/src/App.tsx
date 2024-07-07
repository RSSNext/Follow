import { queryClient } from "@renderer/lib/query-client"
import { useEffect, useLayoutEffect } from "react"
import { Outlet } from "react-router-dom"

import { useAppIsReady } from "./atoms/app"
import { useUISettingKey } from "./atoms/settings/ui"
import { useDark } from "./hooks/common/useDark"
import { tipcClient } from "./lib/client"
import { getOS } from "./lib/utils"
import { RootProviders } from "./providers/root-providers"
import { handlers } from "./tipc"

function App() {
  useDark()

  useEffect(() => {
    const cleanup = handlers?.invalidateQuery.listen((queryKey) => {
      queryClient.invalidateQueries({
        queryKey,
      })
    })

    return cleanup
  }, [])

  useLayoutEffect(() => {
    // Electron app register in app scope, but web app should register in window scope
    if (window.electron) return
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
  const windowsElectron = window.electron && getOS() === "Windows"
  return (
    <>
      {window.electron && !windowsElectron && (
        <div
          className="drag-region absolute inset-x-0 top-0 h-12 shrink-0"
          aria-hidden
        />
      )}
      {windowsElectron && (
        <div className="drag-region fixed top-0 z-[99999] flex h-[24px] w-full items-center justify-end bg-background">

          <button
            className="no-drag-region p-2"
            onClick={() => {
              tipcClient?.windowAction({ action: "minimize" })
            }}
          >
            x
          </button>
          <button
            className="no-drag-region p-2"
            onClick={() => {
              tipcClient?.windowAction({ action: "maximum" })
            }}
          >
            x
          </button>
          <button
            className="no-drag-region p-2"
            onClick={() => {
              tipcClient?.windowAction({ action: "close" })
            }}
          >
            x
          </button>
        </div>
      )}
      <RootProviders>
        <AppLayer />
      </RootProviders>
    </>
  )
}

const AppLayer = () => {
  const appIsReady = useAppIsReady()

  return appIsReady ? <Outlet /> : <AppSkeleton />
}

const AppSkeleton = () => {
  const entryColWidth = useUISettingKey("entryColWidth")
  return (
    <div className="flex size-full">
      <div className="h-full w-64 shrink-0" />
      <div className="relative size-full grow bg-theme-background">
        <div
          className="absolute inset-y-0 w-px bg-border"
          style={{ left: entryColWidth }}
        />
      </div>
    </div>
  )
}
export default App
