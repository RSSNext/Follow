import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { Button } from "@renderer/components/ui/button"
import { Tooltip, TooltipContent } from "@renderer/components/ui/tooltip"

export const WithdrawButton = () => (
  <Tooltip>
    <TooltipTrigger>
      <Button
        variant="primary"
        disabled={true}
      >
        Withdraw
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      Comming soon
    </TooltipContent>
  </Tooltip>
)
