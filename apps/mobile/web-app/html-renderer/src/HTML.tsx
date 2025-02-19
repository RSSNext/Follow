import { MemoedDangerousHTMLStyle } from "@follow/components/common/MemoedDangerousHTMLStyle.js"
import { clsx } from "clsx"
import katexStyle from "katex/dist/katex.min.css?raw"
import { createElement, Fragment, useEffect, useMemo, useState } from "react"

import { WrappedElementProvider } from "./common/WrappedElementProvider"
import { MarkdownRenderContainerRefContext } from "./components/__internal/ctx"
import { parseHtml } from "./parser"

export type HTMLProps<A extends keyof JSX.IntrinsicElements = "div"> = {
  children: string | null | undefined
  as?: A

  accessory?: React.ReactNode
  noMedia?: boolean
} & JSX.IntrinsicElements[A] &
  Partial<{
    renderInlineStyle: boolean
  }>
export const HTML = <A extends keyof JSX.IntrinsicElements = "div">(props: HTMLProps<A>) => {
  const {
    children,
    renderInlineStyle,
    as = "article",
    accessory,
    noMedia,

    ...rest
  } = props
  const [remarkOptions, setRemarkOptions] = useState({
    renderInlineStyle,
    noMedia,
  })
  const [shouldForceReMountKey, setShouldForceReMountKey] = useState(0)

  useEffect(() => {
    setRemarkOptions((options) => {
      if (JSON.stringify(options) === JSON.stringify({ renderInlineStyle, noMedia })) {
        return options
      }

      setShouldForceReMountKey((key) => key + 1)
      return { ...options, renderInlineStyle, noMedia }
    })
  }, [renderInlineStyle, noMedia])

  const [refElement, setRefElement] = useState<HTMLDivElement | null>(null)

  const markdownElement = useMemo(
    () =>
      children &&
      parseHtml(children, {
        ...remarkOptions,
      }).toContent(),
    [children, remarkOptions],
  )

  if (!markdownElement) return <div className="h-px" />
  return (
    <MarkdownRenderContainerRefContext.Provider value={refElement}>
      <MemoedDangerousHTMLStyle>{katexStyle}</MemoedDangerousHTMLStyle>
      <WrappedElementProvider>
        {createElement(
          as,
          {
            ...rest,
            ref: setRefElement,
            className: clsx("prose mx-auto px-3", "dark:prose-invert"),
          },
          markdownElement,
        )}
      </WrappedElementProvider>

      {!!accessory && <Fragment key={shouldForceReMountKey}>{accessory}</Fragment>}
    </MarkdownRenderContainerRefContext.Provider>
  )
}
