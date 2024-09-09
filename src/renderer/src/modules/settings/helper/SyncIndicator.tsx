import { PhCloudCheck } from "@renderer/components/icons/PhCloudCheck"
import { PhCloudX } from "@renderer/components/icons/PhCloudX"
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip"
import { useAuthQuery, useIsOnline } from "@renderer/hooks/common"
import { settings } from "@renderer/queries/settings"
import { useEffect, useRef } from "react"

import { settingSyncQueue } from "./sync-queue"

export const SyncIndicator = () => {
  const { data: remoteSettings, isLoading } = useAuthQuery(settings.get(), {})

  const isOnline = useIsOnline()
  const onceRef = useRef(false)
  useEffect(() => {
    if (!isLoading && remoteSettings && !onceRef.current) {
      const hasSetting = JSON.stringify(remoteSettings.settings) !== "{}"
      onceRef.current = true
      if (hasSetting) {
        return
      }
      // Replace local to remote
      settingSyncQueue.replaceRemote()
    }
  }, [remoteSettings, isLoading])

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="center absolute right-2 size-5">
          {isOnline ? <PhCloudCheck className="size-4" /> : <PhCloudX className="size-4" />}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center text-xs">{isOnline ? "Synced with server" : "Offline"}</div>
      </TooltipContent>
    </Tooltip>
  )
}
