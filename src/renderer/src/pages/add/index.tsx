import { FeedViewType } from "@renderer/lib/enum"
import { FeedForm } from "@renderer/modules/discover/feed-form"
import { useLayoutEffect } from "react"

export function Component() {
  const urlSearchParams = new URLSearchParams(location.search)
  const paramUrl = urlSearchParams.get("url")
  const url = paramUrl ? decodeURIComponent(paramUrl) : undefined
  const id = urlSearchParams.get("id") || undefined
  const defaultView = urlSearchParams.get("view") || FeedViewType.Articles

  useLayoutEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])
  return (
    <div className="h-full overflow-hidden bg-background">
      <FeedForm url={url} id={id} defaultView={defaultView as FeedViewType} />
    </div>
  )
}
