import type { Element, Parent, Text } from "hast"
import type { Schema } from "hast-util-sanitize"
import type { Components } from "hast-util-to-jsx-runtime"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { toText } from "hast-util-to-text"
import { createElement } from "react"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import { renderToString } from "react-dom/server"
import rehypeInferDescriptionMeta from "rehype-infer-description-meta"
import rehypeParse from "rehype-parse"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import { unified } from "unified"
import type { Node } from "unist"
import { visit } from "unist-util-visit"
import { VFile } from "vfile"

import { ShadowDOM } from "~/components/common/ShadowDOM"
import { Checkbox } from "~/components/ui/checkbox"
import { ShikiHighLighter } from "~/components/ui/code-highlighter"
import { LazyKateX } from "~/components/ui/katex/lazy"
import { MarkdownBlockImage, MarkdownLink, MarkdownP } from "~/components/ui/markdown/renderers"
import { BlockError } from "~/components/ui/markdown/renderers/BlockErrorBoundary"
import { useIsInParagraphContext } from "~/components/ui/markdown/renderers/ctx"
import { createHeadingRenderer } from "~/components/ui/markdown/renderers/Heading"
import { MarkdownInlineImage } from "~/components/ui/markdown/renderers/InlineImage"
import { Media } from "~/components/ui/media"

function markInlineImage(node?: Element) {
  for (const item of node?.children ?? []) {
    if (item.type === "element" && item.tagName === "img") {
      ;(item.properties as any).inline = true
    }
  }
}

/**
 * Remove the last <br> element in the tree
 */
function rehypeTrimEndBrElement() {
  function trim(tree: Parent): void {
    if (!Array.isArray(tree.children) || tree.children.length === 0) {
      return
    }

    for (let i = tree.children.length - 1; i >= 0; i--) {
      const item = tree.children[i]
      if (item.type === "element") {
        if (item.tagName === "br") {
          tree.children.pop()
          continue
        } else {
          trim(item)
        }
      }
      break
    }
  }
  return trim
}

