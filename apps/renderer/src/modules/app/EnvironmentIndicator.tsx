import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@follow/components/ui/tooltip/index.jsx"
import { env } from "@follow/shared/env"

import { useUserRole } from "~/atoms/user"

export const EnvironmentIndicator = () => {
  const role = useUserRole()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="fixed bottom-0 right-0 z-[99999] rounded-tl bg-accent px-1 py-0.5 text-xs text-white">
          {role}:{import.meta.env.MODE}
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
