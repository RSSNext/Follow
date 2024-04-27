import { cn } from "@renderer/lib/utils"

export function SiteIcon({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  let host
  try {
    host = new URL(url).host
  } catch (error) {}
  return (
    <img
      src={`https://icons.duckduckgo.com/ip3/${host}.ico`}
      className={cn("w-5 h-5 mr-2 rounded-sm shrink-0", className)}
    />
  )
}
