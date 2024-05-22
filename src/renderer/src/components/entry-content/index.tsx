import { parseHtml } from "@renderer/lib/parse-html"
import { ActivedEntry } from "@renderer/lib/types"
import { useEffect, useState } from "react"
import { m } from "framer-motion"
import { EntryShare } from "./share"
import { useEntry } from "@renderer/lib/queries/entries"

export function EntryContent({ entryId }: { entryId: ActivedEntry }) {
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
        className="px-5 py-5 overflow-y-auto h-full"
        initial={{ opacity: 0.01, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0.01, y: -100 }}
        key={entry.data?.id}
      >
        <div>
          <a
            href={entry.data?.url}
            target="_blank"
            className="block hover:bg-zinc-100 max-w-[598px] mx-auto p-6 rounded-md transition-colors"
          >
            <div className="text-3xl font-bold select-text break-words">
              {entry.data?.title}
            </div>
            <div className="mt-2 text-[13px] text-zinc-500 font-medium">
              {entry.data?.feeds?.title}
            </div>
            <div className="text-[13px] text-zinc-500">
              {entry.data?.publishedAt &&
                new Date(entry.data?.publishedAt).toUTCString()}
            </div>
          </a>
          <div className="max-w-[550px] mx-auto mt-10 mb-32 prose text-[15px] prose-zinc select-text cursor-auto">
            {content}
          </div>
        </div>
      </m.div>
    </>
  )
}
