import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { Fragment, jsx, jsxs } from "react/jsx-runtime"
import rehypeInferDescriptionMeta from "rehype-infer-description-meta"
import rehypeParse from "rehype-parse"
import rehypeSanitize from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import { unified } from "unified"
import { visit } from "unist-util-visit"
import { VFile } from "vfile"

export const parseHtml = async (content: string) => {
  const file = new VFile(content)

  const pipeline = await unified()
    .use(rehypeParse)
    .use(rehypeSanitize)
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
      jsx,
      jsxs,
      passNode: true,
    }),
  }
}
