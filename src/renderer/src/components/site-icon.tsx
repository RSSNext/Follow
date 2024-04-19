import { cn } from "@renderer/lib/utils"

export function SiteIcon({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  return (
    <img
      src={`https://icons.duckduckgo.com/ip3/${new URL(url).host}.ico`}
      className={cn("w-5 h-5 mr-2 rounded-sm shrink-0", className)}
    />
  )
}
