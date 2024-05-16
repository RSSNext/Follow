import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useCallback } from "react"
import { useToast } from "@renderer/components/ui/use-toast"

export function EntryShare({ url }: { url?: string }) {
  if (!url) return null

  const { toast } = useToast()

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(url)
    toast({
      duration: 1000,
      description: "Link copied to clipboard.",
    })
  }, [url])

  return (
    <div className="px-5 h-14 flex items-center text-lg justify-end text-zinc-500 gap-5">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger className="flex items-center my-2">
            <i
              className="i-mingcute-link-line cursor-pointer no-drag-region"
              onClick={() => copyLink()}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">Copy Link</TooltipContent>
        </Tooltip>
        <i className="i-mingcute-world-2-line cursor-pointer no-drag-region" />
        <i className="i-mingcute-share-2-line cursor-pointer no-drag-region" />
      </TooltipProvider>
    </div>
  )
}
