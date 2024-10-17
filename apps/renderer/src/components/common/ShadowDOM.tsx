import { nanoid } from "nanoid"
import type { FC, PropsWithChildren, ReactNode } from "react"
import { createContext, createElement, useContext, useLayoutEffect, useMemo, useState } from "react"
import root from "react-shadow"

import { useUISettingKey } from "~/atoms/settings/ui"
import { useReduceMotion } from "~/hooks/biz/useReduceMotion"
import { useIsDark } from "~/hooks/common"

import { MemoedDangerousHTMLStyle } from "./MemoedDangerousHTMLStyle"

const ShadowDOMContext = createContext(false)

const weakMapElementKey = new WeakMap<HTMLStyleElement | HTMLLinkElement, string>()
const cloneStylesElement = (_mutationRecord?: MutationRecord) => {
  const $styles = document.head.querySelectorAll("style").values()
  const reactNodes = [] as ReactNode[]

  for (const $style of $styles) {
    let key = weakMapElementKey.get($style)

    if (!key) {
      key = nanoid(8)

      weakMapElementKey.set($style, key)
    }

    reactNodes.push(
      createElement(MemoedDangerousHTMLStyle, {
        key,
        children: $style.innerHTML,
      }),
    )

    const styles = getLinkedStaticStyleSheets()

    for (const style of styles) {
      let key = weakMapElementKey.get(style.ref)
      if (!key) {
        key = nanoid(8)
        weakMapElementKey.set(style.ref, key)
      }

      reactNodes.push(
        createElement(MemoedDangerousHTMLStyle, {
          key,
          children: style.cssText,
          ["data-href"]: style.ref.href,
        }),
      )
    }
  }

  return reactNodes
}
export const ShadowDOM: FC<PropsWithChildren<React.HTMLProps<HTMLElement>>> & {
  useIsShadowDOM: () => boolean
} = (props) => {
  const { ...rest } = props

  const [stylesElements, setStylesElements] = useState<ReactNode[]>(cloneStylesElement)

  useLayoutEffect(() => {
    const mutationObserver = new MutationObserver((e) => {
      const event = e[0]

      setStylesElements(cloneStylesElement(event))
    })
    mutationObserver.observe(document.head, {
      childList: true,
      subtree: true,
    })

    return () => {
      mutationObserver.disconnect()
    }
  }, [])

  const dark = useIsDark()

  const uiFont = useUISettingKey("uiFontFamily")
  const reduceMotion = useReduceMotion()
  const usePointerCursor = useUISettingKey("usePointerCursor")

  return (
    <root.div {...rest}>
      <ShadowDOMContext.Provider value={true}>
        <div
          style={useMemo(
            () => ({
              fontFamily: `${uiFont},"SN Pro", system-ui, sans-serif`,
              "--pointer": usePointerCursor ? "pointer" : "default",
            }),
            [uiFont, usePointerCursor],
          )}
          id="shadow-html"
          data-motion-reduce={reduceMotion}
          data-theme={dark ? "dark" : "light"}
          className="font-theme"
        >
          {stylesElements}
          {props.children}
        </div>
      </ShadowDOMContext.Provider>
    </root.div>
  )
}

ShadowDOM.useIsShadowDOM = () => useContext(ShadowDOMContext)

const cacheCssTextMap = {} as Record<string, string>

function getLinkedStaticStyleSheets() {
  const $links = document.head
    .querySelectorAll("link[rel=stylesheet]")
    .values() as unknown as HTMLLinkElement[]

  const styleSheetMap = new WeakMap<Element | ProcessingInstruction, CSSStyleSheet>()

  const cssArray = [] as { cssText: string; ref: HTMLLinkElement }[]

  for (const sheet of document.styleSheets) {
    if (!sheet.href) continue
    if (!sheet.ownerNode) continue
    styleSheetMap.set(sheet.ownerNode, sheet)
  }

  for (const $link of $links) {
    const sheet = styleSheetMap.get($link)
    if (!sheet) continue
    if (!sheet.href) continue
    const hasCache = cacheCssTextMap[sheet.href]
    if (!hasCache) {
      if (!sheet.href) continue
      try {
        const rules = sheet.cssRules || sheet.rules
        let cssText = ""
        for (const rule of rules) {
          cssText += rule.cssText
        }
        cacheCssTextMap[sheet.href] = cssText
      } catch (err) {
        console.error("Failed to get cssText for", sheet.href, err)
      }
    }

    cssArray.push({
      cssText: cacheCssTextMap[sheet.href],
      ref: $link,
    })
  }

  return cssArray
}
