import { queryClient } from "@renderer/lib/query-client"
import { registerGlobalContext } from "@shared/bridge"
import { useEffect } from "react"
import { Outlet } from "react-router-dom"

import { useDark } from "./hooks/common/useDark"
import { useSettingModal } from "./modules/settings/modal/hooks"
import { RootProviders } from "./providers/root-providers"
import { handlers } from "./tipc"

function App() {
  useDark()
  const showSetting = useSettingModal()
  useEffect(() => {
    const cleanup = handlers?.invalidateQuery.listen((queryKey) => {
      queryClient.invalidateQueries({
        queryKey,
      })
    })

    registerGlobalContext({
      showSetting,
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
      <RootProviders>
        <Outlet />
      </RootProviders>
    </>
  )
}

export default App
