import { parseHtml } from "@renderer/lib/parse-html"
import { ActiveEntry } from "@renderer/lib/types"
import { useEffect, useState } from "react"
import { m } from "framer-motion"
import { EntryShare } from "./share"
import { useEntry } from "@renderer/lib/queries/entries"

export function EntryContent({ entryId }: { entryId: ActiveEntry }) {
  const entry = useEntry({
    id: entryId,
  })

  const [content, setContent] = useState<JSX.Element>()

  useEffect(() => {
    if (entry.data?.content) {
      parseHtml(entry.data?.content).then((parsed) => {
        setContent(parsed.content)
      })
    } else {
      setContent(undefined)
    }
  }, [entry.data?.content])

  return (
    <>
      <EntryShare entry={entry.data} view={0} />
      <m.div
        className="h-[calc(100%-3.5rem)] overflow-y-auto p-5"
        initial={{ opacity: 0.01, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0.01, y: -100 }}
        key={entry.data?.id}
      >
        <div>
          <a
            href={entry.data?.url}
            target="_blank"
            className="mx-auto block max-w-[598px] rounded-md p-6 transition-colors hover:bg-zinc-100"
            rel="noreferrer"
          >
            <div className="select-text break-words text-3xl font-bold">
              {entry.data?.title}
            </div>
            <div className="mt-2 text-[13px] font-medium text-zinc-500">
              {entry.data?.feeds?.title}
            </div>
            <div className="text-[13px] text-zinc-500">
              {entry.data?.publishedAt &&
              new Date(entry.data?.publishedAt).toUTCString()}
            </div>
          </a>
          <div className="prose prose-zinc mx-auto mb-32 mt-10 max-w-[550px] cursor-auto select-text text-[15px]">
            {content}
          </div>
        </div>
      </m.div>
    </>
  )
}
