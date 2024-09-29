import { franc } from "franc-min"

import type { FlatEntryModel } from "~/store/entry"

import { LanguageMap, translate } from "./translate"

function textNodesUnder(el: Node) {
  const children: Node[] = el.nodeType === Node.TEXT_NODE ? [el] : []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    children.push(walker.currentNode)
  }
  return children
}

const tagsToDuplicate = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote"]

export function immersiveTranslate({ html, entry }: { html?: HTMLElement; entry: FlatEntryModel }) {
  if (!html || !entry.settings?.translation) {
    return
  }

  const tags = Array.from(html.querySelectorAll(tagsToDuplicate.join(","))).filter((tag) => {
    const children = tag.querySelectorAll(tagsToDuplicate.join(","))
    if (children.length > 0) {
      return false
    }
    return true
  }) as HTMLElement[]

  for (const tag of tags) {
    const sourceLanguage = franc(tag.textContent ?? "")
    if (sourceLanguage === LanguageMap[entry.settings?.translation].code) {
      return
    }

    const children = Array.from(tag.childNodes)
    tag.dataset.childCount = children.length.toString()

    const fontTag = document.createElement("font")
    fontTag.style.display = "none"

    for (const child of children) {
      const clone = child.cloneNode(true)
      const textNodes = textNodesUnder(clone)
      if (textNodes.length === 0) {
        continue
      }

      for (const textNode of textNodes) {
        if (textNode.textContent === null) {
          continue
        }

        translate({
          entry,
          language: entry.settings?.translation,
          part: textNode.textContent,
          extraFields: ["content"],
        }).then((transformed) => {
          if (!transformed?.content) {
            return
          }

          textNode.textContent = transformed.content

          if (tag.dataset.childCount === undefined) {
            throw new Error("childCount is undefined")
          }
          let childCount = Number.parseInt(tag.dataset.childCount)
          childCount -= 1
          tag.dataset.childCount = childCount.toString()
          if (childCount === 0) {
            fontTag.style.display = "initial"
          }
        })
      }

      fontTag.append(clone)
    }

    const parentFontTag = document.createElement("font")
    parentFontTag.append(document.createElement("br"))
    parentFontTag.append(fontTag)

    tag.append(parentFontTag)
  }
}
