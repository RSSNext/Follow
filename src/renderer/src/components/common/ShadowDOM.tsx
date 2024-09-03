import { useUISettingKey } from "@renderer/atoms/settings/ui"
import { useIsDark } from "@renderer/hooks/common"
import { nanoid } from "nanoid"
import type { FC, PropsWithChildren, ReactNode } from "react"
import {
  createContext,
  createElement,
  memo,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react"
import root from "react-shadow"

const ShadowDOMContext = createContext(false)

const MemoedDangerousHTMLStyle: FC<{ children: string }> = memo(
  ({ children }) => (
    <style
      dangerouslySetInnerHTML={useMemo(
        () => ({
          __html: children,
        }),
        [children],
      )}
    />
  ),
)

const weakMapElementKey = new WeakMap<
  HTMLStyleElement | HTMLLinkElement,
  string
>()
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
  }

  return reactNodes
}
export const ShadowDOM: FC<PropsWithChildren<React.HTMLProps<HTMLElement>>> & {
  useIsShadowDOM: () => boolean
} = (props) => {
  const { ...rest } = props

  const [stylesElements, setStylesElements] =
    useState<ReactNode[]>(cloneStylesElement)

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
  const staticStyleSheet = useState(getLinkedStaticStyleSheet)[0]

  return (
    <root.div {...rest}>
      <ShadowDOMContext.Provider value={true}>
        <div
          style={useMemo(() => ({
            fontFamily: uiFont,
          }), [uiFont])}
          id="shadow-html"
          data-theme={dark ? "dark" : "light"}
          className="font-theme"
        >
          <MemoedDangerousHTMLStyle>{staticStyleSheet}</MemoedDangerousHTMLStyle>
          {stylesElements}
          {props.children}
        </div>
      </ShadowDOMContext.Provider>
    </root.div>
  )
}

ShadowDOM.useIsShadowDOM = () => useContext(ShadowDOMContext)

function getLinkedStaticStyleSheet() {
  let cssText = ""

  for (const sheet of document.styleSheets) {
    if (!sheet.href) continue
    const rules = sheet.cssRules || sheet.rules
    for (const rule of rules) {
      cssText += `${rule.cssText}\n`
    }
  }
  return cssText
}
