import { env } from "@env"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"

export const EnvironmentIndicator = () => {
  const show = !import.meta.env.PROD || globalThis["__DEBUG_PROXY__"]
  if (!show) return null
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="fixed bottom-0 left-0 rounded-tr bg-theme-accent px-1 py-0.5 text-xs text-white">
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
}
