import { ProviderComposer } from "@renderer/components/common/ProviderComposer"
import { cn } from "@renderer/lib/utils"
import { createContextState } from "foxact/create-context-state"
import { useIsomorphicLayoutEffect } from "foxact/use-isomorphic-layout-effect"
import { memo, useEffect, useRef } from "react"

const [
  WrappedElementProviderInternal,
  useWrappedElement,
  useSetWrappedElement,
] = createContextState<HTMLDivElement | null>(undefined as any)

const [
  ElementSizeProviderInternal,
  useWrappedElementSize,
  useSetWrappedElementSize,
] = createContextState({
  h: 0,
  w: 0,
})

const [
  ElementPositionProviderInternal,
  useWrappedElementPosition,
  useSetElementPosition,
] = createContextState({
  x: 0,
  y: 0,
})

const [
  IsEndOfElementProviderInternal,
  useIsEoFWrappedElement,
  useSetIsEOfElement,
] = createContextState<boolean>(false)

const [
  IsStartOfElementProviderInternal,
  useIsSoFWrappedElement,
  useSetIsSOfElement,
] = createContextState<boolean>(false)

const Providers = [
  <WrappedElementProviderInternal key="ArticleElementProviderInternal" />,
  <ElementSizeProviderInternal key="ElementSizeProviderInternal" />,
  <ElementPositionProviderInternal key="ElementPositionProviderInternal" />,
  <IsEndOfElementProviderInternal key="IsEndOfElementProviderInternal" />,
  <IsStartOfElementProviderInternal key="IsStartOfElementProviderInternal" />,
]

interface WrappedElementProviderProps {
  boundingDetection?: boolean
  as?: keyof React.JSX.IntrinsicElements
}

export const WrappedElementProvider: Component<WrappedElementProviderProps> = ({
  children,
  className,
  ...props
}) => (
  <ProviderComposer contexts={Providers}>
    <ArticleElementResizeObserver />
    <Content {...props} className={className}>
      {children}
    </Content>
  </ProviderComposer>
)
const ArticleElementResizeObserver = () => {
  const setSize = useSetWrappedElementSize()
  const setPos = useSetElementPosition()
  const $article = useWrappedElement()
  useIsomorphicLayoutEffect(() => {
    if (!$article) return
    const { height, width, x, y } = $article.getBoundingClientRect()
    setSize({ h: height, w: width })
    setPos({ x, y })

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      const { height, width, x, y } = entry.contentRect
      setSize({ h: height, w: width })
      setPos({ x, y })
    })
    observer.observe($article)
    return () => {
      observer.unobserve($article)
      observer.disconnect()
    }
  }, [$article])

  return null
}

const Content: Component<WrappedElementProviderProps> = memo(
  ({ children, className, boundingDetection, as = "div" }) => {
    const setElement = useSetWrappedElement()

    const As = as as any
    return (
      <As className={cn("relative", className)} ref={setElement}>
        {boundingDetection && <BoundingDetection bounding="start" />}
        {children}
        {boundingDetection && <BoundingDetection bounding="end" />}
      </As>
    )
  },
)

Content.displayName = "ArticleElementProviderContent"

const BoundingDetection: Component<{
  bounding: "start" | "end"
}> = ({ bounding }) => {
  const endSetter = useSetIsEOfElement()
  const startSetter = useSetIsSOfElement()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const $el = ref.current
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (bounding === "start") startSetter(entry.isIntersecting)
        else endSetter(entry.isIntersecting)
      },
      {
        rootMargin: "0px 0px 0px 0px",
      },
    )

    observer.observe($el)
    return () => {
      observer.unobserve($el)
      observer.disconnect()
    }
  }, [])

  return <div ref={ref} />
}

export {
  useIsEoFWrappedElement,
  useIsSoFWrappedElement,
  useSetWrappedElement,
  useWrappedElement,
  useWrappedElementPosition,
  useWrappedElementSize,
}
