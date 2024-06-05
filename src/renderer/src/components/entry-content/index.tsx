import { useBizQuery } from "@renderer/hooks/useBizQuery"
import { parseHtml } from "@renderer/lib/parse-html"
import type { ActiveEntry } from "@renderer/models"
import { Queries } from "@renderer/queries"
import { useFeedStore } from "@renderer/store"
import { m } from "framer-motion"
import { useEffect, useState } from "react"

import { EntryShare } from "./share"

export function EntryContent({ entryId }: { entryId: ActiveEntry }) {
  const entry = useBizQuery(Queries.entries.byId(entryId), {
    enabled: !!entryId,
  })
  const activeList = useFeedStore((state) => state.activeList)

  const [content, setContent] = useState<JSX.Element>()

  useEffect(() => {
    if (entry.data?.entries.content) {
      parseHtml(entry.data?.entries.content).then((parsed) => {
        setContent(parsed.content)
      })
    } else {
      setContent(undefined)
    }
  }, [entry.data?.entries.content])

  return entry.data ?
      (
        <>
          <EntryShare entryId={entry.data.entries.id} view={0} />
          <div className="h-[calc(100%-3.5rem)] overflow-y-auto @container">
            <m.div
              className="p-5"
              initial={{ opacity: 0.01, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.01, y: -100 }}
              key={entry.data?.entries.id}
            >
              <article className="relative m-auto min-w-0 max-w-[550px] @4xl:max-w-[70ch]">
                <a
                  href={entry.data?.entries.url || void 0}
                  target="_blank"
                  className="-mx-6 block rounded-md p-6 transition-colors hover:bg-theme-item-hover"
                  rel="noreferrer"
                >
                  <div className="select-text break-words text-3xl font-bold">
                    {entry.data?.entries.title}
                  </div>
                  <div className="mt-2 text-[13px] font-medium text-zinc-500">
                    {entry.data?.feeds?.title}
                  </div>
                  <div className="text-[13px] text-zinc-500">
                    {entry.data?.entries.publishedAt &&
                    new Date(entry.data?.entries.publishedAt).toUTCString()}
                  </div>
                </a>
                <div className="prose prose-zinc mx-auto mb-32 mt-10 max-w-full cursor-auto select-text break-all text-[15px] dark:prose-invert">
                  {content}
                </div>
              </article>
            </m.div>
          </div>
        </>
      ) :
      (
        <m.div
          className="flex size-full flex-col items-center justify-center gap-1 text-lg font-medium text-zinc-400"
          initial={{ opacity: 0.01, y: 300 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img
            src="./icon.svg"
            alt="logo"
            className="size-16 opacity-40 grayscale"
          />
          {activeList?.name}
        </m.div>
      )
}
