import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"

export const EnvironmentIndicator = () => (
  <Tooltip>
    <TooltipTrigger>
      <div className="fixed bottom-0 left-0 rounded-tr bg-theme-accent px-1 py-0.5 text-xs text-white">
        {import.meta.env.MODE}
      </div>
    </TooltipTrigger>
    <TooltipContent>{import.meta.env.BASE_URL}</TooltipContent>
  </Tooltip>
)
