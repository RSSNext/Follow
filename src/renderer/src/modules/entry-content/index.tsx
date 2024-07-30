import { useUISettingKey } from "@renderer/atoms/settings/ui"
import { useMe } from "@renderer/atoms/user"
import { m } from "@renderer/components/common/Motion"
import { Logo } from "@renderer/components/icons/logo"
import { AutoResizeHeight } from "@renderer/components/ui/auto-resize-height"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { getRouteParams } from "@renderer/hooks/biz/useRouteParams"
import { useAuthQuery, useTitle } from "@renderer/hooks/common"
import { stopPropagation } from "@renderer/lib/dom"
import { FeedViewType } from "@renderer/lib/enum"
import { parseHtml } from "@renderer/lib/parse-html"
import type { ActiveEntryId } from "@renderer/models"
import {
  useIsSoFWrappedElement,
  WrappedElementProvider,
} from "@renderer/providers/wrapped-element-provider"
import { Queries } from "@renderer/queries"
import { useEntry, useEntryReadHistory } from "@renderer/store/entry"
import { useFeedById, useFeedHeaderTitle } from "@renderer/store/feed"
import { useEffect, useLayoutEffect, useState } from "react"

import { LoadingCircle } from "../../components/ui/loading"
import { EntryTranslation } from "../entry-column/translation"
import { setEntryContentScrollToTop, setEntryTitleMeta } from "./atoms"
import { EntryHeader } from "./header"
import { EntryContentProvider } from "./provider"

