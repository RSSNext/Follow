"use dom"
import "@/src/global.css"
import "remark-gh-alerts/styles/github-base.css"
import "remark-gh-alerts/styles/github-colors-dark-media.css"
import "remark-gh-alerts/styles/github-colors-light.css"

import { cn } from "@follow/utils"
import type { Components } from "hast-util-to-jsx-runtime"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import rehypeStringify from "rehype-stringify"
import remarkDirective from "remark-directive"
import remarkGfm from "remark-gfm"
import remarkGithubAlerts from "remark-gh-alerts"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { useDarkMode } from "usehooks-ts"
import { VFile } from "vfile"

import { useCSSInjection } from "@/src/theme/web"

export interface RemarkOptions {
  components: Partial<Components>
}
const parseMarkdown = (content: string, options?: Partial<RemarkOptions>) => {
  const file = new VFile(content)
  const { components } = options || {}

  const pipeline = unified()
    .use(remarkParse)

    .use(remarkGfm)
    .use(remarkGithubAlerts)

    .use(remarkDirective)

    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })

  const tree = pipeline.parse(content)

  const hastTree = pipeline.runSync(tree, file)

  return {
    content: toJsxRuntime(hastTree, {
      Fragment,
      ignoreInvalidStyle: true,
      jsx: (type, props, key) => jsx(type as any, props, key),
      jsxs: (type, props, key) => jsxs(type as any, props, key),
      passNode: true,
      components: {
        ...components,
      },
    }),
  }
}

const MarkdownWeb: WebComponent<{ value: string }> = ({ value }) => {
  useCSSInjection()

  const { isDarkMode } = useDarkMode()
  return (
    <div className={cn("text-text prose min-w-0", isDarkMode ? "prose-invert" : "prose")}>
      {parseMarkdown(value).content}
    </div>
  )
}

export default MarkdownWeb
