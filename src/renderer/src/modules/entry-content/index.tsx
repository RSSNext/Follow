import { Logo } from "@renderer/components/icons/logo"
import { AutoResizeHeight } from "@renderer/components/ui/auto-resize-height"
import { useBizQuery } from "@renderer/hooks"
import { parseHtml } from "@renderer/lib/parse-html"
import type { ActiveEntryId } from "@renderer/models"
import { Queries } from "@renderer/queries"
import { useEntry, useFeedStore } from "@renderer/store"
import { m } from "framer-motion"
import { useEffect, useState } from "react"

import { LoadingCircle } from "../../components/ui/loading"
import { EntryTranslation } from "../entry-column/translation"
import { EntryShare } from "./share"

export const EntryContent = ({ entry }: { entry: ActiveEntryId }) => {
  const activeList = useFeedStore((state) => state.activeList)

  if (!entry) {
    return (
      <m.div
        className="-mt-2 flex size-full flex-col items-center justify-center gap-1 text-lg font-medium text-zinc-400"
        initial={{ opacity: 0.01, y: 300 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Logo className="size-16 opacity-40 grayscale" />
        {activeList?.name}
      </m.div>
    )
  }

  return <EntryContentRender entryId={entry} />
}

function EntryContentRender({ entryId }: { entryId: string }) {
  const { error } = useBizQuery(Queries.entries.byId(entryId), {
    staleTime: 300_000,
  })

  const entry = useEntry(entryId)

  const [content, setContent] = useState<JSX.Element>()

  useEffect(() => {
    if (entry?.entries.content) {
      parseHtml(entry?.entries.content).then((parsed) => {
        setContent(parsed.content)
      })
    } else {
      setContent(undefined)
    }
  }, [entry?.entries.content])

  const translation = useBizQuery(
    Queries.ai.translation({
      entry: entry!,
      language: entry?.settings?.translation,
      extraFields: ["title"],
    }),
    {
      enabled: !!entry?.settings?.translation,
    },
  )

  const summary = useBizQuery(
    Queries.ai.summary({
      entryId,
      language: entry?.settings?.translation,
    }),
    {
      enabled: !!entry?.settings?.summary,
    },
  )

  if (!entry) return null

  return (
    <>
      <EntryShare entryId={entry.entries.id} view={0} />
      <div className="h-[calc(100%-3.5rem)] overflow-y-auto @container">
        <m.div
          className="p-5"
          initial={{ opacity: 0.01, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0.01, y: -100 }}
          key={entry.entries.id}
        >
          <article className="relative m-auto min-w-0 max-w-[550px] @4xl:max-w-[70ch]">
            <a
              href={entry.entries.url || void 0}
              target="_blank"
              className="-mx-6 block rounded-lg p-6 transition-colors hover:bg-theme-item-hover"
              rel="noreferrer"
            >
              <div className="select-text break-words text-3xl font-bold">
                <EntryTranslation
                  source={entry.entries.title}
                  target={translation.data?.title}
                />
              </div>
              <div className="mt-2 text-[13px] font-medium text-zinc-500">
                {entry.feeds?.title}
              </div>
              <div className="text-[13px] text-zinc-500">
                {entry.entries.publishedAt &&
                new Date(entry.entries.publishedAt).toLocaleString()}
              </div>
            </a>
            <div className="prose prose-zinc mx-auto mb-32 mt-8 max-w-full cursor-auto select-text break-all text-[15px] dark:prose-invert">
              {(summary.isLoading || summary.data) && (
                <div className="my-8 space-y-1 rounded-lg border px-4 py-3">
                  <div className="flex items-center gap-2 font-medium text-zinc-800">
                    <i className="i-mingcute-bling-line align-middle" />
                    <span>AI summary</span>
                  </div>
                  <AutoResizeHeight spring className="text-sm leading-relaxed">
                    {summary.isLoading ? SummaryLoadingSkeleton : summary.data}
                  </AutoResizeHeight>
                </div>
              )}
              {content}
            </div>
            {!content && (
              <div className="center mt-16">
                {!error ? (
                  <LoadingCircle size="large" />
                ) : (
                  <div className="center flex flex-col gap-2">
                    <i className="i-mingcute-close-line text-3xl text-red-500" />
                    <span className="font-sans text-sm">Network Error</span>
                  </div>
                )}
              </div>
            )}
          </article>
        </m.div>
      </div>
    </>
  )
}

const SummaryLoadingSkeleton = (
  <div className="space-y-2">
    <span className="block h-3 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
    <span className="block h-3 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
    <span className="block h-3 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-neutral-800" />
  </div>
)
