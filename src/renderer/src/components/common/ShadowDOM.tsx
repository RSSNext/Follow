import { useIsDark } from "@renderer/hooks/common"
import type { FC, PropsWithChildren, ReactNode } from "react"
import { createContext, createElement, useContext, useState } from "react"
import root from "react-shadow"

const ShadowDOMContext = createContext(false)
export const ShadowDOM: FC<PropsWithChildren<React.HTMLProps<HTMLElement>>> & {
  useIsShadowDOM: () => boolean
} = (props) => {
  const { ...rest } = props

  const [stylesElements] = useState<ReactNode[]>(() => {
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
    return reactNodes
  })

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
