import type { RemarkOptions } from "@follow/components/utils/parse-markdown.js"
import { parseMarkdown as parseMarkdownImpl } from "@follow/components/utils/parse-markdown.js"
import { createElement } from "react"

import { MarkdownLink } from "~/components/ui/markdown/renderers/MarkdownLink"
import { VideoPlayer } from "~/components/ui/media/VideoPlayer"

export const parseMarkdown = (content: string, options?: Partial<RemarkOptions>) => {
  return parseMarkdownImpl(content, {
    ...options,
    components: {
      a: ({ node, ...props }) => createElement(MarkdownLink, { ...props } as any),
      img: ({ node, ...props }) => {
        const { src } = props
        const isVideo = src?.endsWith(".mp4")
        if (isVideo) {
          return createElement(VideoPlayer, {
            src: src as string,
          })
        }
        return createElement("img", { ...props } as any)
      },
      ...options?.components,
    },
  })
}

export { type RemarkOptions } from "@follow/components/utils/parse-markdown.js"
