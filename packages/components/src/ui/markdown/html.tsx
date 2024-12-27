import type { Components } from "hast-util-to-jsx-runtime"

import { parseHtml } from "./parse-html"

export type ParseHtmlOptions = {
  renderInlineStyle?: boolean
  noMedia?: boolean
  components?: Components
}

export type HtmlProps = { content: string } & ParseHtmlOptions

export function Html({ content, ...options }: HtmlProps) {
  const res = parseHtml(content, options)

  return (
    <article className="prose !max-w-full dark:prose-invert prose-h1:text-[1.6em] prose-h1:font-bold">
      {res.toContent()}
    </article>
  )
}
