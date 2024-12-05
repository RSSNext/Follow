import { MemoedDangerousHTMLStyle } from "@follow/components/common/MemoedDangerousHTMLStyle.js"
import katexStyle from "katex/dist/katex.min.css?raw"
import { createElement, Fragment, memo, useEffect, useMemo, useState } from "react"

import { useShowAITranslation } from "~/atoms/ai-translation"
import { ENTRY_CONTENT_RENDER_CONTAINER_ID } from "~/constants/dom"
import { parseHtml } from "~/lib/parse-html"
import { useWrappedElementSize } from "~/providers/wrapped-element-provider"

import type { MediaInfoRecord } from "../media"
import { MediaContainerWidthProvider, MediaInfoRecordProvider } from "../media"
import { MarkdownRenderContainerRefContext } from "./context"

export type HTMLProps<A extends keyof JSX.IntrinsicElements = "div"> = {
  children: string | null | undefined
  as: A

  accessory?: React.ReactNode
  noMedia?: boolean
  mediaInfo?: MediaInfoRecord

  handleTranslate?: (html: HTMLElement | null) => void
} & JSX.IntrinsicElements[A] &
  Partial<{
    renderInlineStyle: boolean
  }>
const HTMLImpl = <A extends keyof JSX.IntrinsicElements = "div">(props: HTMLProps<A>) => {
  const {
    children,
    renderInlineStyle,
    as = "div",
    accessory,
    noMedia,
    mediaInfo,
    handleTranslate: translate,
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

  const [refElement, setRefElement] = useState<HTMLElement | null>(null)

  const showAITranslation = useShowAITranslation()

  useEffect(() => {
    translate?.(refElement)
  }, [refElement, showAITranslation, translate])

  const markdownElement = useMemo(
    () =>
      children &&
      parseHtml(children, {
        ...remarkOptions,
      }).toContent(),
    [children, remarkOptions],
  )

  const { w: containerWidth } = useWrappedElementSize()

  if (!markdownElement) return null
  return (
    <MarkdownRenderContainerRefContext.Provider value={refElement}>
      <MediaContainerWidthProvider width={containerWidth}>
        <MediaInfoRecordProvider mediaInfo={mediaInfo}>
          <MemoedDangerousHTMLStyle>{katexStyle}</MemoedDangerousHTMLStyle>
          {createElement(
            as,
            {
              ...rest,
              id: ENTRY_CONTENT_RENDER_CONTAINER_ID,
              ref: setRefElement,
            },
            markdownElement,
          )}
        </MediaInfoRecordProvider>
      </MediaContainerWidthProvider>
      {!!accessory && <Fragment key={shouldForceReMountKey}>{accessory}</Fragment>}
    </MarkdownRenderContainerRefContext.Provider>
  )
}

export const HTML = memo(HTMLImpl)
