import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useState } from "react"
import root from "react-shadow"

const ShadowDOMContext = createContext(false)
export const ShadowDOM: FC<PropsWithChildren<React.HTMLProps<HTMLElement>>> & {
  useIsShadowDOM: () => boolean
} = (props) => {
  const { ...rest } = props

  const [stylesElements] = useState<HTMLStyleElement[]>(() => [
    ...document.head.querySelectorAll("style").values(),
  ])

  return (
    <root.div {...rest}>
      <ShadowDOMContext.Provider value={true}>
        {stylesElements.map((styleElement, index) => (
          <style
            key={index}
            dangerouslySetInnerHTML={{ __html: styleElement.innerHTML }}
          />
        ))}
        {props.children}
      </ShadowDOMContext.Provider>
    </root.div>
  )
}

ShadowDOM.useIsShadowDOM = () => useContext(ShadowDOMContext)
