import { parseHtml } from "./parse-html"

export function Html({ content }: { content: string }) {
  const res = parseHtml(content)

  return (
    <article className="prose !max-w-full dark:prose-invert prose-h1:text-[1.6em] prose-h1:font-bold">
      {res.toContent()}
    </article>
  )
}
