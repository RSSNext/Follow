import { useIsDark } from "@renderer/hooks/common"
import type { FC, PropsWithChildren, ReactNode } from "react"
import {
  createContext,
  createElement,
  useContext,
  useLayoutEffect,
  useState,
} from "react"
import root from "react-shadow"

const ShadowDOMContext = createContext(false)

const cloneStylesElement = () => {
  const $styles = document.head.querySelectorAll("style").values()
  const reactNodes = [] as ReactNode[]
  let i = 0
  for (const style of $styles) {
    const key = `style-${i++}`
    reactNodes.push(
      createElement("style", {
        key,
        dangerouslySetInnerHTML: { __html: style.innerHTML },
      }),
    )
  }

  document.head.querySelectorAll("link[rel=stylesheet]").forEach((link) => {
    const key = `link-${i++}`
    reactNodes.push(
      createElement("link", {
        key,
        rel: "stylesheet",
        href: link.getAttribute("href"),
        crossOrigin: link.getAttribute("crossorigin"),
      }),
    )
  })

  return reactNodes
}
export const ShadowDOM: FC<PropsWithChildren<React.HTMLProps<HTMLElement>>> & {
  useIsShadowDOM: () => boolean
} = (props) => {
  const { ...rest } = props

  const [stylesElements, setStylesElements] =
    useState<ReactNode[]>(cloneStylesElement)

  useLayoutEffect(() => {
    const mutationObserver = new MutationObserver(() => {
      setStylesElements(cloneStylesElement())
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
  return (
    <root.div {...rest}>
      <ShadowDOMContext.Provider value={true}>
        <div data-theme={dark ? "dark" : "light"}>
          <head>{stylesElements}</head>
          {props.children}
        </div>
      </ShadowDOMContext.Provider>
    </root.div>
  )
}

ShadowDOM.useIsShadowDOM = () => useContext(ShadowDOMContext)
