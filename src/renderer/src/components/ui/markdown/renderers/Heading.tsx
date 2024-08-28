import { springScrollToElement } from "@renderer/lib/scroller"
import { cn } from "@renderer/lib/utils"
import { useContext, useId, useLayoutEffect, useRef, useState } from "react"

import { useScrollViewElement } from "../../scroll-area/hooks"
import { MarkdownRenderContainerRefContext } from "../context"

export const createHeadingRenderer =
  (level: number) =>
    (
      props: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >,
    ) => {
      const rid = useId()

      const As = `h${level}` as any
      const { node, ...rest } = props as any

      const scroller = useScrollViewElement()
      const renderContainer = useContext(MarkdownRenderContainerRefContext)
      const ref = useRef<HTMLHeadingElement>(null)

      const [currentTitleTop, setCurrentTitleTop] = useState(0)
      useLayoutEffect(() => {
        const $heading = ref.current
        if (!$heading) return
        const { top } = $heading.getBoundingClientRect()
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-layout-effect
        setCurrentTitleTop(top | 0)
      }, [])

      return (
        <As
          ref={ref}
          data-container-top={currentTitleTop}
          {...rest}
          data-rid={rid}
          className={cn(rest.className, "group relative")}
        >
          {rest.children}
          <span
            className={cn(
              "cursor-pointer select-none text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100",
              "relative ml-2",
              "@2xl:absolute @2xl:left-[-1.5em] @2xl:top-0 @2xl:opacity-0",
            )}
            aria-hidden
            onClick={() => {
              if (!renderContainer) return

              springScrollToElement(
                renderContainer.querySelector(`[data-rid="${rid}"]`)!,
                -100,
                scroller!,
              )
            }}
          >
            <i className="i-mingcute-hashtag-line invisible" />
            <span className="center absolute inset-0">
              <i className="i-mingcute-hashtag-line" />
            </span>
          </span>
        </As>
      )
    }
