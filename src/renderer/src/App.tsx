import { queryClient } from "@renderer/lib/query-client"
import { registerGlobalContext } from "@shared/bridge"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { toast } from "sonner"

import { useAppIsReady } from "./atoms/app"
import { useUISettingKey } from "./atoms/settings/ui"
import { useDark } from "./hooks/common/useDark"
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

    registerGlobalContext({
      showSetting: window.router.showSettings,
      toast,
    })
    return cleanup
  }, [])

  return (
    <>
      {window.electron && (
        <div
          className="drag-region absolute inset-x-0 top-0 h-12 shrink-0"
          aria-hidden
        />
      )}
      <RootProviders><AppLayer /></RootProviders>
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
