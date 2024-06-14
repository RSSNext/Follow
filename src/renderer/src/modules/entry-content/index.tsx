import { Logo } from "@renderer/components/icons/logo"
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
              className="-mx-6 block rounded-md p-6 transition-colors hover:bg-theme-item-hover"
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
                new Date(entry.entries.publishedAt).toUTCString()}
              </div>
            </a>

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
            <div className="prose prose-zinc mx-auto mb-32 mt-10 max-w-full cursor-auto select-text break-all text-[15px] dark:prose-invert">
              {content}
            </div>
          </article>
        </m.div>
      </div>
    </>
  )
}
