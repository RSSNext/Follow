import { setUpdaterStatus, useUpdaterStatus } from "@renderer/atoms/updater"
import { softBouncePreset } from "@renderer/components/ui/constants/spring"
import { tipcClient } from "@renderer/lib/client"
import { handlers } from "@renderer/tipc"
import { m } from "framer-motion"
import { useCallback, useEffect } from "react"

export const AutoUpdater = () => {
  const updaterStatus = useUpdaterStatus()

  useEffect(() => {
    const unlisten = handlers?.updateDownloaded.listen(() => {
      setUpdaterStatus(true)
    })
    return unlisten
  }, [])

  const handleClick = useCallback(() => {
    setUpdaterStatus(false)
    window.posthog?.capture("update_restart")

    tipcClient?.quitAndInstall()
  }, [])

  if (!updaterStatus) return null

  return (
    <m.div
      className="absolute inset-x-3 bottom-3 rounded-lg bg-theme-modal-background py-3 text-center text-sm shadow backdrop-blur"
      onClick={handleClick}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={softBouncePreset}
    >
      <div className="font-medium">
        {APP_NAME}
        {" "}
        is ready to update!
      </div>
      <div className="text-xs text-zinc-500">Click to restart</div>
    </m.div>
  )
}
