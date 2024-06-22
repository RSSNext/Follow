import { FeedViewType } from "@renderer/lib/enum"
import { FeedForm } from "@renderer/modules/discover/feed-form"
import { useLayoutEffect } from "react"
import { useSearchParams } from "react-router-dom"

export function Component() {
  const [urlSearchParams] = useSearchParams()

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
    <div className="h-full overflow-hidden bg-theme-background">
      <FeedForm url={url} id={id} defaultView={defaultView as FeedViewType} />
    </div>
  )
}
