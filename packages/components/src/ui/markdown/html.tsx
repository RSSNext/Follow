import { parseHtml } from "./parse-html"

export function Html({ content }: { content: string }) {
  const res = parseHtml(content)

  return <article>{res.toContent()}</article>
}
