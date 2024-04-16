import { parseHtml } from '@renderer/lib/parse-html'
import { ActivedEntry } from '@renderer/lib/types'
import { useEffect, useState } from 'react'

export function EntryContent({
  entry,
}: {
  entry: ActivedEntry,
}) {
  const [content, setContent] = useState<JSX.Element>()

  useEffect(() => {
    parseHtml(entry?.content).then((parsed) => {
      setContent(parsed.content)
    })
  }, [entry?.content])

  return (
    <div className="px-4 py-5 overflow-y-auto h-full">
      <div className='max-w-[550px] mx-auto'>
        <div className="text-3xl font-bold">{entry?.title}</div>
        <div className="mt-2 text-[13px] text-zinc-500 font-medium">{entry?.feed?.title}</div>
        <div className="text-[13px] text-zinc-500">{new Date(entry?.published_at).toUTCString()}</div>
        <div className="mt-10 prose text-[15px] prose-zinc">{content}</div>
      </div>
    </div>
  )
}
