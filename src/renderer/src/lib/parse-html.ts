/* eslint-disable @typescript-eslint/no-explicit-any */
import { Image } from "@renderer/components/ui/image"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { createElement } from "react"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import rehypeInferDescriptionMeta from "rehype-infer-description-meta"
import rehypeParse from "rehype-parse"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import { unified } from "unified"
import { visit } from "unist-util-visit"
import { VFile } from "vfile"

export const parseHtml = async (content: string, options?: {
  renderInlineStyle: boolean
}) => {
  const file = new VFile(content)
  const { renderInlineStyle = false } = options || {}

  const pipeline = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,

        "*": renderInlineStyle ? [...defaultSchema.attributes!["*"], "style"] : defaultSchema.attributes!["*"],
      },
    })
    .use(rehypeInferDescriptionMeta)
    .use(rehypeStringify)

  const tree = pipeline.parse(content)

  const hastTree = pipeline.runSync(tree, file)

  const metadata: {
    desctription: string
    images: string[]
  } = {
    desctription: file.data.meta?.description || "",
    images: [],
  }
  if (hastTree) {
    visit(hastTree, (node) => {
      if (node.type === "element") {
        if (node.tagName === "img" && typeof node.properties.src === "string") {
          metadata.images.push(node.properties.src)
        } else if (node.tagName === "a") {
          node.properties.target = "_blank"
        }
      }
    })
  }

  return {
    metadata,
    content: toJsxRuntime(hastTree, {
      Fragment,
      ignoreInvalidStyle: true,
      jsx: (type, props, key) => jsx(type as any, props, key),
      jsxs: (type, props, key) => jsxs(type as any, props, key),
      passNode: true,
      components: {
        img: (props) => createElement(Image, { ...props, popper: true }),
      },
    }),
  }
}
