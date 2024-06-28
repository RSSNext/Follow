/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShikiHighLighter } from "@renderer/components/ui/code-highlighter"
import { Image } from "@renderer/components/ui/image"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { createElement } from "react"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import { renderToString } from "react-dom/server"
import rehypeInferDescriptionMeta from "rehype-infer-description-meta"
import rehypeParse from "rehype-parse"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import { unified } from "unified"
import { visit } from "unist-util-visit"
import { VFile } from "vfile"

export const parseHtml = async (
  content: string,
  options?: {
    renderInlineStyle: boolean
  },
) => {
  const file = new VFile(content)
  const { renderInlineStyle = false } = options || {}

  const pipeline = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,

        "*": renderInlineStyle ?
            [...defaultSchema.attributes!["*"], "style"] :
          defaultSchema.attributes!["*"],
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
        img: ({ node, ...props }) => createElement(Image, { ...props, popper: true }),
        pre: ({ node, ...props }) => {
          if (!props.children) return null

          let language = "plaintext"
          let codeString = null as string | null
          if (props.className?.includes("language-")) {
            language = props.className.replace("language-", "")
          }

          if (typeof props.children !== "object") {
            language = "plaintext"
            codeString = props.children.toString()
          } else {
            if (
              "type" in props.children &&
              props.children.type === "code" &&
              props.children.props.className?.includes("language-")
            ) {
              language = props.children.props.className.replace(
                "language-",
                "",
              )
            }
            const code =
              "props" in props.children && props.children.props.children
            if (!code) return null
            const $text = document.createElement("div")
            $text.innerHTML = renderToString(code)
            codeString = $text.textContent
          }

          if (!codeString) return null
          // return createElement("pre", { ...props, className: "shiki" })
          return createElement(ShikiHighLighter, {
            code: codeString,
            language: language.toLowerCase(),
          })
        },
      },
    }),
  }
}
