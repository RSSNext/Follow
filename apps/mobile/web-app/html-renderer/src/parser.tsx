import { MemoedDangerousHTMLStyle } from "@follow/components/common/MemoedDangerousHTMLStyle.jsx"
import { Checkbox } from "@follow/components/ui/checkbox/index.jsx"
import { parseHtml as parseHtmlGeneral } from "@follow/components/ui/markdown/parse-html.js"
import type { Components } from "hast-util-to-jsx-runtime"
import { createElement } from "react"

import { createHeadingRenderer, MarkdownLink, MarkdownP } from "./components"
import { MarkdownImage } from "./components/image"
import { Math } from "./components/math"

const Style: Components["style"] = ({ node, ...props }) => {
  if (typeof props.children === "string") {
    return createElement(
      MemoedDangerousHTMLStyle,
      null,
      props.children.replaceAll(/html|body/g, "#shadow-html"),
    )
  }
  return null
}

export const parseHtml = (
  content: string,
  options?: Partial<{
    renderInlineStyle: boolean
    noMedia?: boolean
  }>,
) => {
  return parseHtmlGeneral(content, {
    ...options,
    components: {
      a: ({ node, ...props }) => {
        return createElement(MarkdownLink, { ...props } as any)
      },

      h1: (props) => {
        return createHeadingRenderer(1)(props)
      },
      h2: (props) => {
        return createHeadingRenderer(2)(props)
      },
      h3: (props) => {
        return createHeadingRenderer(3)(props)
      },
      h4: (props) => {
        return createHeadingRenderer(4)(props)
      },
      h5: (props) => {
        return createHeadingRenderer(5)(props)
      },
      h6: (props) => {
        return createHeadingRenderer(6)(props)
      },
      style: Style,
      img: ({ node, ...props }) => {
        return createElement(MarkdownImage, props as any)
      },

      p: ({ node, ...props }) => {
        if (node?.children && node.children.length !== 1) {
          for (const item of node.children) {
            item.type === "element" &&
              item.tagName === "img" &&
              ((item.properties as any).inline = true)
          }
        }
        return createElement(MarkdownP, props, props.children)
      },

      // @ts-expect-error
      math: Math,
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
      // pre: ({ node, ...props }) => {
      //   if (!props.children) return null

      //   let language = ""

      //   let codeString = null as string | null
      //   if (props.className?.includes("language-")) {
      //     language = props.className.replace("language-", "")
      //   }

      //   if (typeof props.children !== "object") {
      //     codeString = props.children.toString()
      //   } else {
      //     const propsChildren = props.children
      //     const children = Array.isArray(propsChildren)
      //       ? propsChildren.find((i) => i.type === "code")
      //       : propsChildren

      //     // Don't process not code block
      //     if (!children) return createElement("pre", props, props.children)

      //     if (
      //       "type" in children &&
      //       children.type === "code" &&
      //       children.props.className?.includes("language-")
      //     ) {
      //       language = children.props.className.replace("language-", "")
      //     }
      //     const code = ("props" in children && children.props.children) || children
      //     if (!code) return null

      //     try {
      //       codeString = extractCodeFromHtml(renderToString(code))
      //     } catch (error) {
      //       console.error("Code Block Render Error", error)
      //       return createElement("pre", props, props.children)
      //     }
      //   }

      //   if (!codeString) return createElement("pre", props, props.children)

      //   return createElement(ShikiHighLighter, {
      //     code: codeString.trimEnd(),
      //     language: language.toLowerCase(),
      //   })
      // },
      figure: ({ node, ...props }) =>
        createElement(
          "figure",
          {
            className: "max-w-full",
          },
          props.children,
        ),
      table: ({ node, ...props }) =>
        createElement(
          "div",
          {
            className: "w-full overflow-x-auto",
          },

          createElement("table", {
            ...props,
            className: tw`w-full my-0`,
          }),
        ),
    },
  })
}
