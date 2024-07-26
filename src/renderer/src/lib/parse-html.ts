import { Checkbox } from "@renderer/components/ui/checkbox"
import { ShikiHighLighter } from "@renderer/components/ui/code-highlighter"
import { MarkdownLink } from "@renderer/components/ui/link"
import { Media } from "@renderer/components/ui/media"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { createElement } from "react"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import { renderToString } from "react-dom/server"
import rehypeInferDescriptionMeta from "rehype-infer-description-meta"
import rehypeParse from "rehype-parse"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import { unified } from "unified"
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
      tagNames: renderInlineStyle ?
        defaultSchema.tagNames :
          [...defaultSchema.tagNames!, "video"],
      attributes: {
        ...defaultSchema.attributes,

        "*": renderInlineStyle ?
            [...defaultSchema.attributes!["*"], "style"] :
          defaultSchema.attributes!["*"],

        "video": ["src", "poster"],
      },
    })
    .use(rehypeInferDescriptionMeta)
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
        img: ({ node, ...props }) => {
          if (node?.properties.inline) {
            return createElement("img", {
              src: props.src,
              style: { maxWidth: "100%", display: "inline" },
            })
          }
          return createElement(Media, {
            ...props,
            mediaContainerClassName: "w-full rounded",
            className: "flex justify-center",

            popper: true,
            type: "photo",
          })
        },
        video: ({ node, ...props }) =>
          createElement(Media, { ...props, popper: true, type: "video" }),
        p: ({ node, ...props }) => {
          if (node?.children) {
            for (const item of node.children) {
              item.type === "element" &&
              item.tagName === "img" &&
              ((item.properties as any).inline = true)
            }
          }
          return createElement("p", undefined, props.children)
        },
        hr: ({ node, ...props }) =>
          createElement("hr", {
            ...props,
            className: tw`scale-x-50`,
          }),
        input: ({ node, ...props }) => {
          if (props.type === "checkbox") {
            return createElement(Checkbox, {
              ...props,
              disabled: false,
              className: tw`pointer-events-none mr-2`,
            })
          }
          return createElement("input", props)
        },
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

          return createElement(ShikiHighLighter, {
            code: codeString.trimEnd(),
            language: language.toLowerCase(),
          })
        },
      },
    }),
  }
}
