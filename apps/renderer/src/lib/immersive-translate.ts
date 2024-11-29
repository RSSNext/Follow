import type { SupportedLanguages } from "@follow/models/types"
import { franc } from "franc-min"

import type { FlatEntryModel } from "~/store/entry"

import { LanguageMap, translate } from "./translate"

function textNodesUnder(el: Node) {
  const children: Node[] = el.nodeType === Node.TEXT_NODE ? [el] : []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const { currentNode } = walker
    if (currentNode.textContent) {
      children.push(currentNode)
    }
  }
  return children
}

const tagsToDuplicate = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote"]

export function immersiveTranslate({
  html,
  entry,
  cache,
  targetLanguage,
}: {
  html?: HTMLElement
  entry: FlatEntryModel
  cache?: {
    get: (key: string) => string | undefined
    set: (key: string, value: string) => void
  }
  targetLanguage?: SupportedLanguages
}) {
  if (!html) {
    return
  }

  const translation = entry.settings?.translation ?? targetLanguage

  const immersiveTranslateMark = html.querySelectorAll("[data-immersive-translate-mark=true]")
  if (immersiveTranslateMark.length > 0) {
    if (translation) {
      return
    }

    for (const mark of immersiveTranslateMark) {
      mark.remove()
    }
  }

  if (!translation) {
    return
  }

  if (html.childNodes.length === 1 && html.childNodes[0].nodeType === Node.TEXT_NODE) {
    const textNode = html.childNodes[0] as Text
    if (!textNode.textContent) {
      return
    }

    translate({
      entry,
      language: translation,
      part: textNode.textContent,
      extraFields: ["content"],
    }).then((transformed) => {
      if (!transformed?.content) {
        return
      }

      const p = document.createElement("p")
      p.append(document.createTextNode(textNode.textContent!))

      const fontTag = document.createElement("font")
      fontTag.dataset["immersiveTranslateMark"] = "true"
      fontTag.append(document.createElement("br"))
      fontTag.append(document.createTextNode(transformed.content))

      p.append(fontTag)

      textNode.replaceWith(p)
    })
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
    if (sourceLanguage === LanguageMap[translation].code) {
      return
    }

    const children = Array.from(tag.childNodes)
    tag.dataset.childCount = children.filter((child) => child.textContent).length.toString()

    const fontTag = document.createElement("font")
    fontTag.dataset["immersiveTranslateMark"] = "true"

    if (children.length > 0) {
      fontTag.style.display = "none"
    }

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

        const { textContent } = textNode

        const afterTranslate = (translated: string) => {
          textNode.textContent = translated

          if (tag.dataset.childCount === undefined) {
            throw new Error("childCount is undefined")
          }
          let childCount = Number.parseInt(tag.dataset.childCount)
          childCount -= 1
          tag.dataset.childCount = childCount.toString()
          if (childCount === 0) {
            fontTag.style.display = "initial"
          }
        }

        if (cache) {
          const cached = cache.get(textContent)
          if (cached) {
            afterTranslate(cached)
            continue
          }
        }

        translate({
          entry,
          language: translation,
          part: textContent,
          extraFields: ["content"],
        }).then((transformed) => {
          if (!transformed?.content) {
            return
          }

          afterTranslate(transformed.content)
          if (cache) {
            cache.set(textContent, transformed.content)
          }
        })
      }

      fontTag.append(clone)
    }

    const parentFontTag = document.createElement("font")
    parentFontTag.dataset["immersiveTranslateMark"] = "true"
    parentFontTag.append(document.createElement("br"))
    parentFontTag.append(fontTag)

    tag.append(parentFontTag)
  }
}
