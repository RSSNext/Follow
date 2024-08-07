import {
  MarkdownLink,
} from "@renderer/components/ui/markdown/renderers"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { createElement } from "react"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { VFile } from "vfile"

export const parseMarkdown = async (
  content: string,
) => {
  const file = new VFile(content)

  const pipeline = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)

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
        a: ({ node, ...props }) =>
          createElement(MarkdownLink, { ...props } as any),
      },
    }),
  }
}
