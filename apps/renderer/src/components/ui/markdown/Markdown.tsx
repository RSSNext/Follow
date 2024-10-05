import { createElement, Fragment, memo, useEffect, useMemo, useState } from "react"

import { parseHtml } from "~/lib/parse-html"
import type { RemarkOptions } from "~/lib/parse-markdown"
import { parseMarkdown } from "~/lib/parse-markdown"
import { cn } from "~/lib/utils"
import { useWrappedElementSize } from "~/providers/wrapped-element-provider"

import type { MediaInfoRecord } from "../media"
import { MediaContainerWidthProvider, MediaInfoRecordProvider } from "../media"
import { MarkdownRenderContainerRefContext } from "./context"

export const Markdown: Component<
  {
    children: string
  } & Partial<RemarkOptions>
> = ({ children, components, className }) => {
  const stableRemarkOptions = useState({ components })[0]

  const markdownElement = useMemo(
    () => parseMarkdown(children, { ...stableRemarkOptions }).content,
    [children, stableRemarkOptions],
  )
  const [refElement, setRefElement] = useState<HTMLElement | null>(null)

  return (
    <MarkdownRenderContainerRefContext.Provider value={refElement}>
      <article
        className={cn(
          "prose relative cursor-auto select-text dark:prose-invert prose-th:text-left",
          className,
        )}
        ref={setRefElement}
      >
        {markdownElement}
      </article>
    </MarkdownRenderContainerRefContext.Provider>
  )
}

const HTMLImpl = <A extends keyof JSX.IntrinsicElements = "div">(
  props: {
    children: string | null | undefined
    as: A

    accessory?: React.ReactNode
    noMedia?: boolean
    mediaInfo?: MediaInfoRecord
  } & JSX.IntrinsicElements[A] &
    Partial<{
      renderInlineStyle: boolean
    }>,
) => {
  const { children, renderInlineStyle, as = "div", accessory, noMedia, mediaInfo, ...rest } = props
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
          {createElement(as, { ...rest, ref: setRefElement }, markdownElement)}
        </MediaInfoRecordProvider>
      </MediaContainerWidthProvider>
      {accessory && <Fragment key={shouldForceReMountKey}>{accessory}</Fragment>}
    </MarkdownRenderContainerRefContext.Provider>
  )
}

export const HTML = memo(HTMLImpl)