export const EntryContent = ({ entryId }: { entryId: ActiveEntryId }) => {
  const title = useFeedHeaderTitle()

  useTitle(title)
  if (!entryId) {
    return (
      <m.div
        onContextMenu={stopPropagation}
        className="-mt-2 flex size-full min-w-0 flex-col items-center justify-center gap-1 text-balance px-12 text-center text-lg font-medium text-zinc-400"
        initial={{ opacity: 0.01, y: 300 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Logo className="size-16 opacity-40 grayscale" />
        <span className="max-w-[60ch]">{title}</span>
      </m.div>
    )
  }

  return <EntryContentRender entryId={entryId} />
}

function EntryContentRender({ entryId }: { entryId: string }) {
  const user = useMe()

  const { error, data, isPending } = useAuthQuery(
    Queries.entries.byId(entryId),
    {
      staleTime: 300_000,
    },
  )

  const entry = useEntry(entryId)
  useTitle(entry?.entries.title)

  const feed = useFeedById(entry?.feedId)

  const entryHistory = useEntryReadHistory(entryId)

  const [content, setContent] = useState<JSX.Element>()
  const readerRenderInlineStyle = useUISettingKey("readerRenderInlineStyle")
  useEffect(() => {
    // Fallback data, if local data is broken should fallback to cached query data.
    const processContent = entry?.entries.content ?? data?.entries.content
    if (processContent) {
      parseHtml(processContent, {
        renderInlineStyle: readerRenderInlineStyle,
        parseParagraphAudioTime: getRouteParams().view === FeedViewType.Audios,
      }).then((parsed) => {
        setContent(parsed.content)
      })
    } else {
      setContent(undefined)
    }
  }, [
    data?.entries.content,
    entry?.entries.content,
    readerRenderInlineStyle,
    // Only for dx, hmr
    parseHtml,
  ])

  const translation = useAuthQuery(
    Queries.ai.translation({
      entry: entry!,
      language: entry?.settings?.translation,
      extraFields: ["title"],
    }),
    {
      enabled: !!entry?.settings?.translation,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      meta: {
        persist: true,
      },
    },
  )

  const summary = useAuthQuery(
    Queries.ai.summary({
      entryId,
      language: entry?.settings?.translation,
    }),
    {
      enabled: !!entry?.settings?.summary,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      meta: {
        persist: true,
      },
    },
  )

  const readerFontFamily = useUISettingKey("readerFontFamily")

  if (!entry) return null

  return (
    <EntryContentProvider
      entryId={entry.entries.id}
      feedId={entry.feedId}
      audioSrc={entry.entries?.attachments?.[0].url}
    >
      <EntryHeader
        entryId={entry.entries.id}
        view={0}
        className="h-[55px] shrink-0 px-5"
      />

      <ScrollArea.ScrollArea
        mask={false}
        rootClassName="h-0 grow min-w-0 overflow-y-auto @container"
        viewportClassName="p-5"
      >
        <m.div
          style={
            readerFontFamily ?
                {
                  fontFamily: readerFontFamily,
                } :
              undefined
          }
          initial={{ opacity: 0.01, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0.01, y: -100 }}
          key={entry.entries.id}
        >
          <article
            onContextMenu={stopPropagation}
            className="relative m-auto min-w-0 max-w-[550px] @4xl:max-w-[70ch]"
          >
            <a
              href={entry.entries.url || void 0}
              target="_blank"
              className="-mx-6 block cursor-default rounded-lg p-6 transition-colors hover:bg-theme-item-hover focus-visible:bg-theme-item-hover focus-visible:!outline-none @sm:-mx-3 @sm:p-3"
              rel="noreferrer"
            >
              <div className="select-text break-words text-3xl font-bold">
                <EntryTranslation
                  source={entry.entries.title}
                  target={translation.data?.title}
                />
              </div>
              <div className="mt-2 text-[13px] font-medium text-zinc-500">
                {feed?.title}
              </div>
              <div className="flex items-center gap-2 text-[13px] text-zinc-500">
                {entry.entries.publishedAt &&
                  new Date(entry.entries.publishedAt).toLocaleString()}

                <div className="flex items-center gap-1">
                  <i className="i-mgc-eye-2-cute-re" />
                  <span>
                    {(
                      (entryHistory?.readCount ?? 0) +
                      (entryHistory?.userIds?.every((id) => id !== user?.id) ?
                        1 :
                        0)
                    ) // if no me, +1
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            </a>
            <WrappedElementProvider boundingDetection>
              <TitleMetaHandler entryId={entry.entries.id} />
              <div className="prose prose-zinc mx-auto mb-32 mt-8 max-w-full cursor-auto select-text break-all text-[0.94rem] dark:prose-invert">
                {(summary.isLoading || summary.data) && (
                  <div className="my-8 space-y-1 rounded-lg border px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-zinc-800 dark:text-neutral-400">
                      <i className="i-mgc-magic-2-cute-re align-middle" />
                      <span>AI summary</span>
                    </div>
                    <AutoResizeHeight
                      spring
                      className="text-sm leading-relaxed"
                    >
                      {summary.isLoading ?
                        SummaryLoadingSkeleton :
                        summary.data}
                    </AutoResizeHeight>
                  </div>
                )}
                {content}
              </div>
            </WrappedElementProvider>
            {!content && (
              <div className="center mt-16">
                {isPending ? (
                  <LoadingCircle size="large" />
                ) : error ?
                    (
                      <div className="center flex flex-col gap-2">
                        <i className="i-mgc-close-cute-re text-3xl text-red-500" />
                        <span className="font-sans text-sm">Network Error</span>
                      </div>
                    ) :
                    (
                      <div className="center">
                        <span className="text-sm text-zinc-400">No content</span>
                      </div>
                    )}
              </div>
            )}
          </article>
        </m.div>
      </ScrollArea.ScrollArea>
    </EntryContentProvider>
  )
}

const SummaryLoadingSkeleton = (
  <div className="space-y-2">
    <span className="block h-3 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
    <span className="block h-3 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
    <span className="block h-3 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
  </div>
)

const TitleMetaHandler: Component<{
  entryId: string
}> = ({ entryId }) => {
  const {
    entries: { title: entryTitle },
    feedId,
  } = useEntry(entryId)!

  const { title: feedTitle } = useFeedById(feedId)!

  const atTop = useIsSoFWrappedElement()
  useLayoutEffect(() => {
    setEntryContentScrollToTop(atTop)
  }, [atTop])

  useEffect(() => {
    if (entryTitle && feedTitle) {
      setEntryTitleMeta({ title: entryTitle, description: feedTitle })
    }
    return () => {
      setEntryTitleMeta(null)
    }
  }, [entryId, entryTitle, feedTitle])
  return null
}
