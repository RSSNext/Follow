import { setUpdaterStatus, useUpdaterStatus } from "@renderer/atoms/updater"
import { tipcClient } from "@renderer/lib/client"
import { handlers } from "@renderer/tipc"
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
    tipcClient?.quitAndInstall()
  }, [])

  if (!updaterStatus) return null

  return (
    <div
      className="absolute inset-x-3 bottom-3 rounded-xl bg-white/80 py-3 text-center text-sm shadow"
      onClick={handleClick}
    >
      <div className="font-medium">Follow is ready to update!</div>
      <div className="text-xs text-zinc-500">Click to restart</div>
    </div>
  )
}
