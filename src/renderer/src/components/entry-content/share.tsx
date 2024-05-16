import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useCallback } from "react"
import { useToast } from "@renderer/components/ui/use-toast"
import { cn } from "@renderer/lib/utils"

const items = [
  {
    name: "Copy Link",
    className: "i-mingcute-link-line",
    action: "copyLink",
  },
  {
    name: "Open in Browser",
    className: "i-mingcute-world-2-line",
    action: "openInBrowser",
  },
  {
    name: "Share",
    className: "i-mingcute-share-2-line",
    action: "share",
  },
]

export function EntryShare({ url }: { url?: string }) {
  if (!url) return null

  const { toast } = useToast()

  const execAction = useCallback(
    (action: string) => {
      switch (action) {
        case "copyLink":
          navigator.clipboard.writeText(url)
          toast({
            duration: 1000,
            description: "Link copied to clipboard.",
          })
          break
        case "openInBrowser":
          window.open(url, "_blank")
          break
        case "share":
          window.electron.ipcRenderer.send("share-url", url)
          break
      }
    },
    [url],
  )

  return (
    <div className="px-5 h-14 flex items-center text-lg justify-end text-zinc-500 gap-5">
      <TooltipProvider delayDuration={300}>
        {items.map((item) => (
          <Tooltip>
            <TooltipTrigger className="flex items-center my-2">
              <i
                className={cn(item.className, "cursor-pointer no-drag-region")}
                onClick={() => execAction(item.action)}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">{item.name}</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
