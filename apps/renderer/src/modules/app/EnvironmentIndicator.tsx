import { env } from "@follow/shared/env"

import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"

export const EnvironmentIndicator = () => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="fixed bottom-0 right-0 z-[99999] rounded-tl bg-accent px-1 py-0.5 text-xs text-white">
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
