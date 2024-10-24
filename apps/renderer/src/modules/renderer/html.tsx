import { FeedViewType } from "@follow/constants"
import { useMemo } from "react"

import {
  MarkdownImageRecordContext,
  MarkdownRenderActionContext,
} from "~/components/ui/markdown/context"
import type { HTMLProps } from "~/components/ui/markdown/HTML"
import { HTML } from "~/components/ui/markdown/HTML"
import type { MarkdownImage, MarkdownRenderActions } from "~/components/ui/markdown/types"
import { useEntry } from "~/store/entry/hooks"
import { useFeedByIdSelector } from "~/store/feed/hooks"

import { TimeStamp } from "./components/TimeStamp"
import { EntryInfoContext } from "./context"

export function EntryContentHTMLRenderer<AS extends keyof JSX.IntrinsicElements = "div">({
  view,
  feedId,
  entryId,
  children,
  ...props
}: {
  view: FeedViewType
  feedId: string
  entryId: string
  children: Nullable<string>
} & HTMLProps<AS>) {
  const entry = useEntry(entryId)

  const feedSiteUrl = useFeedByIdSelector(feedId, (feed) =>
    "siteUrl" in feed ? feed.siteUrl : undefined,
  )

  const images: Record<string, MarkdownImage> = useMemo(() => {
    return (
      entry?.entries.media?.reduce(
        (acc, media) => {
          if (media.height && media.width) {
            acc[media.url] = {
              url: media.url,
              width: media.width,
              height: media.height,
            }
          }
          return acc
        },
        {} as Record<string, MarkdownImage>,
      ) ?? {}
    )
  }, [entry])
  const actions: MarkdownRenderActions = useMemo(() => {
    return {
      isAudio() {
        return view === FeedViewType.Audios
      },
      transformUrl(url) {
        if (!url || url.startsWith("http")) return url
        if (url.startsWith("/") && feedSiteUrl) return safeUrl(url, feedSiteUrl)
        return url
      },
      ensureAndRenderTimeStamp,
    }
  }, [feedSiteUrl, view])
  return (
    <MarkdownImageRecordContext.Provider value={images}>
      <MarkdownRenderActionContext.Provider value={actions}>
        <EntryInfoContext.Provider value={useMemo(() => ({ feedId, entryId }), [feedId, entryId])}>
          {/*  @ts-expect-error */}
          <HTML {...props}>{children}</HTML>
        </EntryInfoContext.Provider>
      </MarkdownRenderActionContext.Provider>
    </MarkdownImageRecordContext.Provider>
  )
}

const safeUrl = (url: string, baseUrl: string) => {
  try {
    return new URL(url, baseUrl).href
  } catch {
    return url
  }
}

const ensureAndRenderTimeStamp = (children: string) => {
  const firstPart = children.replace(" ", " ").split(" ")[0]
  // 00:00 , 00:00:00
  if (!firstPart) {
    return
  }
  const isTime = isValidTimeString(firstPart.trim())
  if (isTime) {
    return (
      <>
        <TimeStamp time={firstPart} />
        <span>{children.slice(firstPart.length)}</span>
      </>
    )
  }
  return false
}
function isValidTimeString(time: string): boolean {
  const timeRegex = /^\d{1,2}:[0-5]\d(?::[0-5]\d)?$/
  return timeRegex.test(time)
}