export const parseHtml = (
  content: string,
  options?: Partial<{
    renderInlineStyle: boolean
    noMedia?: boolean
  }>,
) => {
  const file = new VFile(content)
  const { renderInlineStyle = false, noMedia = false } = options || {}

  const rehypeSchema: Schema = { ...defaultSchema }
  rehypeSchema.tagNames = [...rehypeSchema.tagNames!, "math"]

  if (noMedia) {
    rehypeSchema.tagNames = rehypeSchema.tagNames?.filter(
      (tag) => tag !== "img" && tag !== "picture",
    )
  } else {
    rehypeSchema.tagNames = [...rehypeSchema.tagNames!, "video", "style", "figure"]
    rehypeSchema.attributes = {
      ...rehypeSchema.attributes,
      "*": renderInlineStyle
        ? [...rehypeSchema.attributes!["*"], "style", "class"]
        : rehypeSchema.attributes!["*"],
      video: ["src", "poster"],
    }
  }

  const pipeline = unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeSanitize, rehypeSchema)
    .use(rehypeTrimEndBrElement)
    .use(rehypeInferDescriptionMeta)
    .use(rehypeStringify)

  const tree = pipeline.parse(content)

  rehypeUrlToAnchor(tree)

  // console.log("tree", tree)

  const hastTree = pipeline.runSync(tree, file)

  const images = [] as string[]

  visit(tree, "element", (node) => {
    if (node.tagName === "img" && node.properties.src) {
      images.push(node.properties.src as string)
    }
  })

  return {
    hastTree,
    images,
    toContent: () =>
      toJsxRuntime(hastTree, {
        Fragment,
        ignoreInvalidStyle: true,
        jsx: (type, props, key) => jsx(type as any, props, key),
        jsxs: (type, props, key) => jsxs(type as any, props, key),
        passNode: true,
        components: {
          a: ({ node, ...props }) => {
            markInlineImage(node)
            return createElement(MarkdownLink, { ...props } as any)
          },
          img: Img,

          h1: createHeadingRenderer(1),
          h2: createHeadingRenderer(2),
          h3: createHeadingRenderer(3),
          h4: createHeadingRenderer(4),
          h5: createHeadingRenderer(5),
          h6: createHeadingRenderer(6),
          style: Style,

          video: ({ node, ...props }) =>
            createElement(Media, { ...props, popper: true, type: "video" }),
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
          span: ({ node, ...props }) => {
            markInlineImage(node)
            return createElement("span", props, props.children)
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
          pre: ({ node, ...props }) => {
            if (!props.children) return null

            let language = ""

            let codeString = null as string | null
            if (props.className?.includes("language-")) {
              language = props.className.replace("language-", "")
            }

            if (typeof props.children !== "object") {
              codeString = props.children.toString()
            } else {
              const propsChildren = props.children
              const children = Array.isArray(propsChildren)
                ? propsChildren.find((i) => i.type === "code")
                : propsChildren

              // Don't process not code block
              if (!children) return createElement("pre", props, props.children)

              if (
                "type" in children &&
                children.type === "code" &&
                children.props.className?.includes("language-")
              ) {
                language = children.props.className.replace("language-", "")
              }
              const code = ("props" in children && children.props.children) || children
              if (!code) return null

              try {
                codeString = extractCodeFromHtml(renderToString(code))
              } catch (error) {
                return createElement(BlockError, {
                  error,
                  message: "Code Block Render Error",
                })
              }
            }

            if (!codeString) return createElement("pre", props, props.children)

            return createElement(ShikiHighLighter, {
              code: codeString.trimEnd(),
              language: language.toLowerCase(),
            })
          },
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
      }),
    toText: () => toText(hastTree),
  }
}

const Img: Components["img"] = ({ node, ...props }) => {
  const nextProps = {
    ...props,
    proxy: { height: 0, width: 700 },
  }
  const widthPx = Number.parseInt(props.width as string)

  return createElement(
    node?.properties.inline && widthPx < 600 ? MarkdownInlineImage : MarkdownBlockImage,
    nextProps,
  )
}

export function extractCodeFromHtml(htmlString: string) {
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlString

  const hasPre = tempDiv.querySelector("pre")
  if (!hasPre) {
    tempDiv.innerHTML = `<pre><code>${htmlString}</code></pre>`
  }

  // 1. line break via <div />
  const divElements = tempDiv.querySelectorAll("div")

  let code = ""

  if (divElements.length > 0) {
    divElements.forEach((div) => {
      code += `${div.textContent}\n`
    })
    return code
  }

  // 2. line wrapper like <span><span>...</span></span>
  const spanElements = tempDiv.querySelectorAll("span > span")

  // 2.1 outside <span /> as a line break?

  let spanAsLineBreak = false

  if (tempDiv.children.length > 2) {
    for (const node of tempDiv.children) {
      const span = node as HTMLSpanElement
      // 2.2 If the span has only one child and it's a line break, then span can be as a line break
      spanAsLineBreak = span.children.length === 1 && span.childNodes.item(0).textContent === "\n"
      if (spanAsLineBreak) break
    }
  }

  if (!spanAsLineBreak) {
    const usingBr = tempDiv.querySelector("br")
    if (usingBr) {
      spanAsLineBreak = true
    }
  }

  if (spanElements.length > 0) {
    for (const node of tempDiv.children) {
      if (spanAsLineBreak) {
        code += `${node.textContent}`
      } else {
        code += `${node.textContent}\n`
      }
    }

    return code
  }

  return tempDiv.textContent
}

const Style: Components["style"] = ({ node, ...props }) => {
  const isShadowDOM = ShadowDOM.useIsShadowDOM()

  if (isShadowDOM) {
    return createElement("style", {
      ...props,
    })
  }
  return null
}

function rehypeUrlToAnchor(tree: Node) {
  // https://chatgpt.com/share/37e0ceec-5c9e-4086-b9d6-5afc1af13bb0
  visit(tree, "text", (node: Text, index, parent: Node) => {
    const urlRegex = /https?:\/\/\S+/g
    const text = node.value
    const matches = [...text.matchAll(urlRegex)]

    if (matches.length === 0 || !parent || !("children" in parent)) return

    if ((parent as Element).tagName === "a") {
      return
    }

    const newNodes: (Text | Element)[] = []
    let lastIndex = 0

    matches.forEach((match) => {
      const [url] = match
      const urlIndex = match.index || 0

      if (urlIndex > lastIndex) {
        newNodes.push({
          type: "text",
          value: text.slice(lastIndex, urlIndex),
        })
      }

      newNodes.push({
        type: "element",
        tagName: "a",
        properties: { href: url },
        children: [{ type: "text", value: url }],
      })

      lastIndex = urlIndex + url.length
    })

    if (lastIndex < text.length) {
      newNodes.push({
        type: "text",
        value: text.slice(lastIndex),
      })
    }

    ;(parent.children as (Text | Element)[]).splice(index, 1, ...newNodes)
  })
}

const Math = ({ node }) => {
  const annotation = node.children.at(-1)

  const isInParagraph = useIsInParagraphContext()
  if (!annotation) return null
  const latex = annotation.value

  return createElement(LazyKateX, {
    children: latex,
    mode: isInParagraph ? "inline" : "display",
  })
}
