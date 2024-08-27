import type { FC, PropsWithChildren } from "react"
import { useInsertionEffect, useState } from "react"
import root from "react-shadow"

export const ShadowDOM: FC<PropsWithChildren<React.HTMLProps<HTMLElement>>> = (
  props,
) => {
  const { ...rest } = props

  const [stylesElements, setStylesElements] = useState<HTMLStyleElement[]>([])
  const [isReady, setIsReady] = useState(false)
  useInsertionEffect(() => {
    setStylesElements([...document.head.querySelectorAll("style").values()])
    setIsReady(true)
  }, [])

  if (!isReady) {
    return null
  }

  return (
    <root.div {...rest}>
      {stylesElements.map((styleElement, index) => (
        <style
          key={index}
          dangerouslySetInnerHTML={{ __html: styleElement.innerHTML }}
        />
      ))}
      {props.children}
    </root.div>
  )
}
