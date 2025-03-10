import { FeedViewType } from "@follow/constants"
import { useLayoutEffect } from "react"
import { useSearchParams } from "react-router"

import { FeedForm } from "~/modules/discover/feed-form"

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
    <div className="bg-theme-background h-full overflow-hidden">
      <FeedForm
        url={url}
        id={id}
        defaultValues={{
          view: defaultView.toString(),
        }}
      />
    </div>
  )
}
