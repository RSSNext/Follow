import { useThemeAtomValue } from "@renderer/hooks/common"
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

  const theme = useThemeAtomValue()
  return (
    <root.div {...rest}>
      <ShadowDOMContext.Provider value={true}>
        <html data-theme={theme}>
          <head>
            {stylesElements.map((styleElement, index) => (
              <style
                key={index}
                dangerouslySetInnerHTML={{ __html: styleElement.innerHTML }}
              />
            ))}
          </head>
          {props.children}
        </html>
      </ShadowDOMContext.Provider>
    </root.div>
  )
}

ShadowDOM.useIsShadowDOM = () => useContext(ShadowDOMContext)
