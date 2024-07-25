import { env } from "@env"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { tipcClient } from "@renderer/lib/client"

export const EnvironmentIndicator = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div
        onClick={() => {
          tipcClient?.updateUnreadCount()
        }}
        className="fixed bottom-0 left-0 rounded-tr bg-theme-accent px-1 py-0.5 text-xs text-white"
      >
        {import.meta.env.MODE}
      </div>
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent className="max-w-max break-all" side="top">
        <pre>{JSON.stringify({ ...env }, null, 2)}</pre>
      </TooltipContent>
    </TooltipPortal>
  </Tooltip>
)
